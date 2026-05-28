import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { catchError, throwError } from 'rxjs';

export const logoutInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    catchError((response: any) => {
      if (response instanceof HttpErrorResponse && response.status === 401) {
        inject(AuthService).logout();
      }
      return throwError(() => response);
    })
  );
};