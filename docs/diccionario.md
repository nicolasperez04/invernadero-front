# Diccionario de Datos — SIGMA Invernadero

## 1. Descripción del Sistema

SIGMA es un sistema de gestión integral de invernaderos que permite administrar
cultivos, lotes, eventos y usuarios. El sistema controla el ciclo completo de
producción agrícola desde la siembra hasta la cosecha, con monitoreo de progreso,
niveles de inactividad, alertas programadas y riego automático.

**Arquitectura:** Spring Boot 3.5.8 + Java 21 (Preview) + PostgreSQL (producción) / H2 (tests)
**Frontend:** Angular 21 + Angular Material + Chart.js
**Autenticación:** JWT (Spring Security)
**Tiempo real:** SSE (Server-Sent Events)
**ORM:** Hibernate / JPA con MapStruct para Entity ↔ DTO

---

## 2. Tablas del Sistema

### 2.1 Tabla: `crops`

Catálogo de tipos de cultivos disponibles. Define parámetros agronómicos como
umbrales de inactividad, días de crecimiento, frecuencia de riego, fertilización
y control de plagas.

| Campo                            | Tipo           | Nullable | Restricciones      | Notas / Reglas de Negocio                                                                                                                |
| -------------------------------- | -------------- | -------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                             | `BIGINT`       | NO       | PK, AUTO_INCREMENT | Identificador único                                                                                                                      |
| `name`                           | `VARCHAR(255)` | NO       | NOT NULL, UNIQUE   | Nombre único del cultivo. No pueden existir dos cultivos con el mismo nombre                                                             |
| `description`                    | `TEXT`         | SI       | -                  | Descripción detallada del cultivo                                                                                                        |
| `inactivity_days_threshold`      | `INTEGER`      | NO       | NOT NULL           | Días máximos de inactividad antes de generar alerta. Usado por `LotService.getInactivityStatus()` para calcular niveles GREEN/YELLOW/RED |
| `estimated_growth_days`          | `INTEGER`      | NO       | NOT NULL           | Días estimados desde siembra hasta cosecha. Se usa para calcular `estimatedHarvestDate` al registrar evento SOWING                       |
| `irrigation_frequency_hours`     | `INTEGER`      | SI       | -                  | Cada cuántas horas se debe regar automáticamente. 0 o NULL = sin riego automático. Evaluado cada hora por `IrrigationService`            |
| `recommended_fertilization_days` | `INTEGER`      | SI       | -                  | Días recomendados entre fertilizaciones (solo referencia, no automatizado)                                                               |
| `recommended_pest_control_days`  | `INTEGER`      | SI       | -                  | Días recomendados entre controles de plagas (solo referencia, no automatizado)                                                           |

**Relaciones:**

- `1 → N` con `lots` (un cultivo puede tener muchos lotes)
- `1 → N` con `crop_event_types` (un cultivo tiene muchos tipos de evento asociados)

**Reglas de Negocio:**

- **Nombre único:** Al crear o actualizar, se valida que no exista otro cultivo con el mismo nombre (`CropService.createCrop`, línea 38-47)
- **Auto-asociación de EventTypes:** Al crear un nuevo cultivo, se le asocian automáticamente todos los `EventType` existentes en el sistema (`CropService.createCrop`, línea 57-64)
- **SSE notification:** Todo cambio en cultivos envía `{"type":"CROP_UPDATED"}` al canal SSE `"dashboard"` (`CropService`, línea 67)
- **Actualización parcial:** Solo los campos no-null del request se aplican en update (`CropService.updateCrop`, línea 159-202)

---

### 2.2 Tabla: `users`

Usuarios del sistema con autenticación JWT y control de roles mediante Spring Security.

| Campo       | Tipo           | Nullable | Restricciones      | Notas / Reglas de Negocio                                                  |
| ----------- | -------------- | -------- | ------------------ | -------------------------------------------------------------------------- |
| `id`        | `BIGINT`       | NO       | PK, AUTO_INCREMENT | Identificador único                                                        |
| `name`      | `VARCHAR(255)` | NO       | NOT NULL           | Nombres del usuario                                                        |
| `last_name` | `VARCHAR(255)` | NO       | NOT NULL           | Apellidos del usuario                                                      |
| `email`     | `VARCHAR(255)` | NO       | UNIQUE, NOT NULL   | Correo electrónico único. Se usa como `username` para login JWT            |
| `password`  | `VARCHAR(255)` | NO       | NOT NULL           | Contraseña encriptada con BCrypt via `PasswordEncoder`                     |
| `role`      | `VARCHAR(20)`  | NO       | NOT NULL           | Rol del usuario. Almacenado como String vía `@Enumerated(EnumType.STRING)` |
| `active`    | `BOOLEAN`      | NO       | DEFAULT TRUE       | Soft delete. Implementa `UserDetails.isEnabled()`                          |

**Relaciones:**

- `1 → N` con `events` (un usuario puede registrar muchos eventos)

