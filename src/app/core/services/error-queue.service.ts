import { Injectable } from '@angular/core';

export type ErrorType = 'RUNTIME' | 'HTTP-400' | 'HTTP-403' | 'HTTP-404' | 'HTTP-409' | 'HTTP-500' | 'HTTP-0' | 'COMPILE';

export interface QueuedError {
  id: string;
  type: ErrorType;
  message: string;
  url?: string;
  stack?: string;
  source?: string;
  timestamp: string;
  status?: number;
  method?: string;
  reported: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorQueueService {
  private readonly STORAGE_KEY = 'taiga_error_queue';
  private readonly MAX_HISTORY = 100;
  private readonly DEDUP_WINDOW_MS = 60000;

  private errors: QueuedError[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch {
      this.errors = [];
    }
  }

  private saveToStorage(): void {
    try {
      const toSave = this.errors.slice(0, this.MAX_HISTORY);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      console.warn('No se pudo guardar la cola de errores en localStorage');
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private isDuplicate(newError: Partial<QueuedError>): boolean {
    const windowStart = Date.now() - this.DEDUP_WINDOW_MS;
    return this.errors.some(
      (e) =>
        e.type === newError.type &&
        e.message === newError.message &&
        new Date(e.timestamp).getTime() > windowStart
    );
  }

  enqueue(error: Partial<QueuedError>): void {
    if (this.isDuplicate(error)) {
      console.warn('Error duplicado omitido:', error.message);
      return;
    }

    const queued: QueuedError = {
      id: this.generateId(),
      type: error.type || 'RUNTIME',
      message: error.message || 'Error desconocido',
      url: error.url,
      stack: error.stack,
      source: error.source,
      timestamp: error.timestamp || new Date().toISOString(),
      status: error.status,
      reported: false,
    };

    this.errors.unshift(queued);
    this.saveToStorage();
    console.log('Error encolado en Taiga:', queued);
  }

  getErrors(): QueuedError[] {
    return [...this.errors];
  }

  getSessionErrors(): QueuedError[] {
    const sessionStart = sessionStorage.getItem('sessionStart');
    if (!sessionStart) {
      sessionStorage.setItem('sessionStart', Date.now().toString());
      return this.getErrors();
    }

    const startTime = parseInt(sessionStart, 10);
    return this.errors.filter((e) => new Date(e.timestamp).getTime() >= startTime);
  }

  getHistoricalErrors(): QueuedError[] {
    const sessionStart = sessionStorage.getItem('sessionStart');
    if (!sessionStart) {
      return [];
    }

    const startTime = parseInt(sessionStart, 10);
    return this.errors.filter((e) => new Date(e.timestamp).getTime() < startTime);
  }

  getUnreportedErrors(): QueuedError[] {
    return this.errors.filter((e) => !e.reported);
  }

  markAsReported(ids: string[]): void {
    ids.forEach((id) => {
      const error = this.errors.find((e) => e.id === id);
      if (error) {
        error.reported = true;
      }
    });
    this.saveToStorage();
  }

  clearSession(): void {
    const sessionStart = sessionStorage.getItem('sessionStart');
    if (!sessionStart) return;

    const startTime = parseInt(sessionStart, 10);
    this.errors = this.errors.filter(
      (e) => new Date(e.timestamp).getTime() < startTime
    );
    this.saveToStorage();
  }

  clearAll(): void {
    this.errors = [];
    this.saveToStorage();
  }

  exportToJSON(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  importFromJSON(json: string): number {
    try {
      const imported = JSON.parse(json) as QueuedError[];
      const before = this.errors.length;
      this.errors = [...imported, ...this.errors].slice(0, this.MAX_HISTORY);
      this.saveToStorage();
      return this.errors.length - before;
    } catch {
      return 0;
    }
  }
}
