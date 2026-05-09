\# Plan de auditoría y cierre de frontend (Angular 21 + JWT + i18n)

Fecha: 2026-05-05/06  
Rol asumido: Ingeniero senior fullstack (Angular standalone + Spring Boot JWT + PostgreSQL)

---

## 1) Objetivo

Cerrar el frontend Angular para que cumpla el 100% de los requisitos del proyecto:

- Funcione sin errores (build + tests + ejecución)
- Consuma correctamente el backend Spring Boot con JWT
- Aplique seguridad de rutas y UI basada en roles (ADMIN / OPERATOR / VIEWER)
- Internacionalización completa y consistente (frontend + envío de `Accept-Language`)
- Manejo global de errores (sin `alert()`/`confirm()`)
- Pruebas obligatorias (Frontend: Selenium) + unitarias en Angular
- CI/CD con GitHub Actions

---

## 2) Contexto técnico real del repo (verificado)

- Framework: Angular 21 (arquitectura standalone)
- UI: Angular Material parcialmente usado
- HTTP: `provideHttpClient(withInterceptors([authInterceptor]))`
- i18n: `@ngx-translate/core` + `@ngx-translate/http-loader`
- Testing: `ng test` usando `@angular/build:unit-test` (Vitest)
- Scripts: `npm start`, `npm run build`, `npm test`

---

## 3) Auditoría completa (estado actual)

### 3.1 Arquitectura, bootstrapping y rutas

**Implementado (✅/⚠️):**

- Bootstrap standalone por `bootstrapApplication(...)`.
- `ngx-translate` se provee globalmente en `app.config.ts`.
- Routing centralizado en `app.routes.ts`.

**Hallazgos:**

- Rutas:
	- `/login` público
	- resto de la app bajo `LayoutComponent` protegido por `authGuard`.
- `App` renderiza `NavbarComponent` + `router-outlet`.
- `LayoutComponent` contiene toolbar + sidebar con links.

**Problemas (⚠️/❌):**

- `LayoutComponent` tiene textos hardcodeados (ES/EN mezclado) y navegación sin control por rol.
- Hay estilos inline en layout y features (no bloqueante, pero ensucia y dificulta i18n).

### 3.2 Seguridad (JWT, guards, roles)

**Implementado (⚠️):**

- Login funcional contra `${environment.apiUrl}/auth/login`.
- Token se guarda en `localStorage` (`token`).
- Interceptor agrega `Authorization: Bearer <token>`.
- `authGuard` evita acceso si no hay token.
- `AuthService.getUserRole()` lee `authorities[0]` y remueve `ROLE_`.

**Problemas (❌):**

- No existe `RoleGuard` (ni `canMatch`/`canActivate` por roles).
- `authGuard` solo verifica existencia del token, no expiración (`exp`) ni validez.
- `AuthService.getUserRole()` asume 1 rol y posición 0; no soporta múltiples roles.
- `AuthService.getUserId()` asume claim `userId` (comentado como “puede no existir”): potencial bug funcional.
- UI no aplica roles: se muestran links/acciones a todos.

### 3.3 Internacionalización (frontend + backend)

**Implementado (⚠️):**

- `TranslateModule.forRoot({ defaultLanguage: 'es' })`.
- `I18nService` usa `localStorage('lang')` y `NavbarComponent` permite cambiar ES/EN.

**Problemas (❌):**

- i18n solo está aplicada en login:
	- Solo `LoginComponent` importa `TranslateModule`.
	- El resto de componentes no usa `| translate`.
- Muchos textos hardcodeados en templates: crops/lots/events/layout/dashboard.
- No se envía `Accept-Language` al backend, por lo que el backend no puede responder consistentemente en el idioma elegido.
- Archivos `assets/i18n/es.json` y `en.json` solo contienen claves de login + dos errores genéricos (insuficiente para la app).

### 3.4 Manejo de errores (global)

**Problemas (❌):**

- Se usa `alert()` y `confirm()` en features (login/crops/lots/events).
- No existe interceptor global de errores (`HttpErrorResponse` → UI).
- No hay estrategia de traducción/mapeo de errores del backend.
- Falta UX mínima de errores: snackbars/toasts, mensajes consistentes.

