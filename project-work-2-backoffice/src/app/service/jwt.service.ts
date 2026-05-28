import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  protected storageKey = 'authToken';

  hasToken() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  setToken(value: string) {
    localStorage.setItem(this.storageKey, value);
  }

  removeToken() {
    localStorage.removeItem(this.storageKey);
  }

  decodeToken<T = any>(): T | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedStr = atob(payload);
      const decoded = JSON.parse(decodedStr);

      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        return null;
      }

      return decoded;
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  
}