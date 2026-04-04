import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly TOKEN_EXPIRES_AT_KEY = 'auth_token_expires_at';
  private readonly USER_NAME_KEY = 'user_name';
  private readonly USER_ROLE_KEY = 'user_role';
  private readonly USER_ID_KEY = 'user_id';

  private isStorageAvailable(storage: Storage): boolean {
    try {
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private getPreferredStorage(rememberMe = true): Storage | null {
    const primary = rememberMe ? localStorage : sessionStorage;
    const fallback = rememberMe ? sessionStorage : localStorage;

    if (this.isStorageAvailable(primary)) {
      return primary;
    }

    if (this.isStorageAvailable(fallback)) {
      return fallback;
    }

    return null;
  }

  private getStorage(): Storage | null {
    const storages = [localStorage, sessionStorage];

    for (const storage of storages) {
      if (!this.isStorageAvailable(storage)) {
        continue;
      }

      if (storage.getItem(this.TOKEN_KEY)) {
        return storage;
      }
    }

    return this.getPreferredStorage(true);
  }

  private clearStorage(storage: Storage): void {
    storage.removeItem(this.TOKEN_KEY);
    storage.removeItem(this.TOKEN_EXPIRES_AT_KEY);
    storage.removeItem(this.USER_NAME_KEY);
    storage.removeItem(this.USER_ROLE_KEY);
    storage.removeItem(this.USER_ID_KEY);
  }

  private isTokenExpiredInStorage(storage: Storage): boolean {
    const expiresAt = storage.getItem(this.TOKEN_EXPIRES_AT_KEY);
    if (!expiresAt) {
      return true;
    }

    const expiryMs = Number(expiresAt);
    return Number.isNaN(expiryMs) || Date.now() >= expiryMs;
  }

  getTokenExpiryMs(): number | null {
    const storage = this.getStorage();
    if (!storage) {
      return null;
    }

    const expiresAt = storage.getItem(this.TOKEN_EXPIRES_AT_KEY);
    if (!expiresAt) {
      return null;
    }

    const expiryMs = Number(expiresAt);
    return Number.isNaN(expiryMs) ? null : expiryMs;
  }

  setToken(token: string, expiresAtMs?: number, rememberMe = false): void {
    const storage = this.getPreferredStorage(rememberMe);
    if (!storage) {
      return;
    }

    this.clear();
    storage.setItem(this.TOKEN_KEY, token);

    if (expiresAtMs) {
      storage.setItem(this.TOKEN_EXPIRES_AT_KEY, expiresAtMs.toString());
    } else {
      storage.removeItem(this.TOKEN_EXPIRES_AT_KEY);
    }
  }

  getToken(): string | null {
    const storage = this.getStorage();
    if (!storage) {
      return null;
    }

    if (this.isTokenExpiredInStorage(storage)) {
      this.clearStorage(storage);
      return null;
    }

    return storage.getItem(this.TOKEN_KEY);
  }

  private getValue(key: string): string | null {
    const storage = this.getStorage();
    if (!storage) {
      return null;
    }

    if (this.isTokenExpiredInStorage(storage)) {
      this.clearStorage(storage);
      return null;
    }

    return storage.getItem(key);
  }

  setUserInfo(username: string, role: string, userId?: number, rememberMe = false): void {
    const storage = this.getPreferredStorage(rememberMe);
    if (!storage) {
      return;
    }

    storage.setItem(this.USER_NAME_KEY, username);
    storage.setItem(this.USER_ROLE_KEY, role);

    if (userId) {
      storage.setItem(this.USER_ID_KEY, userId.toString());
    }
  }

  getUsername(): string | null {
    return this.getValue(this.USER_NAME_KEY);
  }

  getRole(): string | null {
    return this.getValue(this.USER_ROLE_KEY);
  }

  getUserId(): number | null {
    const userId = this.getValue(this.USER_ID_KEY);
    return userId ? parseInt(userId, 10) : null;
  }

  clear(): void {
    if (this.isStorageAvailable(localStorage)) {
      this.clearStorage(localStorage);
    }

    if (this.isStorageAvailable(sessionStorage)) {
      this.clearStorage(sessionStorage);
    }
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
