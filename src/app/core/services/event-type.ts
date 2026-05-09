import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EventType {
  id: number;
  name: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {

  private api = `${environment.apiUrl}/event-types`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EventType[]> {
    return this.http.get<EventType[]>(this.api);
  }
}
