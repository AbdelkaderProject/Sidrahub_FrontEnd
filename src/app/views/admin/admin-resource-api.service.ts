import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminResourceApiService {
  constructor(private readonly http: HttpClient) {}

  private readonly apiBaseUrl = environment.apiUrl.replace(/\/api\/?$/, '');

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

  uploadFile(file: File, folder: string): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return this.http.post<{ url: string }>(`${this.apiBaseUrl}/api/Uploads`, formData);
  }

  resolveAssetUrl(path: string | null | undefined): string | null {
    if (!path) {
      return null;
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.apiBaseUrl}${normalizedPath}`;
  }

  private buildUrl(endpoint: string): string {
    return `${environment.apiUrl}/${endpoint}`;
  }
}
