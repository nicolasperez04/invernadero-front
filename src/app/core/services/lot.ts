import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lot, LotSummary } from '../../models/lot.model';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestión de lotes del invernadero.
 * Provee operaciones CRUD y consultas específicas contra la API REST.
 *
 * @usage
 * ```typescript
 * const lotService = inject(LotService);
 * // Obtener todos los lotes
 * lotService.getAll().subscribe(lots => ...);
 * // Obtener resumen de un lote
 * lotService.getSummary(1).subscribe(summary => ...);
 * // Obtener lotes por cultivo
 * lotService.getByCrop(1).subscribe(lots => ...);
 * ```
 *
 * @see Lot
 * @see LotSummary
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class LotService {
  /** URL base de la API de lotes */
  private api = `${environment.apiUrl}/lots`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los lotes del sistema, opcionalmente filtrados.
   *
   * @param params - Parámetros opcionales de filtro (ej: { status: 'IN_PRODUCTION' })
   * @returns Observable que emite un array de Lot
   *
   * @example
   * ```typescript
   * lotService.getAll().subscribe(lots => ...);
   * lotService.getAll({ status: 'IN_PRODUCTION' }).subscribe(lots => ...);
   * ```
   */
  getAll(params?: { status?: string }): Observable<Lot[]> {
    return this.http.get<Lot[]>(this.api, { params: params as any });
  }

  /**
   * Obtiene un lote específico por su ID.
   *
   * @param id - Identificador único del lote
   * @returns Observable que emite el Lot solicitado
   * @throws Error si el lote no existe (404)
   *
   * @example
   * ```typescript
   * lotService.getById(3).subscribe(lot => {
   *   console.log(`Lote: ${lot.name}, Cultivo: ${lot.cropId}`);
   * });
   * ```
   */
  getById(id: number): Observable<Lot> {
    return this.http.get<Lot>(`${this.api}/${id}`);
  }

  /**
   * Crea un nuevo lote en el sistema.
   *
   * @param lot - Objeto parcial con los datos del lote
   * @returns Observable que emite el lote creado con su ID asignado
   * @throws Error si los datos son inválidos o hay error de servidor
   *
   * @example
   * ```typescript
   * lotService.create({
   *   name: 'Lote A1',
   *   cropId: 1,
   *   capacity: 100,
   *   status: 'ACTIVE'
   * }).subscribe(newLot => console.log('ID:', newLot.id));
   * ```
   */
  create(lot: Partial<Lot>): Observable<Lot> {
    return this.http.post<Lot>(this.api, lot);
  }

  /**
   * Actualiza un lote existente.
   *
   * @param id - Identificador único del lote a actualizar
   * @param lot - Objeto parcial con los campos a modificar
   * @returns Observable que emite el lote actualizado
   * @throws Error si el lote no existe o datos inválidos
   *
   * @example
   * ```typescript
   * lotService.update(1, { capacity: 150 }).subscribe(updated => {
   *   console.log('Capacidad actualizada:', updated.capacity);
   * });
   * ```
   */
  update(id: number, lot: Partial<Lot>): Observable<Lot> {
    return this.http.put<Lot>(`${this.api}/${id}`, lot);
  }

  /**
   * Elimina un lote del sistema.
   *
   * @param id - Identificador único del lote a eliminar
   * @returns Observable que completa al eliminar exitosamente
   * @throws Error si el lote no existe o hay eventos asociados
   *
   * @example
   * ```typescript
   * lotService.delete(1).subscribe({
   *   next: () => console.log('Lote eliminado'),
   *   error: (err) => console.error('Error:', err.message)
   * });
   * ```
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  /**
   * Obtiene el resumen de métricas de un lote específico.
   * Incluye información como: cantidad de eventos, última cosecha, etc.
   *
   * @param id - Identificador único del lote
   * @returns Observable que emite el LotSummary con métricas
   * @throws Error si el lote no existe
   *
   * @example
   * ```typescript
   * lotService.getSummary(1).subscribe(summary => {
   *   console.log('Eventos:', summary.totalEvents);
   *   console.log('Última cosecha:', summary.lastHarvestDate);
   * });
   * ```
   */
  getSummary(id: number): Observable<LotSummary> {
    return this.http.get<LotSummary>(`${this.api}/${id}/summary`);
  }

  /**
   * Obtiene todos los lotes asociados a un cultivo específico.
   *
   * @param cropId - Identificador del cultivo
   * @returns Observable que emite array de Lot filtrados por cultivo
   * @throws Error si la API responde con error
   *
   * @example
   * ```typescript
   * lotService.getByCrop(1).subscribe(lots => {
   *   lots.forEach(lot => console.log(lot.name));
   * });
   * ```
   */
  getByCrop(cropId: number): Observable<Lot[]> {
    return this.http.get<Lot[]>(`${this.api}/crop/${cropId}`);
  }

  getReport(id: number): Observable<Blob> {
    return this.http.get(`${this.api}/${id}/report`, { responseType: 'blob' });
  }
}
