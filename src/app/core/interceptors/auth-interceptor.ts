import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor HTTP para autenticación JWT y configuración de idioma.
 *
 * Este interceptor se ejecuta en cada request HTTP saliente y:
 * 1. Añade el token JWT al header Authorization (excepto en /auth/login)
 * 2. Añade el header Accept-Language con el idioma actual del usuario
 *
 * @usage
 * El interceptor se configura automáticamente en app.config.ts:
 * ```typescript
 * provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
 * ```
 *
 * @description
 * Flujo de ejecución:
 * - Si la URL es /auth/login: solo añade Accept-Language (no requiere token)
 * - Si existe un token en localStorage: añade Authorization y Accept-Language
 * - Si no hay token: pasa el request sin modificar (para endpoints públicos)
 *
 * Headers añadidos:
 * - Authorization: Bearer {token JWT}
 * - Accept-Language: {es|en}
 *
 * @example
 * ```typescript
 * // Request resultante después del interceptor:
 * GET /api/crops
 * Headers:
 *   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *   Accept-Language: es
 * ```
 *
 * @see errorInterceptor
 * @since 1.0.0
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener token JWT del almacenamiento local
  const token = localStorage.getItem('token');

  // Obtener idioma actual del usuario (por defecto español)
  const language = localStorage.getItem('lang') || 'es';

  // Caso especial: endpoint de login - solo añadir Accept-Language
  if (req.url.includes('/auth/login')) {
    const cloned = req.clone({
      setHeaders: {
        'Accept-Language': language,
      },
    });
    return next(cloned);
  }

  // Otros endpoints: añadir Authorization y Accept-Language si hay token
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': language,
      },
    });

    return next(cloned);
  }

  // No hay token: pasar request sin modificar (endpoints públicos)
  return next(req);
};
