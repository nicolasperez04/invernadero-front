import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../models/event.model';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestión de eventos del invernadero.
 * Maneja el registro de siembras, cosechas y otras actividades.
 *
 * @usage
 * ```typescript
 * const eventService = inject(EventService);
 * // Obtener todos los eventos
 * eventService.getAll().subscribe(events => ...);
 * // Obtener eventos por lote
 * eventService.getByLot(1).subscribe(events => ...);
 * // Filtrar eventos
 * eventService.filter({ type: 'SIEMBRA', lotId: 1 }).subscribe(...);
 * ```
 *
 * @see Event
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class EventService {
  /** URL base de la API de eventos */
  private api = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los eventos del sistema.
   * Ordenados cronológicamente por defecto (más recientes primero).
   *
   * @returns Observable que emite un array de Event
   * @throws Error si la API responde con código de error
   *
   * @example
   * ```typescript
   * eventService.getAll().subscribe(events => {
   *   events.forEach(e => console.log(e.type, e.date));
   * });
   * ```
   */
  getAll(): Observable<Event[]> {
    return this.http.get<Event[]>(this.api);
  }

  /**
   * Obtiene un evento específico por su ID.
   *
   * @param id - Identificador único del evento
   * @returns Observable que emite el Event solicitado
   * @throws Error si el evento no existe (404)
   *
   * @example
   * ```typescript
   * eventService.getById(5).subscribe(event => {
   *   console.log('Tipo:', event.type);
   *   console.log('Fecha:', event.date);
   * });
   * ```
   */
  getById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.api}/${id}`);
  }

  /**
   * Obtiene todos los eventos asociados a un lote específico.
   * Útil para ver el historial de actividades de un lote.
   *
   * @param lotId - Identificador único del lote
   * @returns Observable que emite array de Event ordenados por fecha
   * @throws Error si el lote no existe
   *
   * @example
   * ```typescript
   * eventService.getByLot(1).subscribe(events => {
   *   console.log(`El lote tiene ${events.length} eventos`);
   * });
   * ```
   */
  getByLot(lotId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.api}/lot/${lotId}`);
  }

  /**
   * Crea un nuevo evento en el sistema.
   * Puede ser de tipo: SIEMBRA, COSECHA, RIEGO, FERTILIZACION, etc.
   *
   * @param event - Objeto con los datos del evento (type, lotId, date, notes, etc.)
   * @returns Observable que emite el evento creado con su ID asignado
   * @throws Error si los datos son inválidos o el lote no existe
   *
   * @example
   * ```typescript
   * eventService.create({
   *   type: 'SIEMBRA',
   *   lotId: 1,
   *   date: new Date().toISOString(),
   *   quantity: 100,
   *   notes: 'Siembra de prueba'
   * }).subscribe(newEvent => console.log('ID:', newEvent.id));
   * ```
   */
  create(event: any): Observable<Event> {
    return this.http.post<Event>(this.api, event);
  }

  /**
   * Filtra eventos según criterios específicos.
   * Permite buscar por tipo, lote, rango de fechas, etc.
   *
   * @param params - Objeto con criterios de filtro
   * @property {string} [params.type] - Tipo de evento (SIEMBRA, COSECHA, etc.)
   * @property {number} [params.lotId] - ID del lote
   * @property {string} [params.startDate] - Fecha inicial (ISO string)
   * @property {string} [params.endDate] - Fecha final (ISO string)
   * @returns Observable que emite array de Event que cumplen los filtros
   * @throws Error si los parámetros son inválidos
   *
   * @example
   * ```typescript
   * eventService.filter({
   *   type: 'COSECHA',
   *   startDate: '2024-01-01',
   *   endDate: '2024-12-31'
   * }).subscribe(events => console.log(events.length));
   * ```
   */
  filter(params: any): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.api}/filter`, { params });
  }
}
