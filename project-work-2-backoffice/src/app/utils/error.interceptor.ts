import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../service/toast.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((response: any) => {
      if (response instanceof HttpErrorResponse && response.status !== 401) {
        const msg = response.error?.message || response.statusText || 'Errore sconosciuto';
        inject(ToastService).error(msg);
      }
      return throwError(() => response);
    })
  );
};