**Roles:**
| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `ADMIN` | Administrador | Acceso completo: CRUD usuarios, cultivos, lotes, eventos y dashboard |
| `OPERATOR` | Operador | Gestión de cultivos, lotes y eventos |
| `VIEWER` | Visor | Solo visualización del dashboard y consultas |

**Reglas de Negocio:**

- **Email único:** Validado al crear usuario (`UserService.createUser`)
- **BCrypt:** Contraseña encriptada automáticamente al crear o actualizar
- **Spring Security:** Implementa `UserDetails` para integración directa con el AuthenticationManager
- **Authority:** Se genera `ROLE_ADMIN`, `ROLE_OPERATOR`, `ROLE_VIEWER` según el rol
- **Inactivo:** Usuario con `active=false` no puede autenticarse (`isEnabled()` retorna false)

---

### 2.3 Tabla: `event_types`

Catálogo global de tipos de eventos que pueden ocurrir en un lote.

| Campo      | Tipo           | Nullable | Restricciones      | Notas / Reglas de Negocio                                                           |
| ---------- | -------------- | -------- | ------------------ | ----------------------------------------------------------------------------------- |
| `id`       | `BIGINT`       | NO       | PK, AUTO_INCREMENT | Identificador único                                                                 |
| `name`     | `VARCHAR(255)` | NO       | UNIQUE, NOT NULL   | Nombre único del tipo de evento (ej: `RIEGO`, `SOWING`, `HARVEST`, `FERTILIZACION`) |
| `category` | `VARCHAR(100)` | NO       | NOT NULL           | Categoría del evento (ej: `PRODUCCION`, `MANTENIMIENTO`)                            |

**Relaciones:**

- `1 → N` con `events` (un tipo puede tener muchos eventos)
- `1 → N` con `crop_event_types` (un tipo puede estar asociado a muchos cultivos)

**Reglas de Negocio:**

- **Solo lectura:** `EventTypeService` es read-only. Los tipos se cargan inicialmente y no se modifican vía API
- **Filtro por cultivo:** Un evento solo puede registrarse si su `EventType` está asociado al cultivo del lote via `crop_event_types`

---

### 2.4 Tabla: `lots`

Lotes de cultivo dentro del invernadero. Representa una parcela o área de producción
con estado dinámico calculado en base a los eventos registrados.

| Campo                    | Tipo           | Nullable | Restricciones               | Notas / Reglas de Negocio                                                                    |
| ------------------------ | -------------- | -------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| `id`                     | `BIGINT`       | NO       | PK, AUTO_INCREMENT          | Identificador único                                                                          |
| `name`                   | `VARCHAR(255)` | NO       | NOT NULL                    | Nombre identificador del lote (ej: "Lote Norte A")                                           |
| `crop_id`                | `BIGINT`       | NO       | FK → crops(id), NOT NULL    | Cultivo asociado (obligatorio)                                                               |
| `start_date`             | `TIMESTAMP`    | NO       | NOT NULL                    | Fecha de inicio del lote (ISO 8601, UTC)                                                     |
| `end_date`               | `TIMESTAMP`    | SI       | -                           | Fecha de finalización. Se setea automáticamente al registrar evento HARVEST                  |
| `estimated_harvest_date` | `TIMESTAMP`    | SI       | -                           | Fecha estimada de cosecha. Se calcula al registrar SOWING: `timestamp + estimatedGrowthDays` |
| `status`                 | `VARCHAR(20)`  | NO       | NOT NULL, DEFAULT 'CREATED' | Estado persistido del lote. Enum: `CREATED`, `IN_PRODUCTION`, `FINISHED`                     |

**Relaciones:**

- `N → 1` con `crops` (un lote pertenece a un cultivo)
- `1 → N` con `events` (un lote puede tener muchos eventos)

**Estados de Lote:**
| Estado | Condición | Descripción |
|--------|-----------|-------------|
| `CREATED` | Sin eventos de SOWING | Lote recién creado, aún no sembrado |
| `IN_PRODUCTION` | Tiene SOWING pero no HARVEST | Lote en producción activa |
| `FINISHED` | Ya se registró evento HARVEST | Ciclo completado |

**Niveles de Inactividad (dinámicos, NO persistidos):**
| Nivel | Condición | Descripción |
|-------|-----------|-------------|
| `GRAY` | `eventos.size() == 0` | Sin eventos registrados (indeterminado) |
| `GREEN` | `daysWithoutEvents < threshold / 2` | Activo, eventos recientes |
| `YELLOW` | `threshold / 2 <= daysWithoutEvents < threshold` | Inactividad moderada, próximo al límite |
| `RED` | `daysWithoutEvents >= threshold` | Inactividad crítica, superó el umbral |
| `UNKNOWN` | `threshold == null` | El cultivo no tiene umbral de inactividad configurado |

_Cálculo: `daysWithoutEvents = Duration.between(ultimoEvento.timestamp, Instant.now()).toDays()`_

**Reglas de Negocio:**

