import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorQueueService, ErrorType } from '../services/error-queue.service';
import { TaigaService } from '../services/taiga.service';

/**
 * Interceptor HTTP para manejo centralizado de errores.
 *
 * Este interceptor captura todos los errores HTTP y los procesa de manera uniforme:
 * 1. Mapea códigos de error HTTP a mensajes amigables
 * 2. Muestra una notificación (snackbar) con el mensaje de error
 * 3. Propaga el error para que los componentes puedan manejarlo si es necesario
 *
 * @usage
 * El interceptor se configura automáticamente en app.config.ts:
 * ```typescript
 * provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
 * ```
 *
 * @description
 * Códigos de error manejados:
 * - 400 Bad Request: Datos inválidos o mal formados
 * - 401 Unauthorized: Sesión expirada o credenciales inválidas
 * - 403 Forbidden: Acceso denegado al recurso
 * - 404 Not Found: Recurso no encontrado
 * - 409 Conflict: Conflicto de datos (ej: duplicado)
 * - 500 Server Error: Error interno del servidor
 * - 0: Error de conexión (backend no disponible)
 *
 * @example
 * ```typescript
 * // En un componente:
 * cropService.getAll().subscribe({
 *   next: (crops) => this.crops = crops,
 *   error: (err) => {
 *     // El error ya se mostró en el snackbar por el interceptor
 *     // Aquí puedes hacer manejo adicional si es necesario
 *     console.error('Error:', err.status);
 *   }
 * });
 * ```
 *
 * @see authInterceptor
 * @since 1.0.0
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const errorQueue = inject(ErrorQueueService);
  const taigaService = inject(TaigaService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      // Mapear códigos de estado HTTP a mensajes descriptivos
      // Los mensajes del backend (error.error?.message) tienen prioridad
      switch (error.status) {
        case 400:
          // Solicitud inválida - datos mal formados o validación fallida
          errorMessage = error.error?.message || 'Bad Request';
          break;
        case 401:
          // No autorizado - sesión expirada o credenciales incorrectas
          errorMessage = 'Unauthorized';
          // Nota: En una implementación completa, aquí se podría hacer logout automático
          break;
        case 403:
          // Prohibido - el usuario no tiene permisos para este recurso
          errorMessage = 'Forbidden';
          break;
        case 404:
          // No encontrado - el recurso solicitado no existe
          errorMessage = 'Not Found';
          break;
        case 409:
          // Conflicto - usualmente por datos duplicados o violación de restricciones
          errorMessage = error.error?.message || 'Conflict';
          break;
        case 500:
          // Error interno del servidor
          errorMessage = 'Server Error';
          break;
        case 0:
          // Error de conexión - el backend no está disponible o no hay conexión
          errorMessage = 'Network Error - Backend not available';
          break;
        default:
          // Otros errores
          errorMessage = error.error?.message || 'Server Error';
      }

      // Mostrar mensaje de error como snackbar temporal
      snackBar.open(errorMessage, 'OK', {
        duration: 5000, // 5 segundos
        panelClass: ['error-snackbar'], // Clase CSS para personalización
      });

      // Reportar error a Taiga automáticamente (excluir 401)
      if (error.status !== 401) {
        const typeMap: Record<number, ErrorType> = {
          400: 'HTTP-400',
          403: 'HTTP-403',
          404: 'HTTP-404',
          409: 'HTTP-409',
          500: 'HTTP-500',
          0: 'HTTP-0',
        };
        const errorType = typeMap[error.status] || (`HTTP-${error.status}` as ErrorType);
        const errorInfo = {
          type: errorType,
          message: errorMessage,
          url: req.url,
          method: req.method,
          status: error.status,
          timestamp: new Date().toISOString(),
        };
        errorQueue.enqueue(errorInfo);
        taigaService.reportError(errorInfo);
      }

      // Propagar el error para que los componentes puedan manejarlo adicionalmente
      // Esto permite que los componentes accedan a error.error para más detalles
      return throwError(() => error);
    }),
  );
};
