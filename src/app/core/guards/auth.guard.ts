import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de autenticación para proteger rutas.
 * Verifica que el usuario esté autenticado y con un token JWT válido.
 *
 * @usage
 * ```typescript
 * // En app.routes.ts
 * export const routes: Routes = [
 *   {
 *     path: 'dashboard',
 *     component: DashboardComponent,
 *     canActivate: [authGuard]
 *   }
 * ];
 * ```
 *
 * @description
 * Este guard:
 * 1. Obtiene el servicio de autenticación mediante inyección de dependencias
 * 2. Verifica si el usuario está autenticado usando AuthService.isAuthenticated()
 * 3. Si no está autenticado, redirige a /login
 * 4. Si está autenticado, permite el acceso a la ruta
 *
 * El método isAuthenticated() además verifica:
 * - Que existe un token en localStorage
 * - Que el token no está expirado (comprobando el claim 'exp')
 *
 * @returns true si el usuario está autenticado, false y redirección a /login si no lo está
 * @see AuthService
 * @since 1.0.0
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
