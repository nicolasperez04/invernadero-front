# Funcionalidades del Sistema de Invernadero

> **Sistema de gestión integral para invernaderos** — Controla cultivos, lotes, eventos, notificaciones automáticas y genera reportes. Consta de un backend en Spring Boot 3.5.8 + Java 21 y un frontend en Angular 21 + Angular Material.

---

## 1. Arquitectura General del Sistema

### Backend (API REST)

| Capa               | Tecnología               | Propósito                                          |
| ------------------ | ------------------------ | -------------------------------------------------- |
| Controladores      | Spring Boot 3.5.8        | Exposición de endpoints REST                       |
| Servicios          | Spring Service           | Lógica de negocio y validaciones                   |
| Repositorios       | Spring Data JPA          | Acceso a base de datos PostgreSQL                  |
| Seguridad          | Spring Security 6 + JWT  | Autenticación y autorización                       |
| Tareas programadas | `@EnableScheduling`      | Riego automático, alertas de inactividad y cosecha |
| Tiempo real        | Server-Sent Events (SSE) | Actualizaciones en vivo al frontend                |
| Reportes           | iTextPDF 5               | Generación de informes PDF de cosecha              |

### Frontend (SPA)

| Capa                 | Tecnología              | Propósito                                                                |
| -------------------- | ----------------------- | ------------------------------------------------------------------------ |
| Framework            | Angular 21 (Standalone) | Single Page Application modular                                          |
| UI Components        | Angular Material 21     | Diálogos, íconos, snack-bars                                             |
| UI Kit propio        | Sigma Components (10)   | Badge, botón, card, input, tabla, progreso, spinner, toggle, empty-state |
| Gráficos             | Chart.js 4              | Dashboard con barras de actividad de eventos                             |
| Internacionalización | ngx-translate           | Español e inglés                                                         |
| Tiempo real          | EventSource (SSE)       | Suscripción a eventos del servidor                                       |
| Reportes             | Blob download           | Descarga de PDF desde el navegador                                       |
| Pruebas unitarias    | Vitest 4 + jsdom        | 13 spec files                                                            |
| Pruebas E2E          | Playwright + Chromium   | Flujos completos                                                         |

### Diagrama de Comunicación

```
[Angular SPA :4200]  --HTTP/SSE-->  [Spring Boot API :8080]  --JPA-->  [PostgreSQL]
                                       |
                                       |--@Scheduled--> [Tareas automáticas]
                                       |--iTextPDF-->  [Reportes PDF]
```

---

## 2. Autenticación y Seguridad

### 2.1 Inicio de Sesión

- **Ruta:** `/login`
- **Flujo:** El usuario ingresa correo electrónico y contraseña → `POST /api/auth/login`
- **Respuesta:** El servidor valida credenciales contra la base de datos y retorna un token JWT firmado con HMAC-SHA256
- **Almacenamiento:** El frontend guarda el JWT en `localStorage` con clave `token`
- **Validación visual:** Campo de contraseña con toggle de visibilidad (ojo), indicador de carga, mensaje de error para credenciales inválidas

### 2.2 Token JWT

- **Duración:** 300 minutos (5 horas)
- **Payload:** `sub` (email), `userId` (identificador numérico), `authorities` (roles del usuario)
- **Auto-logout:** Si el token expira mientras se navega, `AuthService.isAuthenticated()` lo detecta y redirige a `/login`

### 2.3 Interceptor de Autenticación

- **Archivo:** `core/interceptors/auth-interceptor.ts`
- **Función:** Agrega el header `Authorization: Bearer <token>` a todas las peticiones HTTP (excepto `/auth/login`)
- **Idioma:** También agrega `Accept-Language: es` o `en` según la preferencia del usuario

### 2.4 Interceptor de Errores

- **Archivo:** `core/interceptors/error-interceptor.ts`
- **Función:** Captura errores HTTP globales, los clasifica por código de estado y los envía a Taiga (sistema de reporte automático de errores)

### 2.5 Guards de Rutas

