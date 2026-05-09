# AGENTS.md

## Project Overview

Angular 21 SPA with Angular Material. Single-project, not a monorepo.

## Tech Stack

- **Framework**: Angular 21 + Angular Material
- **Test Runner**: Vitest (angular.json uses `@angular/build:unit-test`)
- **Package Manager**: npm (version 10.8.2 in package.json)
- **i18n**: `@ngx-translate/core` + `@ngx-translate/http-loader`
- **Auth**: JWT decode via `jwt-decode`

## Essential Commands

```bash
npm start    # Dev server at http://localhost:4200/
npm run build
npm test     # Runs Vitest
npm run watch # Incremental dev build
```

## Architecture

- Routes defined in `src/app/app.routes.ts`
- AuthGuard protects all routes except `/login` (see `src/app/core/guards/auth.guard.ts`)
- Main entry: `src/main.ts` → `src/app/app/app.ts`
- Shared layout: `src/app/shared/layout/layout.ts`
- Features live under `src/app/features/` (dashboard, crops, lots, events, auth)

## Styling

- Global theme: `src/material-theme.scss`
- Global styles: `src/styles.css`
- Components import their own `.css` files

## Build Constraints

- Initial bundle: max 500kB warning, 1MB error
- Per-component styles: max 4kB warning, 8kB error

## Testing

- Test files: `*.spec.ts`
- Test command runs all specs via Vitest