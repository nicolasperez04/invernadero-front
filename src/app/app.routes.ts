import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './shared/layout/layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { CropListComponent } from './features/crops/crop-list/crop-list';
import { LotListComponent } from './features/lots/lot-list/lot-list';
import { EventListComponent } from './features/events/event-list/event-list';

export const routes: Routes = [
  // Login (público)
  {
    path: 'login',
    component: LoginComponent,
  },

  // App protegida
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // default
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // crops (protegido por rol ADMIN, OPERATOR)
      {
        path: 'crops',
        component: CropListComponent,
        canMatch: [roleGuard],
        data: { roles: ['ADMIN', 'OPERATOR'] },
      },

      // lots (protegido por rol ADMIN, OPERATOR)
      {
        path: 'lots',
        component: LotListComponent,
        canMatch: [roleGuard],
        data: { roles: ['ADMIN', 'OPERATOR'] },
      },

      // events (protegido por rol ADMIN, OPERATOR, VIEWER)
      {
        path: 'events',
        component: EventListComponent,
        canMatch: [roleGuard],
        data: { roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
      },
    ],
  },

  // fallback
  { path: '**', redirectTo: 'login' },
];
