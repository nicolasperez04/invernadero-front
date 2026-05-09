import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lot, LotSummary } from '../../models/lot.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LotService {
  private api = `${environment.apiUrl}/lots`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Lot[]> {
    return this.http.get<Lot[]>(this.api);
  }

  getById(id: number): Observable<Lot> {
    return this.http.get<Lot>(`${this.api}/${id}`);
  }

  create(lot: Partial<Lot>): Observable<Lot> {
    return this.http.post<Lot>(this.api, lot);
  }

  update(id: number, lot: Partial<Lot>): Observable<Lot> {
    return this.http.put<Lot>(`${this.api}/${id}`, lot);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  getSummary(id: number): Observable<LotSummary> {
    return this.http.get<LotSummary>(`${this.api}/${id}/summary`);
  }

  getByCrop(cropId: number): Observable<Lot[]> {
    return this.http.get<Lot[]>(`${this.api}/crop/${cropId}`);
  }
}
