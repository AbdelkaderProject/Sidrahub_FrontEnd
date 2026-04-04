import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../environments/environment';
import { PermissionService } from '../services/permission.service';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ApiLoginResponse {
  token: string;
  expiresAtUtc?: string;
  userId?: string | number;
  fullName?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
}

export interface LoginResponse extends ApiLoginResponse {
  success?: boolean;
  role?: string;
  errorMessage?: string;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/Auth`;
  private readonly permissionService = inject(PermissionService);

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {}

  login(credentials: LoginCredentials): Observable<ApiLoginResponse> {
    return this.http.post<ApiLoginResponse>(`${this.apiUrl}/login`, {
      email: credentials.email,
      password: credentials.password
    }).pipe(
      tap((response) => {
        if (!response.token) {
          return;
        }

        const parsedExpiry = response.expiresAtUtc ? Date.parse(response.expiresAtUtc) : NaN;
        const expiresAtMs = Number.isNaN(parsedExpiry)
          ? Date.now() + environment.security.tokenExpiry * 1000
          : parsedExpiry;
        const userId = response.userId
          ? typeof response.userId === 'string'
            ? parseInt(response.userId, 10)
            : response.userId
          : undefined;

        this.setSession(
          response.token,
          response.fullName || response.email || credentials.email,
          response.roles?.[0] || 'User',
          userId,
          expiresAtMs,
          !!credentials.rememberMe
        );

        if (response.permissions?.length) {
          this.permissionService.setPermissions(response.permissions);
          return;
        }

        this.permissionService.refreshPermissions().subscribe({
          error: (err) => {
            console.warn('[AuthService] Failed to load permissions after login', err);
          }
        });
      }),
      catchError((error) => this.handleError(error))
    );
  }

  logout(): void {
    this.permissionService.clearPermissions();
    this.clearSession();
    this.router.navigate(['/pages/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }

  userName(): string | null {
    return this.storageService.getUsername();
  }

  role(): string | null {
    return this.storageService.getRole();
  }

  private setSession(
    token: string,
    username: string,
    role: string,
    userId?: number,
    expiresAtMs?: number,
    rememberMe = false
  ): void {
    this.storageService.setToken(token, expiresAtMs, rememberMe);
    this.storageService.setUserInfo(username, role, userId, rememberMe);
  }

  private clearSession(): void {
    this.storageService.clear();
  }

  private isTokenExpired(token: string): boolean {
    const storedExpiry = this.storageService.getTokenExpiryMs();
    if (storedExpiry) {
      return Date.now() >= storedExpiry;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime >= expiry;
    } catch {
      return false;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'حدث خطأ غير متوقع.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `خطأ في الشبكة: ${error.error.message}`;
    } else if (Array.isArray(error.error?.errors) && error.error.errors.length > 0) {
      errorMessage = error.error.errors.join(' ');
    } else if (typeof error.error?.title === 'string') {
      errorMessage = error.error.title;
    } else if (typeof error.error?.errorMessage === 'string') {
      errorMessage = error.error.errorMessage;
    } else if (error.status === 401) {
      errorMessage = 'بيانات الدخول غير صحيحة.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