- **Estado dinámico:** El status se actualiza automáticamente al registrar eventos (SOWING → IN_PRODUCTION, HARVEST → FINISHED)
- **Migración automática:** Al iniciar el sistema, los lotes con `status = NULL` se migran según sus eventos existentes (`@PostConstruct migrateExistingLotStatuses`)
- **Progreso:** `progress = (daysDesdeSowing / totalDays) * 100`, capado al 100%
- **Eventos por día:** `frequency = totalEvents / durationDays`
- **Duración:** Diferencia entre SOWING y HARVEST (o fecha actual si no hay HARVEST)

---

### 2.5 Tabla: `events`

Registro de todas las actividades/eventos que ocurren en un lote. Cada evento
tiene un tipo, un usuario responsable y una marca de tiempo.

| Campo         | Tipo        | Nullable | Restricciones                                   | Notas / Reglas de Negocio                                           |
| ------------- | ----------- | -------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| `id`          | `BIGINT`    | NO       | PK, AUTO_INCREMENT                              | Identificador único                                                 |
| `lot_id`      | `BIGINT`    | NO       | FK → lots(id), NOT NULL                         | Lote donde ocurrió el evento                                        |
| `type_id`     | `BIGINT`    | NO       | FK → event_types(id), NOT NULL                  | Tipo de evento registrado                                           |
| `user_id`     | `BIGINT`    | NO       | FK → users(id), NOT NULL                        | Usuario que registró el evento                                      |
| `timestamp`   | `TIMESTAMP` | NO       | NOT NULL                                        | Fecha/hora en que ocurrió el evento (ISO 8601, UTC)                 |
| `description` | `TEXT`      | SI       | -                                               | Descripción o notas adicionales (ej: "Riego automático completado") |
| `created_at`  | `TIMESTAMP` | NO       | DEFAULT NOW() (auto-generado vía `@PrePersist`) | Fecha de creación del registro en BD                                |

**Relaciones:**

- `N → 1` con `lots`
- `N → 1` con `event_types`
- `N → 1` con `users`

**Reglas de Negocio (secuencia estricta, `EventService.validateEventSequence`):**

| Regla                      | Validación                                                 | Mensaje de error                          |
| -------------------------- | ---------------------------------------------------------- | ----------------------------------------- |
| 1. SOWING antes de HARVEST | No se puede cosechar sin sembrar                           | `"Cannot register harvest before sowing"` |
| 2. Una sola siembra        | No puede haber dos SOWING en el mismo lote                 | `"Sowing already exists for this lot"`    |
| 3. Lote terminado          | No se pueden registrar eventos si el lote ya tiene HARVEST | `"This lot is already finished"`          |

**Efectos secundarios al registrar eventos:**

- **SOWING:** Setea `lot.status = IN_PRODUCTION`, calcula `estimatedHarvestDate = timestamp + estimatedGrowthDays`
- **HARVEST:** Setea `lot.status = FINISHED`, setea `lot.endDate = timestamp`, genera PDF automáticamente via `PdfReportService`
- **Todo evento:** Envía `{"type":"EVENT_CREATED"}` al canal SSE `"dashboard"`
- **Validación de compatibilidad:** El tipo de evento debe estar asociado al cultivo del lote (`crop_event_types`)

---

### 2.6 Tabla: `crop_event_types`

Tabla join explícita que resuelve la relación muchos-a-muchos entre `crops` y
`event_types`. Determina qué tipos de evento están disponibles para cada cultivo.

| Campo           | Tipo     | Nullable | Restricciones                  | Notas / Reglas de Negocio |
| --------------- | -------- | -------- | ------------------------------ | ------------------------- |
| `id`            | `BIGINT` | NO       | PK, AUTO_INCREMENT             | Identificador único       |
| `crop_id`       | `BIGINT` | NO       | FK → crops(id), NOT NULL       | Cultivo asociado          |
| `event_type_id` | `BIGINT` | NO       | FK → event_types(id), NOT NULL | Tipo de evento asociado   |

**Relaciones:**

- `N → 1` con `crops`
- `N → 1` con `event_types`

**Reglas de Negocio:**

- **Auto-poblado:** Al crear un cultivo, todos los `EventType` existentes se asocian automáticamente
- **Filtro de eventos:** Un evento solo puede registrarse si su tipo está asociado al cultivo del lote
- **Duplicados:** No se permite asociar el mismo tipo de evento dos veces al mismo cultivo

---

### 2.7 Tabla: `notifications`

Alertas y notificaciones generadas automáticamente por los schedulers del sistema.
NO tiene relaciones JPA formales (el campo `lot_id` es una referencia lógica).