### 3.5 Servicios REST y configuración de API

**Implementado (⚠️):**

- Servicios para crops/lots/events/event-types existen y consumen backend.

**Problemas (❌):**

- Inconsistencia crítica de base URL:
	- `AuthService` usa `environment.apiUrl`.
	- `CropService`, `LotService`, `EventService`, `EventTypeService` tienen URL hardcodeada `http://localhost:8080/api/...`.
- Esto rompe despliegue/entornos y complica CI.

### 3.6 Reglas de negocio (SIEMBRA/COSECHA/orden cronológico)

**Estado (⚠️):**

- La UI de eventos actualmente no valida:
	- primer evento debe ser `SIEMBRA`
	- no permitir `COSECHA` antes de `SIEMBRA`
	- orden cronológico
- Probablemente el backend valida, pero el requisito pide asegurar el comportamiento; el frontend hoy solo reacciona con `alert(err.error?.message)`.

### 3.7 Pruebas (unitarias + Selenium)

**Estado actual (❌):**

- `npm test` actualmente falla por errores de TypeScript en specs.
- Varios `*.spec.ts` están mal generados:
	- Importan clases inexistentes (`Layout`, `LotList`, `CropList`, etc.) en vez de `LayoutComponent`, `LotListComponent`, etc.
	- Specs de servicios importan símbolos incorrectos (`Crop` en vez de `CropService`, etc.).
	- `app.spec.ts` espera un `<h1>Hello, proyecto-front</h1>` que no existe en `app.html`.
- No existen pruebas E2E Selenium.

### 3.8 Despliegue / CI (GitHub Actions)

**Estado actual (❌):**

- No existe carpeta `.github/workflows/`.
- No hay pipeline para build/test/e2e.

---

## 4) Validación funcional y técnica (lo que se comprobó ejecutando)

### 4.1 Build

- `npm run build` **compila** (✅) pero con warnings importantes:
	- `LotListComponent` usa `*ngFor`/`*ngIf` sin importar `CommonModule`/directivas → warning `NG8103`.
	- Presupuesto del bundle inicial excedido (warning, no bloqueante).

### 4.2 Tests

- `npm test` **no pasa** (❌): errores de compilación por imports/clases mal nombradas en specs (p. ej. `Layout`/`LotList`).

### 4.3 Ejecución end-to-end real

- Login/CRUD contra backend no se validó en esta auditoría con ejecución completa porque depende de que el backend esté corriendo y accesible.
- Aun así, el código muestra consumo real del backend y presencia de interceptor JWT.

---

## 5) Matriz de estado por requisito (✅/⚠️/❌)

| Requisito | Estado | Evidencia / Nota técnica |
|---|---:|---|
| Login JWT | ⚠️ | Login existe y guarda token, pero manejo de error es `alert()` y guard no valida expiración |
| Interceptor JWT | ⚠️ | Agrega `Authorization`, pero no envía `Accept-Language` ni centraliza errores |
| AuthGuard | ⚠️ | Existe, pero solo verifica token presente |
| RoleGuard | ❌ | No existe guard por rol ni protección por rol en rutas |
| Rutas protegidas | ⚠️ | Layout protegido; children sin control por rol |
| UI basada en roles | ❌ | Menú/acciones no se ocultan/inhabilitan por rol |
| CRUD Cultivos | ⚠️ | Implementado; errores por `alert()` y textos hardcodeados |
| CRUD Lotes | ⚠️ | Implementado; warnings `NG8103` por imports faltantes, errores por `alert()` |
| CRUD Eventos | ⚠️ | Implementado; sin validación reglas de negocio en UI |
| Historial cronológico | ⚠️ | Se lista; no se asegura orden ni validación antes de crear |
| Estado/métricas lote | ⚠️ | `getSummary` existe; UI hardcodeada |
| i18n frontend completa | ❌ | Solo login traduce; resto hardcodeado; JSON incompleto |
| Enviar `Accept-Language` | ❌ | Falta en HTTP |
| Errores backend traducidos | ❌ | Se muestra texto crudo en `alert(err.error?.message)` |
| Interceptor global de errores | ❌ | No existe |
| Pruebas unitarias frontend | ❌ | Specs rotas; `npm test` falla |
| Pruebas frontend Selenium | ❌ | No existe setup ni tests |
| GitHub Actions (CI/CD) | ❌ | No existe workflow |

