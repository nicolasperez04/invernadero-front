import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Crop } from '../../models/crop.model';
import { EventType } from './event-type';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestión de cultivos.
 * Provee operaciones CRUD contra la API REST del backend.
 *
 * @usage
 * ```typescript
 * const cropService = inject(CropService);
 * // Obtener todos los cultivos
 * cropService.getAll().subscribe(crops => ...);
 * // Obtener cultivo por ID
 * cropService.getById(1).subscribe(crop => ...);
 * // Crear nuevo cultivo
 * cropService.create({ name: 'Tomate', description: '...' }).subscribe(...);
 * // Actualizar cultivo
 * cropService.update(1, { name: 'Tomate cherry' }).subscribe(...);
 * // Eliminar cultivo
 * cropService.delete(1).subscribe();
 * ```
 *
 * @see Crop
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class CropService {
  /** URL base de la API de cultivos */
  private api = `${environment.apiUrl}/crops`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los cultivos del sistema.
   *
   * @returns Observable que emite un array de Crop
   * @throws Error si la API responde con código de error (4xx/5xx)
   *
   * @example
   * ```typescript
   * cropService.getAll().subscribe({
   *   next: (crops) => console.log(crops.length),
   *   error: (err) => console.error('Error:', err)
   * });
   * ```
   */
  getAll(): Observable<Crop[]> {
    return this.http.get<Crop[]>(this.api);
  }

  /**
   * Obtiene un cultivo específico por su ID.
   *
   * @param id - Identificador único del cultivo
   * @returns Observable que emite el Crop solicitado
   * @throws Error si el cultivo no existe (404) o hay error de servidor
   *
   * @example
   * ```typescript
   * cropService.getById(5).subscribe(crop => {
   *   console.log(crop.name);
   * });
   * ```
   */
  getById(id: number): Observable<Crop> {
    return this.http.get<Crop>(`${this.api}/${id}`);
  }

  /**
   * Crea un nuevo cultivo en el sistema.
   *
   * @param crop - Objeto parcial con los datos del cultivo a crear
   * @returns Observable que emite el cultivo creado con su ID asignado
   * @throws Error si los datos son inválidos (400) o hay error de servidor
   *
   * @example
   * ```typescript
   * cropService.create({
   *   name: 'Lechuga',
   *   description: 'Lechuga romana',
   *   status: 'ACTIVE'
   * }).subscribe(newCrop => {
   *   console.log('ID:', newCrop.id);
   * });
   * ```
   */
  create(crop: Partial<Crop>): Observable<Crop> {
    return this.http.post<Crop>(this.api, crop);
  }

  /**
   * Actualiza un cultivo existente.
   *
   * @param id - Identificador único del cultivo a actualizar
   * @param crop - Objeto parcial con los campos a modificar
   * @returns Observable que emite el cultivo actualizado
   * @throws Error si el cultivo no existe (404) o datos inválidos (400)
   *
   * @example
   * ```typescript
   * cropService.update(1, { name: 'Tomate cherry' }).subscribe(updated => {
   *   console.log('Actualizado:', updated.name);
   * });
   * ```
   */
  update(id: number, crop: Partial<Crop>): Observable<Crop> {
    return this.http.put<Crop>(`${this.api}/${id}`, crop);
  }

  /**
   * Elimina un cultivo del sistema.
   *
   * @param id - Identificador único del cultivo a eliminar
   * @returns Observable que completa sin contenido al eliminar exitosamente
   * @throws Error si el cultivo no existe (404) o hay restricciones de integridad
   *
   * @example
   * ```typescript
   * cropService.delete(1).subscribe({
   *   next: () => console.log('Cultivo eliminado'),
   *   error: (err) => console.error('No se pudo eliminar:', err)
   * });
   * ```
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  /**
   * Obtiene los tipos de evento asociados a un cultivo.
   *
   * @param cropId - Identificador del cultivo
   * @returns Observable que emite un array de EventType
   */
  getEventTypes(cropId: number): Observable<EventType[]> {
    return this.http.get<EventType[]>(`${this.api}/${cropId}/event-types`);
  }

  /**
   * Agrega un tipo de evento a un cultivo.
   *
   * @param cropId - Identificador del cultivo
   * @param eventTypeId - Identificador del tipo de evento
   */
  addEventType(cropId: number, eventTypeId: number): Observable<any> {
    return this.http.post(`${this.api}/${cropId}/event-types/${eventTypeId}`, {});
  }

  /**
   * Remueve un tipo de evento de un cultivo.
   *
   * @param cropId - Identificador del cultivo
   * @param eventTypeId - Identificador del tipo de evento
   */
  removeEventType(cropId: number, eventTypeId: number): Observable<any> {
    return this.http.delete(`${this.api}/${cropId}/event-types/${eventTypeId}`);
  }
}