| Campo        | Tipo           | Nullable | Restricciones      | Notas / Reglas de Negocio                                   |
| ------------ | -------------- | -------- | ------------------ | ----------------------------------------------------------- |
| `id`         | `BIGINT`       | NO       | PK, AUTO_INCREMENT | Identificador único                                         |
| `lot_id`     | `BIGINT`       | SI       | -                  | ID del lote asociado (referencia lógica, sin constraint FK) |
| `lot_name`   | `VARCHAR(255)` | SI       | -                  | Nombre del lote (denormalizado para display rápido)         |
| `type`       | `VARCHAR(30)`  | SI       | -                  | Tipo de notificación (ver enum `NotificationType`)          |
| `level`      | `VARCHAR(10)`  | SI       | -                  | Nivel de severidad (ver enum `NotificationLevel`)           |
| `message`    | `TEXT`         | SI       | -                  | Mensaje descriptivo de la alerta                            |
| `created_at` | `DATE`         | SI       | -                  | Fecha de creación                                           |
| `read`       | `BOOLEAN`      | SI       | DEFAULT FALSE      | Indica si la notificación fue leída                         |

**Reglas de Negocio (AlertService):**

- **Inactividad** (scheduler cada 6h): Evalúa `getInactivityStatus()` en todos los lotes
  - `RED` → `INACTIVITY_CRITICAL` / `CRITICAL`
  - `YELLOW` → `INACTIVITY_WARNING` / `WARNING`
- **Cosecha** (scheduler diario 06:00): Evalúa todos los lotes `IN_PRODUCTION`
  - T-7 días → `HARVEST_7_DAYS` / `INFO`
  - T-3 días → `HARVEST_3_DAYS` / `WARNING`
  - T-1 día → `HARVEST_1_DAY` / `CRITICAL`
  - Vencido → `HARVEST_OVERDUE` / `CRITICAL`
- **Deduplicación:** No se crea duplicado si ya existe una notificación del mismo tipo para el mismo lote
- **Auto-limpieza:** Al registrar HARVEST, todas las notificaciones no leídas del lote se marcan como `read = true`

---

## 3. Enumeraciones

### 3.1 `Role` (`users.role`)

| Valor      | Descripción                                                 |
| ---------- | ----------------------------------------------------------- |
| `ADMIN`    | Acceso completo a todos los endpoints y gestión de usuarios |
| `OPERATOR` | Gestión de cultivos, lotes, eventos. Sin acceso a usuarios  |
| `VIEWER`   | Solo lectura: dashboard, consultas, reportes                |

### 3.2 `LotStatus` (`lots.status`)

| Valor           | Descripción                           |
| --------------- | ------------------------------------- |
| `CREATED`       | Lote creado, sin eventos de SOWING    |
| `IN_PRODUCTION` | Tiene SOWING pero no HARVEST          |
| `FINISHED`      | Ciclo completado (HARVEST registrado) |

### 3.3 `NotificationType` (`notifications.type`)

| Valor                 | Severidad  | Disparador                               |
| --------------------- | ---------- | ---------------------------------------- |
| `INACTIVITY_WARNING`  | `WARNING`  | Inactividad nivel YELLOW                 |
| `INACTIVITY_CRITICAL` | `CRITICAL` | Inactividad nivel RED                    |
| `HARVEST_7_DAYS`      | `INFO`     | Faltan 7 días para cosecha estimada      |
| `HARVEST_3_DAYS`      | `WARNING`  | Faltan 3 días para cosecha estimada      |
| `HARVEST_1_DAY`       | `CRITICAL` | Falta 1 día para cosecha estimada        |
| `HARVEST_OVERDUE`     | `CRITICAL` | Cosecha vencida (fecha estimada ya pasó) |

### 3.4 `NotificationLevel` (`notifications.level`)

| Valor      | Significado                       |
| ---------- | --------------------------------- |
| `INFO`     | Informativo, sin acción requerida |
| `WARNING`  | Requiere atención próxima         |
| `CRITICAL` | Requiere acción inmediata         |

### 3.5 `InactivityLevel` (dinámico, NO persistido)

Nivel de inactividad calculado en tiempo real por `LotService.getInactivityStatus()`.

| Nivel     | Condición                                           |
| --------- | --------------------------------------------------- |
| `GRAY`    | No hay eventos registrados en el lote               |
| `GREEN`   | Días sin eventos < threshold/2                      |
| `YELLOW`  | threshold/2 <= días sin eventos < threshold         |
| `RED`     | Días sin eventos >= threshold                       |
| `UNKNOWN` | El crop no tiene `inactivityDaysThreshold` definido |

---

## 4. DTOs de API

### 4.1 Request DTOs

#### `CropRequest`

| Campo                          | Tipo      | Requerido   | Descripción                                             |
| ------------------------------ | --------- | ----------- | ------------------------------------------------------- |
| `name`                         | `String`  | `@NotBlank` | Nombre único del cultivo                                |
| `description`                  | `String`  | No          | Descripción detallada                                   |
| `inactivityDaysThreshold`      | `Integer` | `@NotNull`  | Días máximos de inactividad antes de alertar            |
| `estimatedGrowthDays`          | `Integer` | `@NotNull`  | Días estimados hasta cosecha                            |
| `irrigationFrequencyHours`     | `Integer` | No          | Frecuencia de riego automático en horas (0 = sin riego) |
| `recommendedFertilizationDays` | `Integer` | No          | Días recomendados entre fertilizaciones                 |
| `recommendedPestControlDays`   | `Integer` | No          | Días recomendados entre controles de plagas             |