---

## 6) Plan de trabajo (prioridad obligatoria y dependencias)

> Regla: avanzar en el orden indicado por el enunciado. Cada fase incluye **tareas**, **archivos objetivo** y **criterios de aceptación**.

### Fase 1 — 🔴 Corrección de errores actuales (bloqueantes)

**Meta:** que el proyecto compile limpio y que `npm test` sea ejecutable.

1) **Arreglar specs rotas para que `npm test` compile**
- Archivos:
	- `src/app/shared/layout/layout.spec.ts`
	- `src/app/features/*/*.spec.ts`
	- `src/app/core/services/*.spec.ts`
	- `src/app/app.spec.ts`
- Aceptación:
	- `npm test -- --watch=false` sin errores de TS

2) **Corregir imports faltantes en componentes standalone**
- Ejemplo detectado: `LotListComponent` usa `*ngFor`/`*ngIf` sin `CommonModule` o directivas.
- Archivos:
	- `src/app/features/lots/lot-list/lot-list.ts`
- Aceptación:
	- `npm run build` sin warnings `NG8103`

3) **Unificar base URL del backend (no hardcodear localhost)**
- Archivos:
	- `src/environments/environment.ts`
	- `src/app/core/services/crop.ts`
	- `src/app/core/services/lot.ts`
	- `src/app/core/services/event.ts`
	- `src/app/core/services/event-type.ts`
- Aceptación:
	- Ningún servicio tiene `http://localhost:8080` hardcodeado

**Dependencia:** ninguna (esto desbloquea el resto).

---

### Fase 2 — 🔴 Seguridad frontend (AuthGuard + RoleGuard + UI por roles)

**Meta:** proteger rutas/acciones por rol y manejar sesión correctamente.

1) **Endurecer `AuthService` y sesión**
- Validar expiración del JWT (`exp`).
- Soportar múltiples authorities (set/array).
- Definir método único `hasRole(roles: string[])`.
- Aceptación:
	- token expirado → logout y redirección a `/login`.

2) **Crear `roleGuard`**
- Guard funcional (`CanMatchFn` recomendado para evitar carga de componentes no autorizados).
- `data: { roles: [...] }` en rutas.
- Archivos:
	- `src/app/core/guards/role.guard.ts` (nuevo)
	- `src/app/app.routes.ts` (actualizar)
- Aceptación:
	- Un usuario VIEWER no puede navegar a rutas restringidas.

3) **UI basada en roles**
- Ocultar/inhabilitar links y acciones según rol.
- Archivos:
	- `src/app/shared/layout/layout.html`
	- (posible) `layout.ts` para helpers `canAccess(...)`
- Aceptación:
	- Menú solo muestra lo permitido por rol.

**Dependencia:** Fase 1 completada.

---

### Fase 3 — 🔴 Internacionalización completa (frontend + backend)

**Meta:** todo texto visible y mensajes de error sean consistentes en ES/EN.

1) **Estandarizar uso de `ngx-translate` en arquitectura standalone**
- Cada componente que use traducciones debe importar `TranslateModule`.

2) **Eliminar textos hardcodeados del layout y features**
- Archivos principales:
	- `src/app/shared/layout/layout.html`
	- `src/app/features/dashboard/dashboard.ts`
	- `src/app/features/crops/crop-list/crop-list.html`
	- `src/app/features/lots/lot-list/lot-list.html`
	- `src/app/features/events/event-list/event-list.html`
	- (y cualquier `alert/confirm` con texto)

3) **Expandir diccionarios i18n**
- Agregar namespaces: `nav`, `dashboard`, `crops`, `lots`, `events`, `buttons`, `confirm`, `http`.
- Archivos:
	- `src/assets/i18n/es.json`
	- `src/assets/i18n/en.json`

