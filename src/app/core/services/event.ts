import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../models/event.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private api = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Event[]> {
    return this.http.get<Event[]>(this.api);
  }

  getById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.api}/${id}`);
  }

  getByLot(lotId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.api}/lot/${lotId}`);
  }

  create(event: any): Observable<Event> {
    return this.http.post<Event>(this.api, event);
  }

  filter(params: any): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.api}/filter`, { params });
  }
}
