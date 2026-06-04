import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, map, of, ReplaySubject, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { User } from '../../enity/user/user-entity';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected http = inject(HttpClient);
  protected jwtSrv = inject(JwtService);
  protected router = inject(Router);


  protected _currentUser$ = new ReplaySubject<User | null>(1);
  currentUser$ = this._currentUser$.asObservable();


  constructor() {
    this.tryRestoreUser();
  }

  private async tryRestoreUser() {
    const token = this.jwtSrv.getToken();

    if (!token) {
      this.logout();
      return;
    }

    const decoded = this.jwtSrv.decodeToken<User>();
    if (decoded) {
      this._currentUser$.next(decoded);
      return;
    }

    const refreshed = await this.tryRefreshToken();
    if (refreshed) {
      const newDecoded = this.jwtSrv.decodeToken<User>();
      if (newDecoded) {
        this._currentUser$.next(newDecoded);
        return;
      }
    }

    this.logout();
  }

  private async tryRefreshToken(): Promise<boolean> {
    const refreshToken = this.jwtSrv.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`/api/refreshToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!res.ok) return false;

      const data = await res.json();
      const newToken = data.accessToken || data.token;
      const newRefresh = data.refreshToken;

      if (newToken && typeof newToken === 'string' && newToken.split('.').length === 3) {
        this.jwtSrv.setToken(newToken);
        document.cookie = `token=${newToken}; path=/; max-age=86400`;
        if (newRefresh) {
          this.jwtSrv.setRefreshToken(newRefresh);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }


  isAuthenticated$ = this.currentUser$
                      .pipe(
                        map(user => !!user),
                        distinctUntilChanged()
                      );



  login(username: string, password: string) {
    return this.http.post<any>(`/api/login`, {username, password})
      .pipe(
        tap(res => {
          console.log('Login response:', res);
          const token = res.accessToken || res.token;
          const refresh = res.refreshToken;
          if (token && typeof token === 'string' && token.split('.').length === 3) {
            this.jwtSrv.setToken(token);
            document.cookie = `token=${token}; path=/; max-age=86400`;
            if (refresh) this.jwtSrv.setRefreshToken(refresh);
          } else {
            console.warn('Token JWT non trovato nella risposta:', res);
          }
        }),
        tap(res => {
          const user = res.user || res.data?.user;
          if (user) this._currentUser$.next(user);
        }),
        map(res => res.user || res.data?.user)
      );
  }


  register(user: {firstName: string;lastName: string;username: string;password: string;}) {
  return this.http.post<User>(`/api/register`, user)
}



  logout() {
    this.jwtSrv.clearAll();
    document.cookie = 'token=; path=/; max-age=0';
    this._currentUser$.next(null);
  }


} 