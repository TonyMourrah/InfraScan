import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Attache le token JWT à chaque requête sortante s'il existe
  const requeteAvecToken = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  return next(requeteAvecToken).pipe(
    catchError((erreur) => {
      // Si le serveur refuse le token ( expirer ou invalie ) déconnexion automatique
      if (erreur.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.navigate(['/login']);
      }
      return throwError(() => erreur);
    })
  );
};