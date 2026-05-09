import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      // Mapear códigos de error a mensajes en inglés
      // Los componentes pueden traducir según necesidad
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad Request';
          break;
        case 401:
          errorMessage = 'Unauthorized';
          break;
        case 403:
          errorMessage = 'Forbidden';
          break;
        case 404:
          errorMessage = 'Not Found';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict';
          break;
        case 500:
          errorMessage = 'Server Error';
          break;
        case 0:
          // Error de conexión (sin respuesta del servidor)
          errorMessage = 'Network Error - Backend not available';
          break;
        default:
          errorMessage = error.error?.message || 'Server Error';
      }

      // Mostrar snackbar con el mensaje
      snackBar.open(errorMessage, 'OK', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });

      // Propagar el error para que el componente pueda acceder a error.error si es necesario
      return throwError(() => error);
    }),
  );
};