#### `UserRequest`

| Campo      | Tipo     | Requerido             | Descripción                         |
| ---------- | -------- | --------------------- | ----------------------------------- |
| `name`     | `String` | `@NotBlank`           | Nombre del usuario                  |
| `lastName` | `String` | `@NotBlank`           | Apellido del usuario                |
| `email`    | `String` | `@NotBlank`, `@Email` | Correo electrónico único            |
| `password` | `String` | `@NotBlank`           | Contraseña (se encripta con BCrypt) |
| `role`     | `String` | `@NotBlank`           | Rol: `ADMIN`, `OPERATOR`, `VIEWER`  |

#### `EventRequest`

| Campo         | Tipo      | Requerido  | Descripción                                       |
| ------------- | --------- | ---------- | ------------------------------------------------- |
| `lotId`       | `Long`    | `@NotNull` | ID del lote                                       |
| `type`        | `String`  | `@NotNull` | Tipo de evento (ej: `SOWING`, `HARVEST`, `RIEGO`) |
| `userId`      | `Long`    | `@NotNull` | ID del usuario que registra                       |
| `timestamp`   | `Instant` | `@NotNull` | Fecha/hora del evento (ISO 8601)                  |
| `description` | `String`  | `@NotNull` | Descripción o notas                               |

#### `LotRequest`

| Campo       | Tipo      | Requerido   | Descripción              |
| ----------- | --------- | ----------- | ------------------------ |
| `name`      | `String`  | `@NotBlank` | Nombre del lote          |
| `cropId`    | `Long`    | `@NotNull`  | ID del cultivo asociado  |
| `startDate` | `Instant` | `@NotNull`  | Fecha de inicio del lote |
| `endDate`   | `Instant` | No          | Fecha de fin (opcional)  |

---

### 4.2 Response DTOs

#### `CropResponse`

| Campo                          | Tipo      | Descripción                    |
| ------------------------------ | --------- | ------------------------------ |
| `id`                           | `Long`    | ID del cultivo                 |
| `name`                         | `String`  | Nombre del cultivo             |
| `description`                  | `String`  | Descripción                    |
| `inactivityDaysThreshold`      | `Long`    | Umbral de inactividad          |
| `estimatedGrowthDays`          | `Long`    | Días estimados hasta cosecha   |
| `irrigationFrequencyHours`     | `Integer` | Frecuencia de riego automático |
| `recommendedFertilizationDays` | `Integer` | Días entre fertilizaciones     |
| `recommendedPestControlDays`   | `Integer` | Días entre controles de plagas |

#### `UserResponse`

| Campo      | Tipo      | Descripción                 |
| ---------- | --------- | --------------------------- |
| `id`       | `Long`    | ID del usuario              |
| `name`     | `String`  | Nombre                      |
| `lastName` | `String`  | Apellido                    |
| `email`    | `String`  | Correo electrónico          |
| `role`     | `String`  | Rol (ADMIN/OPERATOR/VIEWER) |
| `active`   | `boolean` | Estado de activación        |

#### `EventResponse`

| Campo         | Tipo      | Descripción                    |
| ------------- | --------- | ------------------------------ |
| `id`          | `Long`    | ID del evento                  |
| `lotId`       | `Long`    | ID del lote asociado           |
| `lotName`     | `String`  | Nombre del lote                |
| `type`        | `String`  | Tipo de evento                 |
| `category`    | `String`  | Categoría del evento           |
| `userId`      | `Long`    | ID del usuario que registró    |
| `userName`    | `String`  | Nombre del usuario             |
| `timestamp`   | `Instant` | Fecha/hora del evento          |
| `description` | `String`  | Descripción                    |
| `createdAt`   | `Instant` | Fecha de creación del registro |

#### `LotResponse`

| Campo       | Tipo      | Descripción                              |
| ----------- | --------- | ---------------------------------------- |
| `id`        | `Long`    | ID del lote                              |
| `name`      | `String`  | Nombre del lote                          |
| `cropId`    | `Long`    | ID del cultivo asociado                  |
| `cropName`  | `String`  | Nombre del cultivo                       |
| `startDate` | `Instant` | Fecha de inicio                          |
| `endDate`   | `Instant` | Fecha de fin                             |
| `status`    | `String`  | Estado: CREATED, IN_PRODUCTION, FINISHED |

---

### 4.3 Dashboard DTOs

#### `DashboardResponse`

DTO compuesto devuelto por `GET /api/dashboard`.

