# SIGMA - Frontend (Angular)

Angular 21 SPA | Angular Material | Vitest | Playwright | npm

## Commands

```bash
npm start             # Dev server at http://localhost:4200/
npm run build         # Production build
npm run watch         # Incremental dev build
npm test              # Vitest (jsdom, globals)
npm run e2e           # Playwright (Chromium only)
npm run e2e:ui        # Playwright UI mode
npm run lint          # Prettier check (not ESLint)
```

## Architecture

- **Standalone components**, no NgModules
- Entry: `src/main.ts` → bootstrap `App` with `appConfig`
- Routes in `app.routes.ts`: lazy-loaded features under `LayoutComponent`
- Guards: `auth.guard` (all routes except `/login`), `role.guard` (ADMIN/OPERATOR/VIEWER)
- Interceptors: `auth-interceptor` (JWT from localStorage), `error-interceptor`
- Global error handler in `core/services/global-error-handler.ts`
- Layout: toolbar + sidebar in `shared/layout/`

## Project Structure

```
src/
├── app/
│   ├── core/           # Guards, interceptors, services, models
│   ├── features/       # auth/login, dashboard, crops, lots, events
│   ├── shared/         # Sigma UI kit (10 components: badge, btn, card, etc.)
│   └── models/         # Domain: crop.model, lot.model, event.model
├── assets/i18n/        # es.json, en.json (@ngx-translate)
└── environments/       # environment.ts (local), environment.prod.ts (Render)
```

## Styling

- Global theme: `src/material-theme.scss`
- Global styles: `src/styles.css`
- Components use their own `.css` files
- Prettier at 100 chars width, single quotes, Angular HTML parser

## Build Budgets (production)

| Metric              | Warning | Error |
| ------------------- | ------- | ----- |
| Initial bundle      | 1MB     | 2MB   |
| Per-component style | 8kB     | 16kB  |

## Testing

- **Unit**: Vitest 4.x with jsdom, globals, pool:forks. Files: `*.spec.ts`
- **E2E**: Playwright in `e2e/` dir, Chromium only. Auth setup via `auth.setup.ts`
  - Runs `npm start` as webServer (reuses if not CI)
  - 2 retries on CI
- CI runs: `npm test -- --no-watch` → `npm run lint` → `npm run build`

## Deployment (Render)

- SPA fallback via `static.json`: `{ "routes": { "/**": "index.html" } }`
- Build command: `npm run build`
- Publish directory: `dist/proyecto-front/browser`
- Production API: `https://invernadero-lui9.onrender.com/api`

## Key Details

- JWT stored in `localStorage` (not httpOnly cookies)
- SSE for real-time notifications via `sse.service.ts`
- Shared sigma-\* components: badge, btn, card, empty-state, input, progress, spinner, table, toggle
- Default language: Spanish (`es`)
- Angular CLI builder: `@angular/build:application` (not `@angular-devkit/build-angular`)
- Test builder: `@angular/build:unit-test`
