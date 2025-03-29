import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private apiUrl = 'http://127.0.0.1:8000/permisos/por-rol';

  constructor(private http: HttpClient) {}

  getPermisos(rolId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${rolId}`);
  }
}