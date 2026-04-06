import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../environments/environment';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  phoneNumber: string;
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

        const resolvedRole = this.resolvePrimaryRole(response);

        this.setSession(
          response.token,
          response.fullName || response.email || credentials.email,
          resolvedRole,
          userId,
          expiresAtMs,
          !!credentials.rememberMe
        );

        
       
      }),
      catchError((error) => this.handleError(error))
    );
  }

  register(credentials: RegisterCredentials): Observable<ApiLoginResponse> {
    return this.http.post<ApiLoginResponse>(`${this.apiUrl}/register`, {
      fullName: credentials.fullName,
      email: credentials.email,
      phoneNumber: credentials.phoneNumber,
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

        const resolvedRole = this.resolvePrimaryRole(response);

        this.setSession(
          response.token,
          response.fullName || response.email || credentials.email,
          resolvedRole,
          userId,
          expiresAtMs,
          !!credentials.rememberMe
        );
      }),
      catchError((error) => this.handleError(error))
    );
  }

  logout(): void {
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
    const storedRole = this.storageService.getRole();
    if (storedRole?.trim()) {
      return storedRole;
    }

    return this.extractRoleFromToken(this.getToken());
  }

  isAdmin(): boolean {
    return this.isAdminRoleValue(this.role());
  }

  getPostLoginRoute(): string {
    return this.isAdmin() ? '/dashboard' : '/home';
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

  private resolvePrimaryRole(response: ApiLoginResponse): string {
    const apiRoles = response.roles?.filter((role) => !!role?.trim()) ?? [];
    if (apiRoles.length > 0) {
      const prioritizedAdminRole = apiRoles.find((role) => this.isAdminRoleValue(role));
      return prioritizedAdminRole ?? apiRoles[0];
    }

    return this.extractRoleFromToken(response.token) || 'User';
  }

  private extractRoleFromToken(token: string | null): string | null {
    if (!token) {
      return null;
    }

    const payload = this.parseJwtPayload(token);
    if (!payload) {
      return null;
    }

    const roleClaim = payload['role']
      ?? payload['roles']
      ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (Array.isArray(roleClaim)) {
      const firstRole = roleClaim.find((role) => typeof role === 'string' && role.trim().length > 0);
      return typeof firstRole === 'string' ? firstRole : null;
    }

    if (typeof roleClaim === 'string' && roleClaim.trim().length > 0) {
      return roleClaim;
    }

    return null;
  }

  private clearSession(): void {
    this.storageService.clear();
  }

  private isTokenExpired(token: string): boolean {
    const storedExpiry = this.storageService.getTokenExpiryMs();
    if (storedExpiry) {
      return Date.now() >= storedExpiry;
    }

    const payload = this.parseJwtPayload(token);
    if (!payload) {
      return false;
    }

    const expiry = typeof payload['exp'] === 'number' ? payload['exp'] : Number(payload['exp']);
    if (Number.isNaN(expiry)) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= expiry;
  }

  private parseJwtPayload(token: string): Record<string, unknown> | null {
    const tokenParts = token.split('.');
    if (tokenParts.length < 2) {
      return null;
    }

    const base64Url = tokenParts[1];
    const base64 = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(base64Url.length / 4) * 4, '=');

    try {
      return JSON.parse(atob(base64)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private isAdminRoleValue(role: string | null | undefined): boolean {
    const normalizedRole = (role || '')
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, '')
      .replace(/\s+/g, '');

    return normalizedRole === 'admin'
      || normalizedRole === 'administration'
      || normalizedRole === 'systemadmin'
      || normalizedRole === 'systemadministrator';
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
