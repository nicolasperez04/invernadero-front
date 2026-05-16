# Arquitectura del Proyecto

Este documento describe la arquitectura y estructura del proyecto Angular.

## Visión General

El proyecto sigue una arquitectura basada en **componentes standalone** de Angular 21, utilizando patrones modernos de desarrollo.

```
┌─────────────────────────────────────────────────────────────┐
│                      App Component                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Layout Component                   │   │
│  │  ┌─────────┐  ┌──────────────────────────────────┐  │   │
│  │  │ Navbar  │  │         Router Outlet           │  │   │
│  │  │         │  │  ┌────────────────────────────┐  │  │   │
│  │  │ - Lang  │  │  │      Dashboard             │  │  │   │
│  │  │ - User  │  │  │      Crops                 │  │  │   │
│  │  │ - Menu  │  │  │      Lots                  │  │  │   │
│  │  │         │  │  │      Events                │  │  │   │
│  │  └─────────┘  │  └────────────────────────────┘  │  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Estructura de Directorios

### `src/app/core/`

Contiene la configuración central y servicios base de la aplicación.

```
core/
├── guards/
│   ├── auth.guard.ts      # Protege rutas autenticadas
│   └── role.guard.ts      # Protege rutas por rol
├── interceptors/
│   ├── auth-interceptor.ts  # Añade token JWT a requests
│   └── error-interceptor.ts # Manejo centralizado de errores
├── models/
│   └── dashboard.model.ts  # Modelos específicos del dashboard
└── services/
    ├── auth.service.ts      # Gestión de autenticación
    ├── crop.ts              # Servicio de cultivos
    ├── lot.ts               # Servicio de lotes
    ├── event.ts             # Servicio de eventos
    ├── event-type.ts        # Tipos de eventos
    ├── dashboard.service.ts # Datos del dashboard
    ├── i18n.service.ts      # Internacionalización
    └── confirm-dialog.service.ts # Diálogos de confirmación
```

### `src/app/features/`

Módulos de características de la aplicación. Cada feature es independiente.

```
features/
├── auth/
│   └── login/
│       ├── login.ts        # Componente de login
│       ├── login.html      # Template
│       ├── login.css       # Estilos
│       └── login.spec.ts   # Tests
├── dashboard/
│   └── dashboard/
├── crops/
│   └── crop-list/
├── lots/
│   └── lot-list/
└── events/
    └── event-list/
```

### `src/app/shared/`

Componentes y utilidades reutilizables.

```
shared/
├── components/
│   └── navbar/
│       ├── navbar.ts
│       ├── navbar.html
│       └── navbar.css
└── layout/
    ├── layout.ts       # Layout principal (toolbar + sidebar)
    ├── layout.html
    ├── layout.css
    └── layout.spec.ts
```

### `src/app/models/`

Modelos de dominio utilizados en la aplicación.

```
models/
├── crop.model.ts
├── lot.model.ts
└── event.model.ts
```

## Patrones y Convenciones

### Componentes Standalone

Todos los componentes utilizan la arquitectura standalone de Angular:

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  selector: 'app-crop-list',
  templateUrl: './crop-list.html',
  styleUrl: './crop-list.css',
})
export class CropListComponent {
  // ...
}
```

### Servicios HTTP

Los servicios siguen el patrón de inyección de dependencias:

```typescript
@Injectable({ providedIn: 'root' })
export class CropService {
  private apiUrl = `${environment.apiUrl}/crops`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Crop[]> {
    return this.http.get<Crop[]>(this.apiUrl);
  }
}
```

### Guards de Ruta

Protectores de rutas para autenticación y permisos:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

### Interceptores

Manejo de requests y respuestas HTTP:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(cloned);
  }

  return next(req);
};
```

## Configuración de la Aplicación

### `app.config.ts`

Configuración principal de providers:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),
    provideTranslateService(),
  ],
};
```

### `app.routes.ts`

Definición de rutas:

```typescript
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'crops', component: CropListComponent },
      // ...
    ],
  },
];
```

## Estilos y Tema

### Tema de Material

El proyecto utiliza Angular Material con tema personalizado en `src/material-theme.scss`.

### Estilos por Componente

Cada componente define sus propios estilos en archivos `.css` separados, siguiendo el límite de 8kB por archivo.

## Internacionalización (i18n)

### Estructura de Archivos

```
src/assets/i18n/
├── es.json  # Español
└── en.json  # Inglés
```

### Uso en Componentes

```typescript
@Component({
  imports: [TranslateModule],
  // ...
})
export class CropListComponent {
  translate = inject(TranslateService);

  save(): void {
    this.translate.get('CROP.SAVE_SUCCESS').subscribe((res: string) => {
      // usar traducción
    });
  }
}
```

## Testing

### Pruebas Unitarias (Vitest)

Ubicación: archivos `*.spec.ts` junto a cada componente/servicio.

Ejecución:

```bash
npm test
```

### Pruebas E2E (Playwright)

Ubicación: carpeta `e2e/`

Ejecución:

```bash
npm run e2e
```

## Build y Despliegue

### Build de Producción

```bash
npm run build
```

Output: `dist/proyecto-front/browser/`

### Constraints de Build

| Tipo                 | Warning | Error |
| -------------------- | ------- | ----- |
| Initial bundle       | 1MB     | 2MB   |
| Per-component styles | 8kB     | 16kB  |

## Variables de Entorno

### Desarrollo (`environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
};
```

### Producción (`environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.invernadero.com/api',
};
```

## Flujo de Datos

```
User Action → Component → Service → HTTP → Backend API
                ↑                         ↓
            Template ← Observable ← Response
```

## Seguridad

1. **AuthGuard**: Protege todas las rutas excepto `/login`
2. **RoleGuard**: Restringe acceso basado en rol (ADMIN/OPERATOR/VIEWER)
3. **AuthInterceptor**: Adjunta JWT a cada request
4. **ErrorInterceptor**: Maneja errores HTTP globalmente

## Recursos Adicionales

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)