| Guard       | Tipo            | Función                                                                                                                                                         |
| ----------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authGuard` | `CanActivateFn` | Verifica que el usuario tenga un JWT válido y no expirado. Redirige a `/login` si no                                                                            |
| `roleGuard` | `CanMatchFn`    | Verifica que el usuario tenga el rol requerido. Usa `canMatch` para evitar lazy-loading de módulos no autorizados. Redirige a `/dashboard` si no tiene permisos |

---

## 3. Sistema de Roles y Permisos

### 3.1 Roles Definidos

| Rol          | Acceso a Dashboard | Cultivos                        | Lotes                       | Eventos       | Usuarios      |
| ------------ | ------------------ | ------------------------------- | --------------------------- | ------------- | ------------- |
| **ADMIN**    | Sí                 | CRUD completo + tipos de evento | CRUD completo + reporte PDF | CRUD completo | CRUD completo |
| **OPERATOR** | Sí                 | Crear, leer, actualizar         | Crear, leer, actualizar     | Crear, leer   | Solo lectura  |
| **VIEWER**   | Sí                 | Solo lectura                    | Solo lectura                | Solo lectura  | Sin acceso    |

### 3.2 Implementación en Backend

- Las autorizaciones se aplican con anotaciones `@PreAuthorize` en cada método de los controladores REST
- Ejemplo: `@PreAuthorize("hasAuthority('ROLE_ADMIN')")` para eliminar cultivos
- `CustomUserDetailsService` carga al usuario desde la base de datos e implementa `UserDetails` de Spring Security

### 3.3 Implementación en Frontend

- La barra lateral (`LayoutComponent`) filtra las opciones de navegación según el rol del usuario
- Los botones de acción (editar, eliminar) se muestran u ocultan según el rol
- `roleGuard` con `canMatch` previene que un usuario sin permisos siquiera cargue el módulo (lazy loading protegido)

---

## 4. Dashboard - Panel Principal

**Ruta:** `/dashboard`

### 4.1 Indicadores Clave (KPIs) — 4 Tarjetas Superiores

| KPI                         | Cálculo                              | Visual                                      |
| --------------------------- | ------------------------------------ | ------------------------------------------- |
| **Total Cultivos**          | `GET /crops` → length                | Tarjeta con ícono de pasto                  |
| **Total Lotes**             | `GET /lots` → length                 | Tarjeta con ícono de ubicación              |
| **Eventos últimos 30 días** | `dashboard.eventChart.values` sum    | Tarjeta con ícono de calendario             |
| **Progreso promedio**       | Promedio de `lotProgress[].progress` | Tarjeta con ícono de tendencia + porcentaje |

### 4.2 Gráfico de Actividad de Eventos (Chart.js)

- **Tipo:** Gráfico de barras
- **Eje X:** Fechas de los últimos 30 días
- **Eje Y:** Cantidad de eventos registrados por día
- **Estilo:** Colores tierra personalizados, tooltips con animación, transiciones suaves
- **Filtro:** Se actualiza cuando se selecciona un cultivo específico
- **Implementación:** Canvas con `ViewChild` y `MutationObserver` para esperar la disponibilidad del DOM

### 4.3 Estado de Lotes (Tarjetas de Color)

Cada lote se muestra con:

- **Punto de color** que indica el nivel de inactividad:
  - 🟢 **Verde** (`GREEN`) — Actividad reciente normal
  - 🟡 **Ámbar** (`YELLOW`) — Inactividad moderada (supera la mitad del umbral)
  - 🔴 **Rojo** (`RED`) — Inactividad crítica (supera el umbral definido para el cultivo)
- **Badge** con texto: "Activo", "Inactividad moderada" o "Inactividad crítica"
- **Borde coloreado** en la tarjeta (codificado por color)

### 4.4 Progreso de Cosechas

- **Barra de progreso** con porcentaje calculado como: `(días transcurridos / días totales estimados) × 100`
- **Etiqueta:** "X días transcurridos de Y totales — Z días restantes"
- **Color dinámico:** Verde si va bien, ámbar si está próximo, rojo si está vencido

### 4.5 Próximas Cosechas (Timeline)

- Lista ordenada por fecha de cosecha estimada (top 10)
- Cada ítem muestra:
  - Nombre del lote
  - Fecha estimada de cosecha
  - Días restantes (con badge de color)
  - Indicador visual de vencimiento si ya pasó la fecha

### 4.6 Filtro por Cultivo

- **Select** desplegable que carga todos los cultivos del sistema
- Al seleccionar un cultivo, se recargan todos los datos del dashboard filtrados por ese cultivo (eventos, lotes, progresos)
- Opción "Todos los cultivos" para volver a la vista general

### 4.7 Banner de Alertas

- Aparece cuando hay lotes con nivel de inactividad YELLOW o RED
- Texto dinámico: "1 lote requiere atención" / "N lotes requieren atención"
- Color de fondo amarillo o rojo según la severidad

### 4.8 Estados de Carga y Error

- **Spinner** de carga inicial (pantalla completa)
- **Banner de error** si falla la conexión con la API
- **Componente Empty State** cuando no hay datos disponibles
- **Transiciones suaves** entre estados de carga

---

## 5. Gestión de Cultivos

**Ruta:** `/crops` (ADMIN, OPERATOR)

### 5.1 Formulario de Crear/Editar Cultivo (Panel Superior)

| Campo                   | Tipo        | Validación                     | Descripción                       |
| ----------------------- | ----------- | ------------------------------ | --------------------------------- |
| Nombre                  | Texto       | Requerido, mínimo 2 caracteres | Identificador del cultivo         |
| Descripción             | Texto largo | Opcional                       | Detalles adicionales              |
| Días de crecimiento     | Número      | Requerido, mínimo 1            | Tiempo estimado de cosecha        |
| Umbral de inactividad   | Número      | Requerido, mínimo 1            | Días sin eventos antes de alertar |
| Riego (c/horas)         | Número      | Opcional                       | Frecuencia de riego automático    |
| Fertilización (c/días)  | Número      | Opcional                       | Intervalo recomendado             |
| Control plagas (c/días) | Número      | Opcional                       | Intervalo recomendado             |

### 5.2 Tabla de Cultivos (Panel Inferior)

- Columnas: Nombre, Descripción, Días crecimiento, Umbral inactividad, Riego, Fertilización, Control plagas, Acciones
- **Skeleton loading** mientras se cargan los datos
- **Empty state** cuando no hay cultivos registrados
- **Filas expandibles** solo para ADMIN/OPERATOR con botones de acción

### 5.3 Acciones por Rol

| Acción                    | ADMIN                | OPERATOR            | VIEWER |
| ------------------------- | -------------------- | ------------------- | ------ |
| Crear cultivo             | ✓                    | ✓                   | ✗      |
| Editar cultivo            | ✓ (inline en tabla)  | ✓ (inline en tabla) | ✗      |
| Eliminar cultivo          | ✓ (con confirmación) | ✗                   | ✗      |
| Gestionar tipos de evento | ✓                    | ✓                   | ✗      |

### 5.4 Asignación de Tipos de Evento por Cultivo

- **Diálogo modal** que se abre al hacer clic en "Tipos de evento"
- Muestra todos los tipos de evento disponibles (Siembra, Riego, Fertilización, Poda, Control de plagas, Cosecha)
- **Checkboxes** para asignar o desasignar tipos al cultivo
- Al crear un cultivo automáticamente se le asignan **todos** los tipos de evento disponibles
- **Endpoints:**
  - `GET /api/crops/{cropId}/event-types` — Listar tipos asignados
  - `POST /api/crops/{cropId}/event-types/{eventTypeId}` — Asignar tipo
  - `DELETE /api/crops/{cropId}/event-types/{eventTypeId}` — Desasignar tipo

### 5.5 Confirmación en Eliminaciones

- Al eliminar un cultivo aparece un diálogo de confirmación (`MatDialog`) con el mensaje traducido
- Solo el rol ADMIN puede ejecutar esta acción

### 5.6 Notificaciones de Éxito/Error

- **SnackBar** de Angular Material con mensaje de éxito ("Cultivo creado exitosamente")
- Manejo de errores con mensajes descriptivos
- El error de duplicado de nombre se maneja desde el backend con código 400

---

## 6. Gestión de Lotes

**Ruta:** `/lots` (ADMIN, OPERATOR)

### 6.1 Formulario de Crear Lote

| Campo           | Tipo       | Validación                     | Descripción                     |
| --------------- | ---------- | ------------------------------ | ------------------------------- |
| Nombre          | Texto      | Requerido, mínimo 2 caracteres | Identificador del lote          |
| Cultivo         | Select     | Requerido                      | Cultivo padre (carga desde API) |
| Fecha de inicio | Datepicker | Requerida                      | Inicio del ciclo del lote       |
| Fecha de fin    | Datepicker | Opcional                       | Fecha de finalización manual    |

### 6.2 Filtro por Estado

- **Select** con opciones: "Todos los estados", "Creado", "En producción", "Finalizado"
- Al seleccionar, se recarga la lista de lotes con el filtro `?status=` en la URL
- Los estados se asignan automáticamente según los eventos:
  - `CREATED` — Estado inicial al crear el lote
  - `IN_PRODUCTION` — Se asigna al registrar evento de Siembra
  - `FINISHED` — Se asigna al registrar evento de Cosecha

### 6.3 Tabla de Lotes

- Columnas: Nombre, Cultivo, Estado (con badge de color), Fecha inicio, Fecha fin, Acciones
- **Badges de estado:**
  - 🟦 **Creado** (azul)
  - 🟧 **En producción** (ámbar)
  - ✅ **Finalizado** (verde)
- **Acciones:** Ver resumen (todos), Editar (ADMIN/OPERATOR), Eliminar (ADMIN), Descargar reporte PDF (solo FINISHED)

### 6.4 Resumen del Lote (Modal)

- **Diálogo emergente** con información detallada del lote
- Se obtiene de `GET /api/lots/{id}/summary`
- **Métricas mostradas:**
  - Estado actual y nivel de inactividad (con color)
  - Total de eventos registrados
  - Duración total en días
  - Frecuencia de eventos (eventos por día)
  - Fecha de siembra
  - Días totales, transcurridos y restantes
  - Fecha estimada de cosecha
  - Último evento (tipo y fecha)
- **Barra de progreso visual**
- Botón para descargar reporte PDF (si el lote está FINISHED)

### 6.5 Descarga de Reporte PDF

- **Endpoint:** `GET /api/lots/{id}/report`
- **Formato:** Devuelve `byte[]` con contenido PDF
- **Frontend:** Recibe el Blob, crea una URL temporal con `URL.createObjectURL()`, dispara la descarga con un `<a>` invisible
- **Nombre del archivo:** `informe_cosecha_{nombre_lote}_{fecha}.pdf`
- Solo disponible para lotes con estado `FINISHED`

### 6.6 Edición Inline

- Al hacer clic en "Editar", el lote se expande en la tabla con campos editables
- Los campos de cultivo, fecha inicio y fecha fin se muestran deshabilitados (solo se puede editar el nombre)
- Al guardar se envía `PUT /api/lots/{id}`
- Indicador de carga durante la operación

---

## 7. Gestión de Eventos

**Ruta:** `/events` (ADMIN, OPERATOR, VIEWER)

### 7.1 Tipos de Evento Disponibles

| Tipo                                   | Categoría     | Descripción                    |
| -------------------------------------- | ------------- | ------------------------------ |
| **SIEMBRA** (`SOWING`)                 | PRODUCCIÓN    | Registro de siembra en el lote |
| **RIEGO** (`IRRIGATION`)               | MANTENIMIENTO | Riego manual o automático      |
| **FERTILIZACIÓN** (`FERTILIZATION`)    | MANTENIMIENTO | Aplicación de fertilizantes    |
| **PODA** (`PRUNING`)                   | MANTENIMIENTO | Poda de plantas                |
| **CONTROL DE PLAGAS** (`PEST_CONTROL`) | CONTROL       | Aplicación de pesticidas       |
| **COSECHA** (`HARVEST`)                | PRODUCCIÓN    | Cosecha del lote (lo finaliza) |

### 7.2 Registro de Nuevo Evento

- **Selector de lote:** Carga todos los lotes desde `GET /api/lots`
- **Selector de tipo:** Carga los tipos de evento desde `GET /api/crops/{cropId}/event-types` (solo los asignados al cultivo del lote seleccionado)
- **Fecha y hora:** Input `datetime-local`
- **Descripción:** Textarea opcional para notas adicionales

### 7.3 Validaciones del Backend al Registrar Evento

| Validación                                                | Comportamiento    |
| --------------------------------------------------------- | ----------------- |
| No se puede sembrar dos veces el mismo lote               | Retorna error 400 |
| No se puede cosechar sin haber sembrado antes             | Retorna error 400 |
| No se puede registrar eventos en lotes ya cosechados      | Retorna error 400 |
| El tipo de evento debe estar asignado al cultivo del lote | Retorna error 400 |
| La fecha del evento no puede ser futura                   | Retorna error 400 |

### 7.4 Automatizaciones al Registrar Evento

- **Al registrar SIEMBRA:**
  - El estado del lote cambia automáticamente a `IN_PRODUCTION`
  - Se calcula la fecha estimada de cosecha: `fecha_siembra + días_crecimiento_del_cultivo`
- **Al registrar COSECHA:**
  - El estado del lote cambia automáticamente a `FINISHED`
  - Se genera automáticamente un reporte PDF y se guarda
- **Al registrar cualquier evento:**
  - Se envía una notificación SSE (`EVENT_CREATED`) a todos los clientes conectados
  - Los clientes SSE pueden estar en la misma red o en Internet

### 7.5 Historial de Eventos

- **Tabla** que se actualiza al seleccionar un lote
- **Columnas:** Tipo (con badge), Fecha y hora, Usuario que registró, Descripción
- **Traducción:** Los nombres de tipos de evento se muestran en español o inglés según la configuración de idioma

### 7.6 Filtros Avanzados

- **Endpoint:** `GET /api/events/filter?lotId=&type=&startDate=&endDate=`
- Permite filtrar eventos por lote, tipo de evento, rango de fechas

---

## 8. Notificaciones

### 8.1 Campanilla de Notificaciones (Toolbar)

- **Ícono** de campana en la barra superior con badge del número de notificaciones no leídas
- **Dropdown** al hacer clic que muestra la lista de notificaciones ordenadas por fecha descendente
- Cada notificación muestra:
  - **Nivel:** INFO (azul), WARNING (ámbar), CRITICAL (rojo)
  - **Mensaje:** Texto descriptivo
  - **Fecha:** Formato relativo ("Hoy", "Ayer", "Hace N días")
- **Acciones:** Marcar una como leída (clic individual), "Marcar todo como leído"
- **Actualización automática:** Cada vez que se abre el dropdown

### 8.2 Notificaciones Automáticas Programadas

#### Alertas de Inactividad (Cada 6 horas)

- **Cron:** `0 0 */6 * * *`
- **Proceso:** Recorre todos los lotes con estado `IN_PRODUCTION`
- **Cálculo:** Compara la fecha del último evento contra el umbral de inactividad del cultivo
- **Niveles:**
  - `YELLOW` (INACTIVITY_WARNING) — Cuando los días sin eventos superan la mitad del umbral
  - `RED` (INACTIVITY_CRITICAL) — Cuando los días sin eventos superan el umbral completo
- **Deduplicación:** No crea notificaciones duplicadas para el mismo lote y tipo

#### Alertas de Cosecha (Diario a las 6:00 AM)

- **Cron:** `0 0 6 * * *`
- **Proceso:** Recorre todos los lotes con fecha estimada de cosecha
- **Tipos de alerta:**
  - `HARVEST_7_DAYS` — Faltan 7 días para la cosecha
  - `HARVEST_3_DAYS` — Faltan 3 días para la cosecha
  - `HARVEST_1_DAY` — Falta 1 día para la cosecha
  - `HARVEST_OVERDUE` — La cosecha está vencida
- **Limpieza:** Si el lote ya fue cosechado, elimina las notificaciones pendientes

### 8.3 Actualización en Tiempo Real (SSE)

- Cuando ocurre un cambio (crear/editar/eliminar cultivo, lote, evento), el backend envía un evento SSE
- El frontend recibe el evento y actualiza automáticamente el dashboard
- **Reconexión automática** con 3 segundos de espera si la conexión se pierde

---

## 9. Riego Automatizado

### 9.1 Tarea Programada (Cada 1 hora)

- **Cron:** `0 0 */1 * * *`
- **Condición:** El cultivo asociado al lote debe tener `irrigationFrequencyHours > 0`
- **Proceso:**
  1. Obtiene todos los lotes en estado `IN_PRODUCTION`
  2. Para cada lote, busca el último evento de riego registrado
  3. Si el tiempo transcurrido desde el último riego es mayor o igual a la frecuencia configurada, crea automáticamente un evento de tipo `IRRIGATION`
  4. Envía una notificación SSE (`EVENT_CREATED`)
- **Usuario sistema:** Busca un usuario por email (configurado en propiedades) para asignarlo como responsable del evento automático

### 9.2 Visualización

- Los riegos automáticos aparecen en el historial de eventos del lote como cualquier otro evento
- Se pueden diferenciar por el usuario que los registró (usuario del sistema)
- El dashboard se actualiza en tiempo real gracias a SSE

---

## 10. Actualizaciones en Tiempo Real (SSE)

### 10.1 Arquitectura

- **Protocolo:** Server-Sent Events (HTTP, unidireccional servidor → cliente)
- **Endpoint:** `GET /api/sse/subscribe?token={jwt}`
- **Autenticación:** El token JWT se pasa como query parameter (los EventSource no soportan headers personalizados)
- **Timeout:** 30 minutos por conexión (se renueva automáticamente al recibir un evento)

### 10.2 Eventos Emitidos por el Backend

| Evento          | Cuándo se Emite                      | Contenido         |
| --------------- | ------------------------------------ | ----------------- |
| `CROP_UPDATED`  | Crear, editar o eliminar cultivo     | Datos del cultivo |
| `LOT_UPDATED`   | Crear, editar o eliminar lote        | Datos del lote    |
| `EVENT_CREATED` | Registrar evento manual o automático | Datos del evento  |

### 10.3 Manejo en el Frontend

- **Servicio:** `SseService` en `core/services/sse.service.ts`
- **Conexión:** Se establece en el `ngOnInit` del DashboardComponent
- **Reconexión:** Si la conexión falla, reintenta después de 3 segundos
- **Procesamiento:** Aplica `debounceTime(500ms)` para evitar múltiples recargas seguidas
- **Limpieza:** Se desconecta en `ngOnDestroy` para evitar fugas de memoria

### 10.4 Beneficios

- Sin polling: el servidor notifica solo cuando hay cambios
- Sin WebSocket: más simple, usa HTTP estándar, funciona detrás de proxies
- Reconexión automática: tolerante a fallos de red

---

## 11. Internacionalización (i18n)

### 11.1 Idiomas Soportados

| Idioma  | Archivo               | Estado                        |
| ------- | --------------------- | ----------------------------- |
| Español | `assets/i18n/es.json` | Completo (idioma por defecto) |
| Inglés  | `assets/i18n/en.json` | Completo                      |

### 11.2 Implementación

- **Librería:** `@ngx-translate/core` v15 + `@ngx-translate/http-loader` v8
- **Carga:** Archivos JSON mediante `HttpLoaderFactory` en el `app.config.ts`
- **Cambio de idioma:** Botones ES/EN en la barra superior (toolbar del LayoutComponent)
- **Persistencia:** La preferencia se guarda en `localStorage` con clave `lang`

### 11.3 Alcance de Traducciones

| Sección        | Claves                                                    |
| -------------- | --------------------------------------------------------- |
| Login          | Título, subtítulo, campos, errores                        |
| Navegación     | Dashboard, Cultivos, Lotes, Eventos, Salir                |
| Dashboard      | KPIs, estados, alertas, eventos, próximas cosechas        |
| Cultivos       | Formulario, tabla, errores de validación, acciones        |
| Lotes          | Formulario, tabla, resumen, estados, reporte              |
| Eventos        | Tipos de evento (Siembra, Riego, etc.), historial         |
| Notificaciones | Título, vacío, acciones                                   |
| Confirmaciones | Diálogo de eliminar                                       |
| Errores HTTP   | Genéricos (no autorizado, prohibido, no encontrado, etc.) |

### 11.4 Backend (Validaciones)

- Los mensajes de error de validación también están internacionalizados en el backend
- Archivos: `messages.properties` (inglés) y `messages_es.properties` (español)
- Se usa `Accept-Language` header para determinar el idioma
- Se puede cambiar el idioma vía query parameter `?lang=es`

---

## 12. Reportes PDF

### 12.1 Generación (Backend — iTextPDF 5.5.13.3)

- **Clase:** `PdfReportService`
- **Método:** `generateLotReport(Long lotId)` → `byte[]`
- **Contenido del PDF:**
  1. **Encabezado:** Título "Informe de Cosecha", nombre del lote, fecha de generación
  2. **Información del lote:** Tabla con nombre, cultivo asociado, estado
  3. **Fechas clave:** Inicio, siembra, cosecha estimada, cosecha real, duración total
  4. **Estadísticas:** Total de eventos, frecuencia (eventos/día), nivel de inactividad
  5. **Historial de eventos:** Tabla detallada con tipo, fecha, usuario y descripción de cada evento

### 12.2 Descarga (Frontend)

- **Botón** "Descargar informe de cosecha" en el modal de resumen del lote
- **Visible solo** para lotes con estado `FINISHED`
- **Flujo:**
  1. `LotService.getReport(id)` con `responseType: 'blob'`
  2. `URL.createObjectURL(blob)` crea una URL temporal
  3. Se genera un enlace `<a>` invisible y se hace clic automáticamente
  4. `URL.revokeObjectURL()` libera memoria
- **Nombre del archivo:** `informe_cosecha_{nombre}_{YYYY-MM-DD}.pdf`

---

## 13. Gestión de Usuarios

**Ruta:** Solo ADMIN tiene acceso (no hay ruta frontal dedicada, se gestiona vía API)

### 13.1 Endpoints de Usuarios

| Método | Ruta              | Acción        | Rol             |
| ------ | ----------------- | ------------- | --------------- |
| POST   | `/api/users`      | Crear usuario | ADMIN           |
| GET    | `/api/users`      | Listar todos  | ADMIN           |
| GET    | `/api/users/{id}` | Ver usuario   | ADMIN, OPERATOR |
| PUT    | `/api/users/{id}` | Actualizar    | ADMIN           |
| DELETE | `/api/users/{id}` | Eliminar      | ADMIN           |

### 13.2 Campos del Usuario

| Campo      | Tipo            | Validación                 |
| ---------- | --------------- | -------------------------- |
| Nombre     | String          | No vacío                   |
| Apellido   | String          | No vacío                   |
| Email      | String (único)  | Email válido, no duplicado |
| Contraseña | String (BCrypt) | Mínimo 6 caracteres        |
| Rol        | Enum            | ADMIN, OPERATOR, VIEWER    |
| Activo     | Boolean         | Default: true              |

### 13.3 Encriptación de Contraseñas

- Spring Security `BCryptPasswordEncoder`
- Al crear o actualizar usuario, la contraseña se hashea antes de persistir

---

## 14. Diagrama de Navegación del Frontend

```
/login  ─────────────────────────────────────────────┐
                                                      │