4) **Enviar `Accept-Language` al backend**
- Implementar interceptor (o extender el existente) para enviar `Accept-Language: <lang>` leyendo `localStorage('lang')`.
- Archivos:
	- `src/app/core/interceptors/auth-interceptor.ts` (o nuevo interceptor)
- Aceptación:
	- Cambiar idioma en navbar afecta respuestas del backend (cuando aplique) y mensajes UI.

**Dependencias:** Fase 1 y 2.

---

### Fase 4 — 🔴 Manejo de errores global (interceptor + UI)

**Meta:** eliminar `alert()`/`confirm()` y centralizar errores.

1) **Crear interceptor global de errores HTTP**
- Normalizar errores típicos: 400/401/403/404/409/500.
- Si backend ya responde con texto localizado, mostrarlo; si responde con códigos/keys, mapear vía `ngx-translate`.

2) **Reemplazar `alert/confirm` por Material (mínimo viable)**
- `MatSnackBar` para errores/éxitos.
- Confirmación mínima: (opción A) `window.confirm` temporal hasta tener `MatDialog` (si se acepta), o (opción B) `MatDialog` simple reutilizable.

**Dependencias:** Fase 1.

---

### Fase 5 — 🟡 Pruebas (Selenium obligatorio + unit tests)

**Meta:** tener evidencia automatizada de los flujos críticos.

1) **Unit tests (Vitest) mínimos pero correctos**
- Guards: `authGuard`, `roleGuard`.
- Interceptors: token + `Accept-Language`.
- Servicios: smoke tests o `HttpTestingController` (si aplica con el builder).

2) **E2E Selenium (obligatorio)**

Propuesta técnica (Node):
- Dependencias: `selenium-webdriver`, `chromedriver`.
- Tests mínimos:
	- Login válido → navega a dashboard.
	- Navegación a crops/lots/events.
	- Crear cultivo (y opcionalmente eliminar) con aserción de UI.

**Dependencias/condición:**
- Para que Selenium sea útil en CI, se necesita:
	- backend accesible durante el pipeline (URL fija) **o**
	- levantar backend con Docker Compose.

---

### Fase 6 — 🟡 Despliegue (GitHub Actions obligatorio)

**Meta:** pipeline reproducible y verificable.

- Crear workflows:
	1) `ci.yml`: `npm ci` → `npm run build` → `npm test -- --watch=false`.
	2) `e2e-selenium.yml` (o integrado): levantar app (`npm start` o `ng serve`) y correr Selenium headless con Chrome en Linux.

**Dependencia:** Fase 5 (al menos unit tests). Selenium depende de disponibilidad del backend.

---

### Fase 7 — 🟢 UI/UX (solo después de cumplir lo anterior)

- Remover estilos inline y homogeneizar con Material.
- Mejorar dashboard con métricas reales si backend las expone.
- Ajustar presupuesto de bundle solo si es un problema real (por ahora es warning).

---

## 7) Entregables y criterios de “listo”

- `npm run build` sin warnings funcionales (idealmente limpio).
- `npm test -- --watch=false` pasando.
- Idioma ES/EN consistente en toda la app.
- Requests al backend con `Authorization` y `Accept-Language`.
- Rutas y UI restringidas por rol.
- Interceptor de errores + feedback UI consistente (snackbar).
- Selenium E2E ejecutable localmente y en CI.
- GitHub Actions ejecutando build + unit tests + (si backend disponible) e2e.

---

## 8) Notas y riesgos

- **Dependencia backend para Selenium:** sin backend en CI, las pruebas E2E solo podrán validar UI “mockeada”. Se recomienda proveer contenedor o URL estable.
- **Claim `userId` en JWT:** el frontend lo usa para crear eventos. Si el backend deriva el usuario desde el token, lo correcto es eliminar `userId` del payload de creación o alinear claim.
- **Inconsistencia de endpoints:** unificar base URL con `environment.apiUrl` es clave para despliegue.