| Campo              | Tipo                       | Descripción                           |
| ------------------ | -------------------------- | ------------------------------------- |
| `eventChart`       | `EventChartDTO`            | Histograma de eventos últimos 30 días |
| `lotStatuses`      | `List<LotStatusDTO>`       | Estado e inactividad de cada lote     |
| `lotProgress`      | `List<LotProgressDTO>`     | Progreso de cada lote                 |
| `upcomingHarvests` | `List<UpcomingHarvestDTO>` | Top 10 próximas cosechas              |

#### `EventChartDTO`

| Campo    | Tipo           | Descripción                         |
| -------- | -------------- | ----------------------------------- |
| `labels` | `List<String>` | 30 fechas (yyyy-MM-dd), zero-filled |
| `values` | `List<Long>`   | Conteo de eventos por día           |

#### `LotStatusDTO`

| Campo             | Tipo     | Descripción                              |
| ----------------- | -------- | ---------------------------------------- |
| `lotId`           | `Long`   | ID del lote                              |
| `lotName`         | `String` | Nombre del lote                          |
| `status`          | `String` | Estado: CREATED, IN_PRODUCTION, FINISHED |
| `inactivityLevel` | `String` | Nivel: GREEN, YELLOW, RED, GRAY, UNKNOWN |

#### `LotProgressDTO`

| Campo                  | Tipo     | Descripción                        |
| ---------------------- | -------- | ---------------------------------- |
| `lotId`                | `Long`   | ID del lote                        |
| `lotName`              | `String` | Nombre del lote                    |
| `progress`             | `double` | Porcentaje de avance (0.0 – 100.0) |
| `estimatedHarvestDate` | `String` | Fecha estimada de cosecha          |
| `sowingDate`           | `String` | Fecha de siembra                   |
| `totalDays`            | `int`    | Total de días del ciclo            |
| `daysElapsed`          | `int`    | Días transcurridos desde siembra   |
| `daysRemaining`        | `int`    | Días restantes para cosecha        |

#### `UpcomingHarvestDTO`

| Campo                  | Tipo     | Descripción                          |
| ---------------------- | -------- | ------------------------------------ |
| `lotId`                | `Long`   | ID del lote                          |
| `lotName`              | `String` | Nombre del lote                      |
| `estimatedHarvestDate` | `String` | Fecha estimada de cosecha            |
| `daysRemaining`        | `long`   | Días restantes (negativo si vencido) |

#### `LotSummary`

DTO agregado con todas las métricas de un lote.

| Campo                  | Tipo      | Descripción                  |
| ---------------------- | --------- | ---------------------------- |
| `lotId`                | `Long`    | ID del lote                  |
| `lotName`              | `String`  | Nombre del lote              |
| `status`               | `String`  | Estado del lote              |
| `inactivityStatus`     | `String`  | Nivel de inactividad         |
| `totalEvents`          | `Long`    | Total de eventos registrados |
| `durationDays`         | `Long`    | Duración en días             |
| `eventFrequency`       | `Double`  | Frecuencia (eventos/día)     |
| `sowingDate`           | `String`  | Fecha de siembra             |
| `totalDays`            | `int`     | Total de días del ciclo      |
| `daysElapsed`          | `int`     | Días transcurridos           |
| `daysRemaining`        | `int`     | Días restantes               |
| `estimatedHarvestDate` | `String`  | Fecha estimada de cosecha    |
| `lastEventDate`        | `Instant` | Fecha del último evento      |
| `lastEventType`        | `String`  | Tipo del último evento       |

---

## 5. Reglas de Negocio

### 5.1 Gestión de Cultivos (`CropService`)

| #   | Regla                                                                                             | Implementación                                          |
| --- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | Nombre único: no pueden existir dos cultivos con el mismo nombre                                  | `cropRepository.findByName()` valida en create y update |
| 2   | Auto-asociación de EventTypes: al crear, se vinculan todos los tipos existentes automáticamente   | `CropService.createCrop` línea 57-64                    |
| 3   | Filtro de eventos por cultivo: solo eventos cuyo tipo esté asociado al cultivo pueden registrarse | `EventService.registerEvent` línea 67-72                |
| 4   | CRUD completo: crear, leer, actualizar, eliminar                                                  | Controller REST estándar                                |
| 5   | Actualización parcial: solo campos no-null se aplican                                             | `CropService.updateCrop`                                |

### 5.2 Gestión de Lotes (`LotService`)

| #   | Regla                                                                                                                | Implementación                              |
| --- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | **Estado dinámico** (persistido pero reactivo): se actualiza al registrar SOWING → IN_PRODUCTION, HARVEST → FINISHED | `EventService.registerEvent`                |
| 2   | **Inactividad** calculada en tiempo real: GRAY/GREEN/YELLOW/RED/UNKNOWN según días sin eventos vs threshold          | `LotService.getInactivityStatus()`          |
| 3   | **Progreso:** `(daysDesdeSowing / totalDays) * 100`, capado a 100%                                                   | `LotService.getCropProgress()`              |
| 4   | **Frecuencia de eventos:** `totalEvents / duraciónEnDías`                                                            | `LotService.calculateEventFrequency()`      |
| 5   | **Duración:** diferencia entre SOWING y HARVEST (o fecha actual si no hay HARVEST)                                   | `LotService.calculateDurationInDays()`      |
| 6   | **Migración automática:** lotes legacy con status=NULL se migran al iniciar el sistema                               | `@PostConstruct migrateExistingLotStatuses` |