/  (LayoutComponent ─ authGuard)                      │
├── /dashboard     → DashboardComponent               │
├── /crops         → CropListComponent  (ADMIN, OP)   │
├── /lots          → LotListComponent   (ADMIN, OP)   │
├── /events        → EventListComponent (ADMIN, OP, VIEWER)
└── /**            → Redirige a /login                │
                                                      │
Empty path → Redirige a /dashboard ───────────────────┘
```

---

## 15. Actualización en Tiempo Real del Dashboard

```
[Backend]
  │
  ├── Crear/editar/eliminar Cultivo ──→ SSE: "CROP_UPDATED"
  ├── Crear/editar/eliminar Lote   ──→ SSE: "LOT_UPDATED"
  ├── Registrar Evento (manual)     ──→ SSE: "EVENT_CREATED"
  └── Riego Automático (cada 1h)    ──→ SSE: "EVENT_CREATED"
       │
       ▼
[SSE Service - Frontend]
       │
       ├── EventSource conectado a /api/sse/subscribe?token={jwt}
       ├── Recibe evento ─→ events$.next({ type, data })
       ├── DashboardComponent suscrito con debounce 500ms
       └── Recarga datos del dashboard
            ├── GET /api/dashboard (con cropId si aplica)
            └── Actualiza KPIs, gráfico, lotes, progresos
```

---

## 16. Pruebas del Sistema

### 16.1 Pruebas Unitarias (Frontend — Vitest)

- **Framework:** Vitest 4.x con jsdom, globals, pool: forks
- **Cobertura:** 13 archivos spec
  - `app.spec.ts` — Componente raíz
  - `auth-interceptor.spec.ts` — Interceptor JWT
  - `crop.spec.ts` — Servicio de cultivos
  - `event.spec.ts` — Servicio de eventos
  - `event-type.spec.ts` — Servicio de tipos de evento
  - `lot.spec.ts` — Servicio de lotes
  - `sse.service.spec.ts` — Servicio SSE
  - `login.spec.ts` — Componente de login
  - `crop-list.spec.ts` — Lista de cultivos
  - `dashboard.spec.ts` — Dashboard
  - `event-list.spec.ts` — Lista de eventos
  - `lot-list.spec.ts` — Lista de lotes
  - `layout.spec.ts` — Layout principal
- **Comando:** `npm test`

### 16.2 Pruebas E2E (Frontend — Playwright)

- **Framework:** Playwright con Chromium
- **Autenticación:** `auth.setup.ts` para estado de login persistente entre tests
- **Configuración:** `npm start` como webServer (se reusa si no es CI)
- **2 reintentos** en CI
- **Comandos:**
  - `npm run e2e` — Headless
  - `npm run e2e:ui` — UI mode interactivo

### 16.3 Pruebas Unitarias (Backend — JUnit 5 + JaCoCo)

- **Framework:** JUnit 5, Mockito, MockMvc
- **Cobertura:** JaCoCo integrado en el build de Maven (`mvn verify`)
- **Base de datos:** H2 en memoria para tests
- **Cobertura mínima:** Configurada en el pom.xml

---

## 17. DevOps y Despliegue

### 17.1 Docker (Backend)

- **Dockerfile multi-etapa:**
  - Etapa 1: Build con JDK 21 + Maven
  - Etapa 2: Runtime con JRE 21 (imagen más pequeña)
- **Usuario no-root** para seguridad
- **HEALTHCHECK** en `/api/health`
- **Flag:** `--enable-preview` para características preview de Java

### 17.2 CI/CD (GitHub Actions)

- **Archivo:** `.github/workflows/ci.yml`
- **Trigger:** Cada push y PR a `main`
- **Pasos:**
  1. Compilar con Maven
  2. `mvn verify` (tests + JaCoCo coverage)
  3. Empaquetar JAR
  4. Subir artefactos (JAR + reportes de cobertura)

### 17.3 Despliegue en Render (Producción)

- **API:** `https://invernadero-lui9.onrender.com/api`
- **Frontend:** Render Static Site
  - Build command: `npm run build`
  - Publish directory: `dist/proyecto-front/browser`
  - SPA fallback via `static.json`: `{ "routes": { "/**": "index.html" } }`

### 17.4 Entornos

| Entorno        | API URL                                     | Frontend                | Base de datos        |
| -------------- | ------------------------------------------- | ----------------------- | -------------------- |
| **Desarrollo** | `http://localhost:8080/api`                 | `http://localhost:4200` | PostgreSQL local     |
| **Producción** | `https://invernadero-lui9.onrender.com/api` | Render Static Site      | PostgreSQL en Render |

---

## 18. Resumen de Endpoints del Backend

### Autenticación

| Método | Ruta              | Público |
| ------ | ----------------- | ------- |
| POST   | `/api/auth/login` | Sí      |

### Dashboard

| Método | Ruta                      | Descripción                                         |
| ------ | ------------------------- | --------------------------------------------------- |
| GET    | `/api/dashboard`          | Dashboard completo (con filtro opcional `?cropId=`) |
| GET    | `/api/dashboard/events`   | Datos del gráfico de eventos                        |
| GET    | `/api/dashboard/status`   | Estados de los lotes                                |
| GET    | `/api/dashboard/progress` | Progreso de cosechas                                |

### Cultivos

| Método | Ruta                                            | Roles                   |
| ------ | ----------------------------------------------- | ----------------------- |
| GET    | `/api/crops`                                    | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/crops/{id}`                               | ADMIN, OPERATOR, VIEWER |
| POST   | `/api/crops`                                    | ADMIN, OPERATOR         |
| PUT    | `/api/crops/{id}`                               | ADMIN                   |
| DELETE | `/api/crops/{id}`                               | ADMIN                   |
| GET    | `/api/crops/{cropId}/event-types`               | ADMIN, OPERATOR, VIEWER |
| POST   | `/api/crops/{cropId}/event-types/{eventTypeId}` | ADMIN, OPERATOR         |
| DELETE | `/api/crops/{cropId}/event-types/{eventTypeId}` | ADMIN, OPERATOR         |

### Lotes

| Método | Ruta                      | Roles                   |
| ------ | ------------------------- | ----------------------- |
| GET    | `/api/lots`               | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/lots/{id}`          | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/lots/crop/{cropId}` | ADMIN, OPERATOR, VIEWER |
| POST   | `/api/lots`               | ADMIN, OPERATOR         |
| PUT    | `/api/lots/{id}`          | ADMIN, OPERATOR         |
| DELETE | `/api/lots/{id}`          | ADMIN                   |
| GET    | `/api/lots/{id}/summary`  | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/lots/{id}/report`   | ADMIN, OPERATOR, VIEWER |

### Eventos

| Método | Ruta                              | Roles                   |
| ------ | --------------------------------- | ----------------------- |
| GET    | `/api/events`                     | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/events/{id}`                | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/events/lot/{lotId}`         | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/events/lot/{lotId}/history` | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/events/filter`              | ADMIN, OPERATOR, VIEWER |
| POST   | `/api/events`                     | ADMIN, OPERATOR         |

### Tipos de Evento

| Método | Ruta                           | Roles                   |
| ------ | ------------------------------ | ----------------------- |
| GET    | `/api/event-types`             | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/event-types/{id}`        | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/event-types/name/{name}` | ADMIN, OPERATOR, VIEWER |

### Notificaciones

| Método | Ruta                              | Roles                   |
| ------ | --------------------------------- | ----------------------- |
| GET    | `/api/notifications`              | ADMIN, OPERATOR, VIEWER |
| GET    | `/api/notifications/unread-count` | ADMIN, OPERATOR, VIEWER |
| PUT    | `/api/notifications/{id}/read`    | ADMIN, OPERATOR, VIEWER |
| PUT    | `/api/notifications/read-all`     | ADMIN, OPERATOR, VIEWER |

### Usuarios

| Método | Ruta              | Roles           |
| ------ | ----------------- | --------------- |
| GET    | `/api/users`      | ADMIN           |
| GET    | `/api/users/{id}` | ADMIN, OPERATOR |
| POST   | `/api/users`      | ADMIN           |
| PUT    | `/api/users/{id}` | ADMIN           |
| DELETE | `/api/users/{id}` | ADMIN           |

### Tiempo Real

| Método | Ruta                        | Descripción                               |
| ------ | --------------------------- | ----------------------------------------- |
| GET    | `/api/sse/subscribe?token=` | Suscripción SSE (público, requiere token) |

### Salud

| Método | Ruta          | Descripción                         |
| ------ | ------------- | ----------------------------------- |
| GET    | `/api/health` | Health check (público, para Docker) |

---

## 19. Stack Tecnológico Completo

### Backend

| Tecnología        | Versión  | Propósito                        |
| ----------------- | -------- | -------------------------------- |
| Java              | 21       | Lenguaje base                    |
| Spring Boot       | 3.5.8    | Framework principal              |
| Spring Data JPA   | 3.5.x    | Persistencia y repositorios      |
| Spring Security   | 6.x      | Autenticación y autorización     |
| Spring Mail       | 3.5.x    | Envío de correos                 |
| PostgreSQL        | —        | Base de datos principal          |
| H2                | —        | Base de datos para tests         |
| iTextPDF          | 5.5.13.3 | Generación de PDFs               |
| Apache POI        | 5.4.0    | Generación de Excel (disponible) |
| Tess4J            | 5.8.0    | OCR (disponible)                 |
| JJWT              | 0.12.6   | Creación y validación de JWT     |
| Lombok            | —        | Reducción de boilerplate         |
| OpenAPI / Swagger | —        | Documentación de API             |
| Maven             | —        | Gestión de dependencias          |
| JaCoCo            | —        | Cobertura de código              |
| JUnit 5           | —        | Pruebas unitarias                |
| Mockito           | —        | Mocks en pruebas                 |
| Docker            | —        | Contenedorización                |
| GitHub Actions    | —        | CI/CD                            |

### Frontend

| Tecnología       | Versión | Propósito              |
| ---------------- | ------- | ---------------------- |
| Angular          | 21      | Framework SPA          |
| Angular Material | 21      | UI components          |
| Chart.js         | 4.x     | Gráficos del dashboard |
| ngx-translate    | 15      | Internacionalización   |
| jwt-decode       | —       | Decodificación de JWT  |
| RxJS             | 7.x     | Programación reactiva  |
| Vitest           | 4.x     | Pruebas unitarias      |
| Playwright       | —       | Pruebas E2E            |
| Prettier         | —       | Formateo de código     |

---

## 20. Guía de Sustentación — Lo Que Debes Mostrar

### 20.1 Introducción (2 min)

1. **Problema:** Los invernaderos necesitan un sistema centralizado para gestionar cultivos, lotes, eventos y alertas
2. **Solución:** Aplicación web full-stack con dashboard en tiempo real, automatización de riego y alertas
3. **Arquitectura:** Angular SPA ↔ Spring Boot REST API ↔ PostgreSQL

### 20.2 Módulo de Autenticación (2 min)

1. Mostrar pantalla de login con validación de campos
2. Iniciar sesión con cada rol (ADMIN, OPERATOR, VIEWER)
3. Demostrar que un VIEWER no puede ver Cultivos ni Lotes (solo Eventos)
4. Explicar el flujo JWT: emisión, almacenamiento en localStorage, envío en cada request

### 20.3 Dashboard (5 min) ⭐

1. **KPIs:** Señalar las 4 tarjetas con totales
2. **Gráfico de barras:** Explicar que muestra eventos por día (últimos 30 días)
3. **Filtro por cultivo:** Seleccionar un cultivo y ver cómo cambian KPI y gráfico
4. **Estado de lotes:** Mostrar las tarjetas con los puntos de color (verde/ámbar/rojo)
5. **Progreso de cosechas:** Mostrar las barras con días transcurridos y restantes
6. **Próximas cosechas:** Timeline con fechas estimadas
7. **Tiempo real:** Abrir dos ventanas, crear un evento en una y mostrar cómo se actualiza la otra automáticamente vía SSE

### 20.4 Gestión de Cultivos (3 min)

1. Crear un cultivo nuevo con todos los campos
2. Mostrar la tabla con todos los cultivos
3. Editar inline en la tabla
4. **Asignación de tipos de evento:** Abrir el diálogo modal y mostrar cómo se marcan/desmarcan tipos
5. Eliminar con confirmación (solo ADMIN)

### 20.5 Gestión de Lotes (4 min)

1. Crear un lote asociado a un cultivo
2. Mostrar el filtro por estado (Creando / En producción / Finalizado)
3. **Resumen del lote:** Abrir el modal y explicar cada métrica (total eventos, duración, frecuencia, días transcurridos/restantes)
4. **Descarga de PDF:** Si hay un lote finalizado, descargar el reporte y mostrar el PDF generado

### 20.6 Gestión de Eventos (4 min)

1. Seleccionar un lote, elegir tipo de evento, registrar uno
2. **Validación automática:** Intentar registrar una siembra en un lote que ya fue sembrado → mostrar el error
3. **Cambio de estado:** Mostrar cómo el lote pasa de "Creado" a "En producción" al sembrar
4. **Fecha de cosecha estimada:** Mostrar que se calculó automáticamente
5. **Historial:** Mostrar la tabla con todos los eventos del lote

### 20.7 Notificaciones y Automatizaciones (3 min)

1. **Campanilla:** Abrir el dropdown de notificaciones
2. Explicar que las notificaciones se generan automáticamente:
   - Cada 6 horas: alertas de inactividad
   - Cada día a las 6 AM: alertas de cosecha
   - Cada hora: riego automático
3. Mostrar una notificación de ejemplo y marcarla como leída

### 20.8 Internacionalización (1 min)

1. Cambiar de español a inglés con el botón en la toolbar
2. Mostrar que todo el UI se traduce (títulos, tablas, formularios, errores)

### 20.9 Reporte PDF (1 min)

1. Desde el resumen de un lote finalizado, hacer clic en "Descargar informe"
2. Mostrar el PDF generado con:
   - Datos del lote
   - Estadísticas
   - Historial de eventos

### 20.10 Roles y Permisos (2 min)

1. Mostrar la tabla de roles (quién puede hacer qué)
2. Demostrar con dos sesiones: ADMIN ve botones de eliminar, VIEWER no
3. Explicar la seguridad en backend (`@PreAuthorize`) y frontend (guards + filtrado de UI)

### 20.11 Demo del Riego Automático (1 min)

1. Configurar un cultivo con `irrigationFrequencyHours: 1` (riego cada hora)
2. Crear un lote y registrar una siembra
3. Explicar que automáticamente, cada hora, el sistema creará un evento de riego sin intervención humana

### 20.12 DevOps (1 min)

1. Mostrar el Dockerfile multi-etapa
2. Mostrar el workflow de GitHub Actions (.github/workflows/ci.yml)
3. Mencionar el despliegue en Render
4. Mencionar Swagger UI en `/swagger-ui.html`

---

> **Documento generado para sustentación del proyecto** — Sistema de Invernadero
>
> Backend: Spring Boot 3.5.8 + Java 21 | Frontend: Angular 21 + Angular Material 21 | BD: PostgreSQL
