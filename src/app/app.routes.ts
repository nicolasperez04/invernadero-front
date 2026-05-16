import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './shared/layout/layout';

/**
 * Configuración de rutas de la aplicación.
 *
 * Este archivo define todas las rutas de la aplicación Angular:
 * - Rutas públicas (login)
 * - Rutas protegidas (requieren autenticación)
 * - Rutas con control de acceso por roles
 *
 * @usage
 * Las rutas se configuran en app.config.ts mediante provideRouter(routes).
 *
 * @description
 * Estructura de rutas:
 * ```
 * /login                    -> LoginComponent (público)
 * /                         -> LayoutComponent (protegido por authGuard)
 *   /dashboard              -> DashboardComponent (cualquier rol autenticado)
 *   /crops                  -> CropListComponent (ADMIN, OPERATOR)
 *   /lots                   -> LotListComponent (ADMIN, OPERATOR)
 *   /events                 -> EventListComponent (ADMIN, OPERATOR, VIEWER)
 * **                        -> Redirect a /login (fallback)
 * ```
 *
 *Roles disponibles:
 * - ADMIN: Acceso completo
 * - OPERATOR: Gestión de cultivos, lotes y eventos
 * - VIEWER: Solo lectura (solo eventos)
 *
 * @see authGuard
 * @see roleGuard
 * @since 1.0.0
 */
export const routes: Routes = [
  // ============================================
  // RUTA: /login
  // Descripción: Página de login pública
  // Acceso: Cualquier usuario (sin autenticación)
  // ============================================
  {
    path: 'login',
    component: LoginComponent,
  },

  // ============================================
  // RUTAS PROTEGIDAS
  // Todas las rutas bajo '/' requieren autenticación (authGuard)
  // ============================================
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // ----------------------------------------
      // /dashboard
      // Descripción: Dashboard principal con métricas
      // Acceso: Cualquier usuario autenticado
      // ----------------------------------------
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
        data: { title: 'nav.dashboard' },
      },

      // Redirección por defecto: / -> /dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // ----------------------------------------
      // /crops
      // Descripción: Gestión de cultivos (CRUD)
      // Acceso: ADMIN, OPERATOR
      // ----------------------------------------
      {
        path: 'crops',
        loadComponent: () => import('./features/crops/crop-list/crop-list').then(m => m.CropListComponent),
        canMatch: [roleGuard],
        data: { roles: ['ADMIN', 'OPERATOR'], title: 'nav.crops' },
      },

      // ----------------------------------------
      // /lots
      // Descripción: Gestión de lotes del invernadero
      // Acceso: ADMIN, OPERATOR
      // ----------------------------------------
      {
        path: 'lots',
        loadComponent: () => import('./features/lots/lot-list/lot-list').then(m => m.LotListComponent),
        canMatch: [roleGuard],
        data: { roles: ['ADMIN', 'OPERATOR'], title: 'nav.lots' },
      },

      // ----------------------------------------
      // /events
      // Descripción: Registro de eventos (siembra, cosecha, etc.)
      // Acceso: ADMIN, OPERATOR, VIEWER
      // ----------------------------------------
      {
        path: 'events',
        loadComponent: () => import('./features/events/event-list/event-list').then(m => m.EventListComponent),
        canMatch: [roleGuard],
        data: { roles: ['ADMIN', 'OPERATOR', 'VIEWER'], title: 'nav.events' },
      },
    ],
  },

  // ============================================
  // FALLBACK: Cualquier ruta no definida
  // Redirige a /login
  // ============================================
  { path: '**', redirectTo: 'login' },
];