### 5.3 Gestión de Eventos (`EventService`)

| #   | Regla                                                                     | Validación                                               |
| --- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | No HARVEST sin SOWING                                                     | `!hasSowing && eventType == HARVEST`                     |
| 2   | Un solo SOWING por lote                                                   | `hasSowing && eventType == SOWING`                       |
| 3   | No eventos si lote FINISHED                                               | `hasHarvest`                                             |
| 4   | Compatibilidad: el tipo de evento debe estar asociado al cultivo del lote | `cropEventTypeRepository.existsByCropIdAndEventTypeId()` |
| 5   | Al registrar SOWING: se calcula `estimatedHarvestDate`                    | `timestamp + estimatedGrowthDays`                        |
| 6   | Al registrar HARVEST: se genera PDF automáticamente                       | `pdfReportService.generateLotReport()`                   |

### 5.4 Dashboard (`DashboardService`)

| #   | Regla                                                                                 | Detalle                                |
| --- | ------------------------------------------------------------------------------------- | -------------------------------------- |
| 1   | **Gráfico de eventos:** histograma de 30 días con zero-fill para días sin eventos     | `buildEventChart()`                    |
| 2   | **Estados de lotes:** lista completa con status e inactividad                         | `buildLotStatuses()`                   |
| 3   | **Progreso de lotes:** porcentaje, días transcurridos/restantes                       | `buildLotProgress()`                   |
| 4   | **Próximas cosechas:** top 10, ordenadas por fecha, incluye vencidos (días negativos) | `buildUpcomingHarvests()`              |
| 5   | **Filtro opcional:** todas las métricas pueden filtrarse por `cropId`                 | parámetro opcional en `getDashboard()` |

### 5.5 Alertas Programadas (`AlertService`)

| #   | Regla                                                                          | Detalle                                         |
| --- | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| 1   | **Inactividad:** scheduler cada 6 horas (`0 0 */6 * * *`)                      | Evalúa todos los lotes                          |
| 2   | **Cosecha:** scheduler diario a las 06:00 (`0 0 6 * * *`)                      | Evalúa lotes IN_PRODUCTION con fecha estimada   |
| 3   | **Deduplicación:** no se crea duplicado del mismo tipo para el mismo lote      | `notificationRepository.existsByLotIdAndType()` |
| 4   | **Auto-limpieza:** al cosechar, notificaciones no leídas se marcan como leídas | `AlertService`, línea 110-119                   |

### 5.6 Riego Automático (`IrrigationService`)

| #   | Regla                                                                       | Detalle                                               |
| --- | --------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | **Frecuencia:** scheduler cada hora (`0 0 */1 * * *`)                       | `@Scheduled(cron = "0 0 */1 * * *")`                  |
| 2   | **Ámbito:** solo lotes en estado `IN_PRODUCTION`                            | `lotRepository.findByStatus(LotStatus.IN_PRODUCTION)` |
| 3   | **Frecuencia por cultivo:** cada cultivo define `irrigationFrequencyHours`  | Si NULL o ≤ 0, se omite                               |
| 4   | **Primer riego:** si nunca se ha regado, se riega inmediatamente            | `hoursSince = Long.MAX_VALUE`                         |
| 5   | **Usuario de sistema:** se configura vía `app.irrigation.system-user-email` | Fallback al primer usuario en BD                      |
| 6   | **Tipo RIEGO:** debe existir en `event_types`, si no, se aborta             | Validación al inicio del scheduler                    |

### 5.7 SSE / Tiempo Real (`SseService`)

| #   | Regla                                                                            | Detalle                                                   |
| --- | -------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | **Conexión:** el frontend se suscribe vía `GET /api/sse/subscribe?token=<jwt>`   | `SseController`                                           |
| 2   | **Timeout:** 30 minutos por conexión                                             | `SseEmitter(1_800_000L)`                                  |
| 3   | **Eventos push:** `CROP_UPDATED` (CRUD cultivos), `EVENT_CREATED` (nuevo evento) | `SseService.sendEvent()`                                  |
| 4   | **Limpieza:** emitters caídos se remueven automáticamente                        | `CopyOnWriteArrayList` + `onCompletion/onTimeout/onError` |

---

## 6. Métricas y Cálculos

