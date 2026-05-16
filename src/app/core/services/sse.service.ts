import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SseService implements OnDestroy {
  private eventSource: EventSource | null = null;
  private eventsSubject = new Subject<{ type: string; data: any }>();
  events$ = this.eventsSubject.asObservable();

  connect(): void {
    if (this.eventSource) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    this.eventSource = new EventSource(
      `${environment.apiUrl}/sse/subscribe?token=${token}`
    );

    this.eventSource.addEventListener('dashboard', (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data);
        this.eventsSubject.next({ type: parsed.type, data: parsed });
      } catch {
        // ignore parse errors
      }
    });

    this.eventSource.onerror = () => {
      this.disconnect();
      setTimeout(() => this.connect(), 3000);
    };
  }

  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.eventsSubject.complete();
  }
}
