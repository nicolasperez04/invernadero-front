import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de control de acceso basado en roles.
 * Utiliza canMatch para evitar que el componente se cargue si el usuario no tiene los roles requeridos.
 *
 * @usage
 * ```typescript
 * // En app.routes.ts
 * export const routes: Routes = [
 *   {
 *     path: 'admin',
 *     component: AdminComponent,
 *     canMatch: [roleGuard],
 *     data: { roles: ['ADMIN'] }
 *   },
 *   {
 *     path: 'operador',
 *     component: OperatorComponent,
 *     canMatch: [roleGuard],
 *     data: { roles: ['ADMIN', 'OPERATOR'] }
 *   },
 *   {
 *     path: 'viewer',
 *     component: ViewerComponent,
 *     canMatch: [roleGuard],
 *     data: { roles: ['ADMIN', 'OPERATOR', 'VIEWER'] }
 *   }
 * ];
 * ```
 *
 * @description
 * Este guard:
 * 1. Obtiene los roles requeridos de la propiedad `data.roles` de la ruta
 * 2. Si no hay roles definidos, permite el acceso (útil para rutas públicas dentro de áreas protegidas)
 * 3. Verifica que el usuario esté autenticado, si no lo redirige a /login
 * 4. Verifica si el usuario tiene alguno de los roles requeridos usando AuthService.hasRole()
 * 5. Si no tiene los permisos, muestra advertencia en consola y redirige a /dashboard
 *
 * Roles disponibles en el sistema:
 * - ADMIN: Acceso completo a todas las funcionalidades
 * - OPERATOR: Gestión de cultivos, lotes y eventos
 * - VIEWER: Solo lectura
 *
 * @returns
 * - `true` si el usuario tiene alguno de los roles requeridos
 * - `false` y redirección a /dashboard si no tiene permisos
 * - `false` y redirección a /login si no está autenticado
 *
 * @example
 * ```typescript
 * // Verificar acceso en componente
 * const authService = inject(AuthService);
 * if (authService.hasRole(['ADMIN'])) {
 *   // Mostrar opciones de administración
 * }
 * ```
 *
 * @see AuthService
 * @see AuthService.hasRole()
 * @see AuthService.getUserRoles()
 * @since 1.0.0
 */
export const roleGuard: CanMatchFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Obtener roles requeridos de la configuración de la ruta
  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  // Si no hay roles especificados en la ruta, permitir acceso
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Verificar que el usuario esté autenticado
  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar si el usuario tiene alguno de los roles requeridos
  if (auth.hasRole(requiredRoles)) {
    return true;
  }

  // Usuario no tiene permisos: registrar advertencia y redirigir
  console.warn(
    `Acceso denegado a '${router.url}'. Roles requeridos: ${requiredRoles.join(', ')}, ` +
      `roles del usuario: ${auth.getUserRoles().join(', ')}`,
  );
  router.navigate(['/dashboard']);
  return false;
};
