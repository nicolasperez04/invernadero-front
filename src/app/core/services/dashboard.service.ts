import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardResponse,
  EventChartDTO,
  LotStatusDTO,
  LotProgressDTO,
} from '../models/dashboard.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el dashboard completo sin filtros
   */
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.apiUrl);
  }

  /**
   * Obtiene el dashboard filtrado por cultivo
   * @param cropId ID del cultivo
   */
  getDashboardByCrop(cropId: number): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}?cropId=${cropId}`);
  }

  /**
   * Obtiene solo la gráfica de eventos
   * @param cropId ID del cultivo (opcional)
   */
  getEventChart(cropId?: number): Observable<EventChartDTO> {
    const url = cropId ? `${this.apiUrl}/events?cropId=${cropId}` : `${this.apiUrl}/events`;
    return this.http.get<EventChartDTO>(url);
  }

  /**
   * Obtiene solo el estado de los lotes
   * @param cropId ID del cultivo (opcional)
   */
  getLotStatuses(cropId?: number): Observable<LotStatusDTO[]> {
    const url = cropId ? `${this.apiUrl}/status?cropId=${cropId}` : `${this.apiUrl}/status`;
    return this.http.get<LotStatusDTO[]>(url);
  }

  /**
   * Obtiene solo el progreso de los lotes
   * @param cropId ID del cultivo (opcional)
   */
  getLotProgress(cropId?: number): Observable<LotProgressDTO[]> {
    const url = cropId ? `${this.apiUrl}/progress?cropId=${cropId}` : `${this.apiUrl}/progress`;
    return this.http.get<LotProgressDTO[]>(url);
  }
}
