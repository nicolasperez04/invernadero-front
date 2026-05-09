import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * RoleGuard: Previene acceso a rutas basado en roles requeridos.
 *
 * Uso en rutas:
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canMatch: [roleGuard],
 *   data: { roles: ['ADMIN'] }
 * }
 */
export const roleGuard: CanMatchFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Obtener roles requeridos de data
  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  // Si no hay roles especificados, permitir
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Verificar autenticación
  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar roles
  if (auth.hasRole(requiredRoles)) {
    return true;
  }

  // Acceso denegado: redirigir a dashboard
  console.warn(
    `Acceso denegado. Roles requeridos: ${requiredRoles.join(', ')}, usuario tiene: ${auth.getUserRoles().join(', ')}`
  );
  router.navigate(['/dashboard']);
  return false;
};
