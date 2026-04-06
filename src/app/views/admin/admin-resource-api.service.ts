import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminResourceApiService {
  constructor(private readonly http: HttpClient) {}

  list<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(this.buildUrl(endpoint));
  }

  create<T>(endpoint: string, payload: Record<string, unknown>): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), payload);
  }

  update(endpoint: string, id: number, payload: Record<string, unknown>): Observable<void> {
    return this.http.put<void>(`${this.buildUrl(endpoint)}/${id}`, payload);
  }

  delete(endpoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.buildUrl(endpoint)}/${id}`);
  }

  get<T>(endpoint: string, suffix = ''): Observable<T> {
    return this.http.get<T>(`${this.buildUrl(endpoint)}${suffix}`);
  }

  private buildUrl(endpoint: string): string {
    return `${environment.apiUrl}/${endpoint}`;
  }
}
