import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardResponse,
  EventChartDTO,
  LotStatusDTO,
  LotProgressDTO,
} from '../models/dashboard.model';
import { environment } from '../../../environments/environment';

/**
 * Servicio para obtener datos del dashboard y métricas del invernadero.
 * Provee diferentes endpoints para obtener vistas específicas del dashboard.
 *
 * @usage
 * ```typescript
 * const dashboardService = inject(DashboardService);
 * // Dashboard completo
 * dashboardService.getDashboard().subscribe(data => ...);
 * // Gráfica de eventos
 * dashboardService.getEventChart(1).subscribe(chart => ...);
 * // Estado de lotes
 * dashboardService.getLotStatuses().subscribe(statuses => ...);
 * // Progreso de lotes
 * dashboardService.getLotProgress().subscribe(progress => ...);
 * ```
 *
 * @see DashboardResponse
 * @see EventChartDTO
 * @see LotStatusDTO
 * @see LotProgressDTO
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  /** URL base de la API del dashboard */
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el dashboard completo sin filtros.
   * Incluye: métricas generales, gráfica de eventos, estado de lotes y progreso.
   *
   * @returns Observable que emite DashboardResponse con todas las métricas
   * @throws Error si la API responde con código de error
   *
   * @example
   * ```typescript
   * dashboardService.getDashboard().subscribe(data => {
   *   console.log('Total cultivos:', data.totalCrops);
   *   console.log('Total lotes:', data.totalLots);
   *   console.log('Eventos recientes:', data.eventChart);
   * });
   * ```
   */
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.apiUrl);
  }

  /**
   * Obtiene el dashboard filtrado por un cultivo específico.
   *
   * @param cropId - Identificador único del cultivo para filtrar
   * @returns Observable que emite DashboardResponse con datos filtrados
   * @throws Error si el cultivo no existe
   *
   * @example
   * ```typescript
   * dashboardService.getDashboardByCrop(1).subscribe(data => {
   *   console.log('Lotes de tomate:', data.lotStatuses);
   * });
   * ```
   */
  getDashboardByCrop(cropId: number): Observable<DashboardResponse> {
    const params = new HttpParams().set('cropId', cropId);
    return this.http.get<DashboardResponse>(this.apiUrl, { params });
  }

  /**
   * Obtiene únicamente los datos de la gráfica de eventos.
   * útil para actualizar solo la visualización de eventos.
   *
   * @param cropId - Identificador opcional del cultivo para filtrar eventos
   * @returns Observable que emite EventChartDTO con datos para gráfico
   * @throws Error si la API responde con error
   *
   * @example
   * ```typescript
   * dashboardService.getEventChart().subscribe(chart => {
   *   console.log('Labels:', chart.labels);
   *   console.log('Datos:', chart.datasets);
   * });
   * ```
   */
  getEventChart(cropId?: number): Observable<EventChartDTO> {
    const url = cropId ? `${this.apiUrl}/events?cropId=${cropId}` : `${this.apiUrl}/events`;
    return this.http.get<EventChartDTO>(url);
  }

  /**
   * Obtiene únicamente el estado actual de los lotes.
   * Muestra información resumida del estado de cada lote.
   *
   * @param cropId - Identificador opcional del cultivo para filtrar
   * @returns Observable que emite array de LotStatusDTO
   * @throws Error si la API responde con error
   *
   * @example
   * ```typescript
   * dashboardService.getLotStatuses().subscribe(statuses => {
   *   statuses.forEach(s => console.log(s.name, s.status));
   * });
   * ```
   */
  getLotStatuses(cropId?: number): Observable<LotStatusDTO[]> {
    const url = cropId ? `${this.apiUrl}/status?cropId=${cropId}` : `${this.apiUrl}/status`;
    return this.http.get<LotStatusDTO[]>(url);
  }

  /**
   * Obtiene únicamente el progreso de los lotes.
   * Muestra información de avance (días desde última acción, tiempos, etc.).
   *
   * @param cropId - Identificador opcional del cultivo para filtrar
   * @returns Observable que emite array de LotProgressDTO
   * @throws Error si la API responde con error
   *
   * @example
   * ```typescript
   * dashboardService.getLotProgress().subscribe(progress => {
   *   progress.forEach(p => {
   *     console.log(`${p.lotName}: ${p.daysSinceLastEvent} días`);
   *   });
   * });
   * ```
   */
  getLotProgress(cropId?: number): Observable<LotProgressDTO[]> {
    const url = cropId ? `${this.apiUrl}/progress?cropId=${cropId}` : `${this.apiUrl}/progress`;
    return this.http.get<LotProgressDTO[]>(url);
  }
}
