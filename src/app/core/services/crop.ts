import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Crop } from '../../models/crop.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CropService {

  private api = `${environment.apiUrl}/crops`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Crop[]> {
    return this.http.get<Crop[]>(this.api);
  }

  getById(id: number): Observable<Crop> {
    return this.http.get<Crop>(`${this.api}/${id}`);
  }

  create(crop: Partial<Crop>): Observable<Crop> {
    return this.http.post<Crop>(this.api, crop);
  }

  update(id: number, crop: Partial<Crop>): Observable<Crop> {
    return this.http.put<Crop>(`${this.api}/${id}`, crop);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