| Métrica                   | Fórmula                                                            | Servicio                               |
| ------------------------- | ------------------------------------------------------------------ | -------------------------------------- |
| Progreso del cultivo      | `(daysDesdeSowing / totalDays) * 100`, cap 100%                    | `LotService.getCropProgress()`         |
| Días sin eventos          | `Duration.between(ultimoEvento.timestamp, Instant.now()).toDays()` | `LotService.getInactivityStatus()`     |
| Frecuencia de eventos     | `totalEvents / durationDays`                                       | `LotService.calculateEventFrequency()` |
| Duración del lote         | `endDate - startDate` o `now - startDate`                          | `LotService.calculateDurationInDays()` |
| Fecha estimada de cosecha | `sowingTimestamp + estimatedGrowthDays`                            | `EventService.registerEvent()`         |
| Días restantes cosecha    | `estimatedHarvestDate - today`                                     | `LotService.getLotProgressDetails()`   |
| Horas desde último riego  | `Duration.between(lastIrrigation, Instant.now()).toHours()`        | `IrrigationService.autoIrrigate()`     |

---

## 7. Notas Técnicas

1. **Soft Delete:** Campo `active` en `users` permite desactivar sin eliminar registro
2. **Cascada:** Relaciones JPA con `CascadeType.PERSIST` y `CascadeType.MERGE` (sin REMOVE automático)
3. **Timestamps:** Todos los campos de fecha usan `Instant` (UTC) con conversión en presentación a `America/Bogota`
4. **Auditoría:** Campo `createdAt` en `events` se autogenera con `@PrePersist`
5. **Índices:** Las FK en PostgreSQL crean índices automáticamente (comportamiento default de Hibernate)
6. **Autenticación:** JWT (jjwt 0.12.6) con HS256, secret en variable de entorno `JWT_SECRET` (mín. 64 chars)
7. **Zona horaria:** Base de datos en UTC, Jackson configurado con `America/Bogota`
8. **i18n:** Mensajes de error en `messages.properties` (en) y `messages_es.properties` (es)
9. **SSE:** Token JWT se pasa como query param `?token=<jwt>` en la conexión SSE

---

## 8. Tecnologías del Proyecto

| Tecnología        | Versión      | Propósito                                  |
| ----------------- | ------------ | ------------------------------------------ |
| Spring Boot       | 3.5.8        | Framework backend REST                     |
| Java              | 21 (Preview) | Lenguaje de programación                   |
| PostgreSQL        | -            | Base de datos en producción                |
| H2                | -            | Base de datos en tests (perfil `test`)     |
| Hibernate / JPA   | 6.6.36       | ORM y persistencia                         |
| Spring Security   | 6.x          | Autenticación y autorización               |
| JWT (jjwt)        | 0.12.6       | Tokens de autenticación                    |
| SpringDoc OpenAPI | -            | Documentación Swagger (`/swagger-ui.html`) |
| MapStruct         | -            | Mapeo Entity ↔ DTO                         |
| iTextPDF          | 5.5.13.3     | Generación de reportes PDF                 |
| Apache POI        | 5.4.0        | Exportación a Excel                        |
| Angular           | 21           | Frontend SPA                               |
| Angular Material  | 21           | Componentes UI                             |
| Chart.js          | 4.5.1        | Gráficos del dashboard                     |
| Vitest            | 4.1.5        | Tests unitarios frontend                   |
| Playwright        | 1.59         | Tests E2E                                  |
| Maven             | -            | Build backend                              |

---

## 9. Paquetes del Proyecto

### Backend (`com.invernadero.proyecto`)

| Paquete        | Descripción                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| `Entity`       | Entidades JPA (Crop, Lot, Event, EventType, CropEventType, Notification, User) + enums |
| `Service`      | Lógica de negocio (servicios REST + schedulers)                                        |
| `Repository`   | Repositorios JPA                                                                       |
| `Controller`   | Controladores REST                                                                     |
| `Dto.Request`  | Data Transfer Objects de entrada (CropRequest, UserRequest, EventRequest, LotRequest)  |
| `Dto.response` | Data Transfer Objects de salida (por entidad + dashboard)                              |
| `Security`     | Configuración de seguridad, JWT filter, JwtService                                     |
| `mapper`       | MapStruct mappers Entity ↔ DTO                                                         |
| `Exception`    | GlobalExceptionHandler + excepciones personalizadas                                    |
| `Config`       | Configuraciones CORS, OpenAPI, Locale                                                  |

### Frontend (`src/app`)

| Carpeta             | Descripción                                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `core/services`     | Servicios Angular (auth, crop, lot, event, dashboard, notification, SSE, i18n, error handling)                                    |
| `core/guards`       | Guards de ruta (auth, role)                                                                                                       |
| `core/interceptors` | HTTP interceptors (auth JWT, error)                                                                                               |
| `core/models`       | Interfaces TypeScript (dashboard, notification)                                                                                   |
| `features`          | Componentes de página (auth/login, dashboard, crops, lots, events)                                                                |
| `shared/components` | Sigma UI kit (badge, btn, card, empty-state, input, progress, spinner, table, toggle, crop-event-types-dialog, notification-bell) |
| `shared/layout`     | Layout principal (toolbar + sidebar)                                                                                              |
| `models`            | Interfaces de dominio (crop, lot, event)                                                                                          |
