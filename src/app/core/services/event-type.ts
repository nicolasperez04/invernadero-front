import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interfaz que representa un tipo de evento.
 * Los tipos de evento categorizan las actividades del invernadero.
 */
export interface EventType {
  /** Identificador único del tipo de evento */
  id: number;
  /** Nombre descriptivo del tipo (ej: 'SIEMBRA', 'COSECHA') */
  name: string;
  /** Categoría a la que pertenece (ej: 'PRODUCCION', 'MANTENIMIENTO') */
  category: string;
}

/**
 * Servicio para gestión de tipos de eventos.
 * Provee acceso de solo lectura a los tipos de eventos disponibles.
 *
 * @usage
 * ```typescript
 * const eventTypeService = inject(EventTypeService);
 * // Obtener todos los tipos de evento
 * eventTypeService.getAll().subscribe(types => ...);
 * ```
 *
 * @see EventType
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class EventTypeService {
  /** URL base de la API de tipos de eventos */
  private api = `${environment.apiUrl}/event-types`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los tipos de eventos disponibles en el sistema.
   * Estos tipos son utilizados al crear eventos (siembra, cosecha, etc.).
   *
   * @returns Observable que emite un array de EventType
   * @throws Error si la API responde con código de error
   *
   * @example
   * ```typescript
   * eventTypeService.getAll().subscribe(types => {
   *   types.forEach(type => {
   *     console.log(`${type.name} (${type.category})`);
   *   });
   * });
   * ```
   */
  getAll(): Observable<EventType[]> {
    return this.http.get<EventType[]>(this.api);
  }

  /**
   * Obtiene los tipos de evento disponibles para un cultivo específico.
   *
   * @param cropId - Identificador del cultivo
   * @returns Observable que emite un array de EventType asociados al cultivo
   */
  getByCrop(cropId: number): Observable<EventType[]> {
    return this.http.get<EventType[]>(`${environment.apiUrl}/crops/${cropId}/event-types`);
  }
}
