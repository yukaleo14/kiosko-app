import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.obtenerToken();
  const reqConToken = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  const esIntentoDeLogin = req.url.includes('/auth/login');

  return next(reqConToken).pipe(
    catchError((error) => {
      if (error.status === 401 && !esIntentoDeLogin) {
        // El token no existe, expiró o es inválido: se cierra la sesión.
        authService.logout();
        router.navigate(['/login'], { queryParams: { sesionExpirada: '1' } });
      }
      return throwError(() => error);
    }),
  );
};
