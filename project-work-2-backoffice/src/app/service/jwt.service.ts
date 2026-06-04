import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  protected storageKey = 'accessToken';
  protected refreshKey = 'refreshToken';


  hasToken() {
    return !!this.getToken();
  }


  getToken() {
    const token = localStorage.getItem(this.storageKey);
    if (!token || token === 'undefined' || token === 'null') return null;
    return token;
  }


  setToken(value: string) {
    localStorage.setItem(this.storageKey, value);
  }


  removeToken() {
    localStorage.removeItem(this.storageKey);
  }

  getRefreshToken() {
    const token = localStorage.getItem(this.refreshKey);
    if (!token || token === 'undefined' || token === 'null') return null;
    return token;
  }

  setRefreshToken(value: string) {
    localStorage.setItem(this.refreshKey, value);
  }

  removeRefreshToken() {
    localStorage.removeItem(this.refreshKey);
  }

  clearAll() {
    this.removeToken();
    this.removeRefreshToken();
  }


  decodeToken<T = any>(): T | null {
    const token = this.getToken();
    if (!token) return null;


    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      const decodedStr = atob(padded);
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