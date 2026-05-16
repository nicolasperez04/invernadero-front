# Automatización Taiga - Greenhouse Management

Sistema automatizado para crear y gestionar User Stories, Tasks, Sprints y Epics en Taiga basándose en los requisitos IEEE 830 del proyecto Invernadero.

> **Versión de Documentación**: 2.0
> **Última Actualización**: Mayo 2026
> **Proyecto**: Invernadero - Greenhouse Management System

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración](#configuración)
5. [Uso del CLI](#uso-del-cli)
6. [Crear Nuevos Módulos](#crear-nuevos-módulos)
7. [Scripts de Gestión](#scripts-de-gestión)
8. [Gestión de Sprints](#gestión-de-sprints)
9. [Gestión de Epics](#gestión-de-epics)
10. [Estado Actual del Backlog](#estado-actual-del-backlog)
11. [Comandos npm Disponibles](#comandos-npm-disponibles)
12. [Buenas Prácticas](#buenas-prácticas)
13. [Solución de Problemas](#solución-de-problemas)
14. [Agregar Nuevo Script](#agregar-nuevo-script)
15. [Referencias](#referencias)

---

## Introducción

Este sistema de automatización fue desarrollado para facilitar la gestión del proyecto Invernadero en Taiga. Permite:

- **Crear User Stories automáticamente** desde templates predefinidos basados en IEEE 830
- **Generar Tasks** asociadas a cada User Story
- **Asignar Story Points** automáticamente
- **Gestionar Sprints** (crear, asignar US, activar)
- **Crear Epics** para agrupar User Stories
- **Asignar recursos** (US y Tasks a usuarios)
- **Sincronizar estados** del proyecto

### Características Principales

| Característica | Descripción |
|----------------|-------------|
| Detección de Duplicados | Evita crear US o Tasks que ya existen |
| Asignación Automática | Asigna US y Tasks al usuario actual |
| Múltiples Módulos | Soporta creación por lotes de módulos |
| Estados Automáticos | Configura estados "In Progress" automáticamente |
| Story Points | Asigna puntos usando roles del proyecto |

---

## Requisitos Previos

### 1. Credenciales en `.env`

Crear o actualizar el archivo `.env` en la raíz del proyecto:

```env
# Taiga API
TAIGA_URL=https://api.taiga.io/api/v1
TAIGA_USERNAME=tu_usuario
TAIGA_PASSWORD=tu_password
TAIGA_PROJECT_ID=1790796
```

#### Variables de Entorno Obligatorias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `TAIGA_URL` | URL base de la API de Taiga | `https://api.taiga.io/api/v1` |
| `TAIGA_USERNAME` | Nombre de usuario de Taiga | `nicolasperez04` |
| `TAIGA_PASSWORD` | Contraseña del usuario | `********` |
| `TAIGA_PROJECT_ID` | ID numérico del proyecto | `1790796` |

### 2. Dependencias

Las dependencias ya están incluidas en el proyecto:

```json
"dependencies": {
  "axios": "^1.6.0",
  "dotenv": "^16.3.0"
}
```

Si necesitas instalarlas manualmente:
```bash
npm install axios dotenv
```

### 3. Project ID

El proyecto configurado actualmente es:
- **Nombre**: Invernadero
- **Project ID**: `1790796`
- **URL Taiga**: `https://tree.taiga.io/nicolasperez04/invernadero`
- **URL API**: `https://api.taiga.io/api/v1`

---

## Estructura del Proyecto

### Directorio de Automatización

```
tools/taiga/
├── taiga.js                    # Cliente API principal - todas las funciones de Taiga
├── templates.js                # Definiciones de módulos, User Stories y Tasks
├── main.js                     # CLI principal para crear módulos
├── assign-points.js            # Asignar Story Points a User Stories
├── assign-all-to-me.js         # Asignar todas las US y Tasks al usuario actual
├── cleanup-dups.js            # Eliminar User Stories duplicadas
├── cleanup.js                 # Script de limpieza general
├── plan-sprints.js            # Mostrar planificación sugerida de sprints
├── sprints.js                 # Crear sprints y asignar User Stories
├── assign-sprints.js          # Asignar User Stories a sprints existentes
├── activate-sprints.js        # Activar sprints (cambiar estado US)
├── fix-sprints.js             # Corregir asignación de US a sprints
├── close-sprints.js           # Cerrar sprints completados, mantener activo
├── create-epics.js            # Crear Epics en Taiga
├── link-epics.js              # Vincular US a Epics (intento 1)
├── link-epics2.js             # Vincular US a Epics (intento 2 - exitoso)
├── update-status.js          # Actualizar estado de una US específica
├── update-tasks-status.js    # Actualizar estado de tasks masivamente
├── create-wiki.js            # Crear páginas de Wiki
├── create-issues.js          # Crear issues para tracking técnico
├── debug-points.js           # Script de debug para story points
├── debug-points2.js          # Script de debug para story points v2
├── debug-roles.js            # Script de debug para roles del proyecto
├── debug-tasks.js            # Script de debug para tasks
└── debug-issues.js          # Script de debug para issues
```

### taiga.js - Cliente API

Este es el archivo principal que contiene todas las funciones para interactuar con la API de Taiga. Proporciona una interfaz unificada para todas las operaciones.

#### Funciones Exportadas

```javascript
module.exports = { 
  // Autenticación
  login,                      // Autenticar en Taiga y obtener token
  
  // User Stories
  createUserStory,            // Crear User Story con título y descripción
  getUserStories,             // Obtener todas las US del proyecto
  updateUserStoryStatus,      // Actualizar estado de una US
  updateUserStoryPoints,      // Asignar story points a una US
  assignUserStoryToMe,        // Asignar US al usuario actual
  deleteUserStory,           // Eliminar una US
  
  // Tasks
  createTask,                 // Crear task dentro de una US
  getTasks,                   // Obtener tasks de una US específica
  assignTaskToMe,             // Asignar task al usuario actual
  
  // Sprints/Milestones
  createSprint,              // Crear un nuevo sprint (milestone)
  addUserStoryToSprint,      // Asignar US a un sprint
  
  // Utilidades
  getProjectId,              // Obtener ID del proyecto configurado
  getUserStoryStatuses,      // Obtener lista de estados disponibles
  getApiInternal             // Obtener instancia interna del API (para scripts avanzados)
};
```

#### Ejemplo de Uso Básico

```javascript
const taiga = require('./taiga.js');

async function main() {
  // Autenticarse
  await taiga.login();
  
  // Obtener User Stories
  const stories = await taiga.getUserStories();
  console.log(`Total US: ${stories.length}`);
  
  // Crear una US
  const usId = await taiga.createUserStory('Nueva US', 'Descripción...');
  
  // Crear tasks
  await taiga.createTask(usId, 'Primera tarea');
  await taiga.createTask(usId, 'Segunda tarea');
}

main();
```

### templates.js - Definiciones de Módulos

Contiene las definiciones de todos los módulos del proyecto. Cada módulo representa una funcionalidad del sistema y contiene una User Story con sus tareas asociadas.

```javascript
const templates = {
  auth: { ... },       // Sistema de autenticación JWT
  users: { ... },     // Gestión de usuarios
  crops: { ... },     // Catálogo de cultivos
  lots: { ... },      // Gestión de lotes
  events: { ... },    // Registro de eventos agrícolas
  eventTypes: { ... },// Catálogo de tipos de eventos
  dashboard: { ... } // Dashboard con métricas
};
```

#### Estructura de un Template

```javascript
miModulo: {
  userStory: 'NOM - Título de la User Story',
  description: 'Descripción detallada que explica qué hace el módulo. ' +
    'Incluye referencias a los requisitos funcionales (ej: NOM-RF-01).',
  priority: 'Alta',  // Alta, Media o Baja
  tasks: [
    'Tarea 1: Descripción de la primera tarea',
    'Tarea 2: Descripción de la segunda tarea',
    'Tarea 3: Descripción de la tercera tarea',
  ],
},
```

---

## Configuración

### Configuración del Proyecto en Taiga

El proyecto debe tener configurado en Taiga (vía UI o admin):

1. **Estados de Tasks**: Al menos un estado "In Progress" o similar
   - IDs típicos: 10865120 (New), 10865121 (Ready), 10865122 (In progress), etc.

2. **Estados de US**: Al menos un estado "In Progress" o similar
   - IDs típicos: 10865120 (New), 10865121 (Ready), 10865122 (In progress), etc.

3. **Roles**: Roles computables para story points
   - Roles típicos: UX, Design, Front, Back, Product Owner, Stakeholder

4. **Story Points**: Valores configurados
   - Valores típicos: 0, 1/2, 1, 2, 3, 5, 8, 10, 13, 20, 40

### Configuración de Permisos

Asegúrate de tener los permisos necesarios en Taiga:
- Permiso de admin o member para crear/editar US y Tasks
- Permiso para gestionar sprints
- Permiso para gestionar epics

---

## Uso del CLI

### Comando Principal

```bash
npm run taiga "<módulo>"
```

### Módulos Disponibles

| Módulo | Alias | Descripción |
|--------|-------|-------------|
| auth | autenticación | Sistema de autenticación JWT con Spring Security |
| users | usuarios, usuario | Gestión completa de usuarios con roles |
| crops | cultivos, cultivo | Catálogo de cultivos con parámetros de crecimiento |
| lots | lotes, lote | Gestión de lotes con estados dinámicos |
| events | eventos, evento | Registro y seguimiento de eventos agrícolas |
| eventTypes | tipos de evento, tipos-evento, event-types | Catálogo de tipos de eventos |
| dashboard | métricas, metricas | Dashboard con métricas en tiempo real |

### Ejemplos de Uso

#### Crear un solo módulo:

```bash
npm run taiga "auth"
npm run taiga "cultivos"
npm run taiga "dashboard"
```

#### Crear múltiples módulos:

```bash
npm run taiga "auth,usuarios"
npm run taiga "auth,cultivos,lotes"
npm run taiga "dashboard,eventos"
```

#### Verbose mode (más detalles):

```bash
npm run taiga "dashboard --verbose"
npm run taiga "auth,usuarios" -- --verbose
```

El modo verbose muestra:
- Detalles de cada US creada
- IDs de las US y Tasks
- Descripción de cada módulo
- Conteo total de tareas creadas

#### Mostrar ayuda:

```bash
npm run taiga -- --help
npm run taiga -h
```

### Salida del Comando (Ejemplo)

```
🔐 Autenticando en Taiga...
✅ Autenticado

📝 Creando User Story: AUTH - Implementar autenticación JWT y control de acceso por roles
📋 Creando tasks:
   ✓ Crear endpoint POST /auth/login que valide credenciales contra BCrypt (ID: 123456)
   ✓ Generar JWT con JwtService (incluir exp, roles, userId) (ID: 123457)
   ✓ Configurar JwtAuthenticationFilter para validar token en cada request (ID: 123458)
   ...

🎉 Backlog creado exitosamente!
   Proyecto ID: 1790796
   auth: 14 tasks (US #9247053)

   Total: 1 módulos, 14 tareas
```

---

## Crear Nuevos Módulos

### Paso 1: Editar templates.js

Agregar un nuevo módulo al objeto `templates`. Se recomienda seguir la estructura existente:

```javascript
const templates = {
  // ... módulos existentes ...

  miModulo: {
    userStory: 'NOM - Mi Nuevo Módulo',
    description: 'Descripción detallada del módulo y sus funcionalidades. ' +
      'Incluye referencias a los requisitos funcionales (ej: NOM-RF-01, NOM-RF-02).',
    priority: 'Alta',  // Alta, Media o Baja
    tasks: [
      'Tarea 1: Descripción de la primera tarea',
      'Tarea 2: Descripción de la segunda tarea',
      'Tarea 3: Descripción de la tercera tarea',
    ],
  },
};
```

### Paso 2: Agregar alias (opcional)

En el objeto `moduleMap`, agregar sinonimos para facilitar el uso:

```javascript
const moduleMap = {
  // ... mappings existentes ...
  
  // Nuevos alias para tu módulo
  'mi_modulo': 'miModulo',
  'mi_modulo': 'miModulo',
  'nuevo': 'miModulo',
  'nueva_funcionalidad': 'miModulo',
};
```

### Paso 3: Ejecutar

```bash
npm run taiga "mi_modulo"
```

### Estructura Completa de un Template

```javascript
miModulo: {
  userStory: 'NOM - Título de la User Story',
  description: 'Descripción completa que explica qué hace el módulo. ' +
    'Incluye referencias a los requisitos funcionales (ej: NOM-RF-01). ' +
    'Explica los objetivos y alcance del módulo.',
  priority: 'Alta',
  tasks: [
    // Tasks específicas para el módulo - sigue el orden logical
    'Crear endpoint POST /recurso (crear nuevo recurso)',
    'Validar campos obligatorios y tipos de datos',
    'Crear endpoint GET /recurso (listar todos los recursos)',
    'Crear endpoint GET /recurso/{id} (obtener por ID)',
    'Crear endpoint PUT /recurso/{id} (actualizar parcialmente)',
    'Crear endpoint DELETE /recurso/{id} (eliminar recurso)',
    'Escribir tests unitarios para todos los endpoints',
    'Documentar API con Swagger/OpenAPI',
  ],
},
```

### Mejores Prácticas para Nuevos Módulos

1. **Nomenclatura**: Usar prefijos como el código del módulo (ej: AUTH, USR, CRP, LOT, EVT, DSH)

2. **Tasks atomic**: Cada task debe ser una unidad de trabajo independiente que pueda completarse en pocas horas

3. **Orden lógico**: Las tasks deben seguir un orden lógico de implementación:
   - Primero: Endpoints CRUD básicos
   - Segundo: Validaciones y reglas de negocio
   - Tercero: Tests y documentación

4. **Story Points**: Al crear un nuevo módulo, agregar su estimación en `assign-points.js` para mantener el seguimiento

5. **Descripción detallada**: Incluir referencias a los requisitos funcionales del IEEE 830 (ej: AUTH-RF-01, USR-RF-02)

---

## Scripts de Gestión

### 0. Cerrar Sprints

**Archivo**: `close-sprints.js`

Cierra los sprints completados y deja el sprint activo. En el proyecto actual:
- Cierra Sprint 1, 2 y 3 (estado: Closed)
- Mantiene Sprint 4 activo (estado: In Progress)

```bash
node tools/taiga/close-sprints.js
```

**Salida**:
```
Cerrando Sprints 1, 2 y 3...
   Sprint 1 - Seguridad cerrado
   Sprint 2 - Cultivos y Lotes cerrado
   Sprint 3 - Eventos cerrado
Sprint 4 - Dashboard permanece activo
```

### 1. Asignar Story Points

**Archivo**: `assign-points.js`

Asigna puntos de historia a cada User Story según su complejidad. Utiliza los roles computables del proyecto para asignar los puntos.

```bash
node tools/taiga/assign-points.js
```

**Salida**:
```
🔐 Autenticando en Taiga...
✅ Autenticado

📊 Asignando Story Points...

   AUTH: 5 pts - JWT + Security + RBAC
      ✅ Asignado: 5 puntos

   USR: 8 pts - CRUD + roles + validaciones
      ✅ Asignado: 8 puntos
   ...

✅ Story Points asignados
   Total de puntos: 55
   Total de User Stories: 7
```

**Cómo funciona**:
1. Obtiene los roles computables del proyecto
2. Obtiene los puntos disponibles (0, 1/2, 1, 2, 3, 5, 8, 10, 13, 20, 40)
3. Para cada US, busca el punto correspondiente y lo asigna a todos los roles computables

### 2. Asignar Todo a Mí

**Archivo**: `assign-all-to-me.js`

Asigna todas las User Stories y Tasks al usuario actual (el usuario de las credenciales en .env).

```bash
node tools/taiga/assign-all-to-me.js
```

**Salida**:
```
🔐 Autenticando en Taiga...
✅ Autenticado

📋 Asignando todas las User Stories y Tasks a ti...

   User Stories encontradas: 7

   Asignando US: AUTH - Implementar autenticación JWT... (ID: 9247053)
      ✅ US asignada
      Tasks en esta US: 14
         ✅ Task: Crear endpoint POST /auth/login...
         ...

✅ Asignación completada!
   User Stories asignadas: 7
   Tasks asignadas: 94
   Total: 101 elementos
```

**Cuándo usarlo**:
- Al inicio del proyecto para asignar todo al responsible
- Después de crear nuevos módulos
- Para reassignar después de limpieza de duplicados

### 3. Limpiar Duplicados

**Archivo**: `cleanup-dups.js`

Elimina User Stories duplicadas (versiones antiguas que ya no son necesarias).

```bash
node tools/taiga/cleanup-dups.js
```

**Precaución**: Este script elimina US permanentemente. Asegúrate de verificar los IDs antes de ejecutar.

### 4. Planificar Sprints

**Archivo**: `plan-sprints.js`

Muestra una planificación sugerida de sprints basada en los módulos existentes. No crea nada en Taiga, solo muestra el plan.

```bash
node tools/taiga/plan-sprints.js
```

**Salida**:
```
📊 Plan de Sprints sugeridos para el proyecto Invernadero

🏃 Sprint 1 - Seguridad
   📅 2026-05-13 al 2026-05-27
   🎯 Módulos: AUTH, USR
   📝 User Stories (2):
      • USR - Gestión completa de usuarios (ID: 9247039)
      • AUTH - Implementar autenticación JWT (ID: 9247053)

🏃 Sprint 2 - Cultivos y Lotes
   📅 2026-05-27 al 2026-06-10
   ...
```

### 5. Crear Sprints

**Archivo**: `sprints.js`

Crea los 4 sprints planificados y asigna las User Stories correspondientes.

```bash
node tools/taiga/sprints.js
```

**Lo que hace**:
1. Crea Sprint 1 - Seguridad (AUTH, USR)
2. Crea Sprint 2 - Cultivos y Lotes (CRP, LOT)
3. Crea Sprint 3 - Eventos (EVT)
4. Crea Sprint 4 - Dashboard (DSH, EVT-TYPE)
5. Asigna cada US a su sprint correspondiente

**Fechas de los sprints**:
- Sprint 1: 13 May - 27 May 2026 (2 semanas)
- Sprint 2: 27 May - 10 Jun 2026 (2 semanas)
- Sprint 3: 10 Jun - 24 Jun 2026 (2 semanas)
- Sprint 4: 24 Jun - 8 Jul 2026 (2 semanas)

### 6. Activar Sprints

**Archivo**: `activate-sprints.js`

Cambia el estado de todas las User Stories a "In Progress" para indicar que el trabajo ha comenzado.

```bash
node tools/taiga/activate-sprints.js
```

**Lo que hace**:
1. Obtiene los estados disponibles del proyecto
2. Identifica el estado "In Progress" (ID: 10865122)
3. Actualiza cada US al estado "In Progress"

### 7. Corregir Asignación de Sprints

**Archivo**: `fix-sprints.js`

Corrige la asignación de User Stories a sprints (utiliza el método PATCH para actualizar el campo milestone).

```bash
node tools/taiga/fix-sprints.js
```

**Cuándo usarlo**:
- Si las US no aparecen dentro de los sprints en Taiga
- Si el campo milestone está vacío

### 8. Crear Epics

**Archivo**: `create-epics.js`

Crea epics en Taiga para agrupar User Stories por categoría.

```bash
node tools/taiga/create-epics.js
```

**Epics creados por defecto**:
- Backend API (color: #4FC3F7) - 6 US
- Frontend (color: #81C784) - 1 US

### 9. Vincular US a Epics

**Archivo**: `link-epics2.js`

Vincula las User Stories a los epics correspondientes.

```bash
node tools/taiga/link-epics2.js
```

**Lo que hace**:
- Asigna las US de Backend al epic "Backend API"
- Asigna las US de Frontend al epic "Frontend"

### 10. Actualizar Estado de US Específica

**Archivo**: `update-status.js`

Permite actualizar el estado de una User Story específica. Editar el archivo para cambiar los IDs:

```javascript
// Editar el archivo y cambiar el ID de la US
const USER_STORY_ID = 9247053;  // Cambiar aquí
const STATUS_ID = 10865122;      // "In Progress" - cambiar si es necesario
```

Ejecutar:
```bash
node tools/taiga/update-status.js
```

### 11. Actualizar Estado de Tasks Masivamente

**Archivo**: `update-tasks-status.js`

Actualiza el estado de las tasks según el sprint al que pertenecen las User Stories:
- Tasks de Sprints 1, 2, 3 → Estado "Closed"
- Tasks de Sprint 4 → Estado "In Progress"

```bash
node tools/taiga/update-tasks-status.js
```

**Salida**:
```
Estados de tasks disponibles:
   - New (ID: 8928602)
   - In progress (ID: 8928603)
   - Ready for test (ID: 8928604)
   - Closed (ID: 8928605)
   - Needs Info (ID: 8928606)

Actualizando estado de tasks...
Sprint 1 - Seguridad - US #42: 15 tasks
   Task: Crear endpoint POST /users -> Closed
   ...
Sprint 4 - Dashboard - US #107: 13 tasks
   Task: Implementar DSH-RF-01 -> In progress

Actualizacion completada!
   Total tasks actualizadas: 94
   -> Done: 73
   -> In Progress: 21
```

**Lo que hace**:
1. Obtiene los estados de tasks del proyecto
2. Para cada User Story, identifica su sprint
3. Asigna estado "Closed" a tasks de sprints terminados
4. Asigna estado "In Progress" a tasks del sprint activo

---

## Gestión de Wiki

### Conceptos

El Wiki en Taiga permite documentar el proyecto de manera centralizada. Las páginas de Wiki son visibles para todos los miembros del proyecto.

### Páginas Creadas

| Página | Slug | Descripción |
|--------|------|-------------|
| Inicio | inicio | Introducción al proyecto, objetivos, equipo |
| Arquitectura | arquitectura | Diagrama de componentes del sistema |
| Stack Tecnológico | stack-tecnologico | Tecnologías usadas (Angular, Spring Boot) |
| Requisitos IEEE 830 | requisitos-ieee-830 | Resumen de módulos y requisitos |
| Guía de Desarrollo | guia-desarrollo | Configuración del entorno, comandos |
| Endpoints API | endpoints-api | Lista de endpoints REST |

### Crear Wiki Automáticamente

**Archivo**: `create-wiki.js`

Crea las páginas de Wiki definidas en el script.

```bash
node tools/taiga/create-wiki.js
```

**Salida**:
```
Autenticando en Taiga...
Autenticado

Creando paginas de Wiki...
Creando: Inicio
   OK - Pagina creada
Creando: Arquitectura
   OK - Pagina creada
...
Wiki creado exitosamente!
```

**Estructura del contenido**:
El script contiene un array de objetos con:
- `slug`: Identificador URL de la página
- `title`: Título visible de la página
- `content`: Contenido en formato Markdown

### Agregar Nueva Página al Wiki

Para agregar una nueva página, editar `create-wiki.js` y agregar:

```javascript
const wikiPages = [
  // ... páginas existentes ...

  {
    slug: 'nueva-pagina',
    title: 'Titulo de la Nueva Pagina',
    content: `# Contenido en Markdown\n\nMas contenido...`
  },
];
```

---

## Gestión de Issues

### Conceptos

Los Issues en Taiga se usan para tracking de bugs, tareas técnicas y deuda técnica. Son diferentes de las User Stories.

### Issues Creados

| Issue | Prioridad | Estado | Tags |
|-------|-----------|--------|------|
| Completar tests unitarios | High | New | tests, tech-debt |
| Documentar API con Swagger | Normal | New | documentation, api |
| Refactorizar código duplicado | Normal | New | refactor, tech-debt |
| Configurar CI/CD con GitHub Actions | Low | New | devops, ci-cd |
| Configurar webhook de sincronizacion Taiga-GitHub | Low | New | integration, taiga |

### Crear Issues Automáticamente

**Archivo**: `create-issues.js`

Crea issues en Taiga para tracking de tareas técnicas.

```bash
node tools/taiga/create-issues.js
```

**Salida**:
```
Autenticando en Taiga...
Autenticado

Creando issues...
Creando: Completar tests unitarios
   OK - Issue creado (ID: 2261186)
Creando: Documentar API con Swagger
   OK - Issue creado (ID: 2261187)
...
Issues creados exitosamente!
```

### Agregar Nuevo Issue

Para agregar un nuevo issue, editar `create-issues.js`:

```javascript
const issues = [
  // ... issues existentes ...

  {
    title: 'Nuevo Issue',
    description: 'Descripcion del issue...',
    priority: 5375923,  // Normal (ver IDs en debug-issues.js)
    status: 12536199,   // New
    tags: ['tag1', 'tag2']
  },
];
```

### Estados de Issues

| Estado | ID | Descripción |
|--------|-----|-------------|
| New | 12536199 | Issue abierto |
| In progress | 12536200 | En desarrollo |
| Ready for test | 12536201 | Listo para testing |
| Closed | 12536202 | Completado |
| Needs Info | 12536203 | Requiere información |
| Rejected | 12536204 | Rechazado |
| Postponed | 12536205 | Pospuesto |

### Prioridades de Issues

| Prioridad | ID | Color |
|-----------|-----|-------|
| Low | 5375922 | Verde |
| Normal | 5375923 | Amarillo |
| High | 5375924 | Naranja |

**Archivo**: `update-status.js`

Permite actualizar el estado de una User Story específica. Editar el archivo para cambiar los IDs:

```javascript
// Editar el archivo y cambiar el ID de la US
const USER_STORY_ID = 9247053;  // Cambiar aquí
const STATUS_ID = 10865122;      // "In Progress" - cambiar si es necesario
```

Ejecutar:
```bash
node tools/taiga/update-status.js
```

---

## Gestión de Sprints

### Conceptos

Los Sprints en Taiga (también llamados Milestones) permiten organizar el trabajo en períodos de tiempo definidos (típicamente 2 semanas).

### Flujo de Trabajo con Sprints

```
1. Planificar Sprints
   └─> tools/taiga/plan-sprints.js (ver plan sugerido)

2. Crear Sprints
   └─> tools/taiga/sprints.js (crea los 4 sprints)

3. Asignar US a Sprints
   └─> tools/taiga/assign-sprints.js (asigna US a sprints existentes)

4. Corregir si es necesario
   └─> tools/taiga/fix-sprints.js

5. Activar Sprint
   └─> tools/taiga/activate-sprints.js (cambia estado a "In Progress")

6. Gestionar en Taiga UI
   └─> Arrastrar US entre columnas
   └-> Completar tasks
   └-> Actualizar estado
```

### Crear Sprints Manualmente (Alternativa)

Si prefieres crear los sprints manualmente en la UI de Taiga:

1. Ir a **Project Settings → Sprints**
2. Hacer clic en **Add Sprint**
3. Completar:
   - **Nombre**: Sprint 1 - Seguridad
   - **Fecha de inicio**: 2026-05-13
   - **Fecha de fin**: 2026-05-27
4. **Asignar US**: Arrastrar las US del Backlog al Sprint

### Scripts de Sprints

| Script | Función |
|--------|---------|
| `plan-sprints.js` | Muestra plan sugerido |
| `sprints.js` | Crea los 4 sprints con US asignadas |
| `assign-sprints.js` | Asigna US a sprints existentes |
| `fix-sprints.js` | Corrige asignación de US a sprints |
| `activate-sprints.js` | Cambia estado US a "In Progress" |
| `close-sprints.js` | Cierra sprints completados, deja activo |
| `update-tasks-status.js` | Actualiza estado de tasks masivamente |

### Cerrar Sprints

**Script**: `close-sprints.js`

Este script permite cerrar sprints que han sido completados, marcándolos como "closed" en Taiga.

```bash
node tools/taiga/close-sprints.js
```

**Uso típico**:
- Al finalizar un sprint, ejecutar para marcarlo como cerrado
- El sprint activo permanece abierto
- Actualiza el campo `closed` del milestone

**Flujo de trabajo completo**:
```
1. plan-sprints.js    → Verificar plan
2. sprints.js        → Crear sprints y asignar US
3. activate-sprints.js → Activar primer sprint
4. [trabajar en las tasks]
5. update-tasks-status.js → Cerrar tasks completadas
6. close-sprints.js  → Cerrar sprint completado
7. [repetir para siguiente sprint]
```

---

## Gestión de Epics

### Conceptos

Los Epics son contenedores de alto nivel que agrupan User Stories relacionadas. Permiten visualizar el progreso a nivel de funcionalidad mayor.

### Epics Creados

| Epic | Color | User Stories | Descripción |
|------|-------|--------------|-------------|
| **Backend API** | #4FC3F7 | 6 US | Implementación del backend con Spring Boot |
| **Frontend** | #81C784 | 1 US | Implementación del frontend con Angular |

### Flujo de Trabajo con Epics

```
1. Planificar Epics
   └─> Definir qué funcionalidades agrupan

2. Crear Epics
   └─> tools/taiga/create-epics.js

3. Vincular US a Epics
   └─> tools/taiga/link-epics2.js

4. Gestionar en Taiga
   └-> Ver progreso en vista Epics
   └-> Arrastrar US entre epics si es necesario
```

### Crear Epics Manualmente (Alternativa)

Si prefieres crear epics manualmente en la UI de Taiga:

1. Ir a la sección **Epics** en el menú
2. Hacer clic en **+ ADD EPIC**
3. Completar:
   - **Nombre**: Nombre del epic
   - **Descripción**: Descripción detallada
   - **Color**: Elegir color representativo
4. **Vincular US**: Ir a la US y seleccionar el epic en el campo correspondiente

### Scripts de Epics

| Script | Función |
|--------|---------|
| `create-epics.js` | Crea los epics del proyecto |
| `link-epics.js` | Intento de vinculación (fallido) |
| `link-epics2.js` | Vincula US a epics usando PATCH |

---

## Estado Actual del Backlog

### User Stories Creadas

| ID | Módulo | Título | Points (Taiga) | Tasks | Sprint | Epic | Estado US |
|----|--------|--------|----------------|-------|--------|------|-----------|
| 9247053 | AUTH | Implementar autenticación JWT y control de acceso por roles | 20 | 14 | Sprint 1 | Backend API | Closed |
| 9247039 | USR | Gestión completa de usuarios | 32 | 15 | Sprint 1 | Backend API | Closed |
| 9247017 | CRP | Gestión de cultivos | 20 | 16 | Sprint 2 | Backend API | Closed |
| 9247055 | LOT | Gestión completa de lotes con estados dinámicos | 52 | 14 | Sprint 2 | Backend API | Closed |
| 9247056 | EVT | Registro y gestión completa de eventos agrícolas | 52 | 14 | Sprint 3 | Backend API | Closed |
| 9247054 | EVT-TYPE | Catálogo de tipos de eventos | 12 | 8 | Sprint 4 | Backend API | In Progress |
| 9247057 | DSH | Dashboard completo con métricas en tiempo real | 32 | 13 | Sprint 4 | Frontend | In Progress |

### Resumen del Proyecto (Mayo 2026)

| Métrica | Valor |
|--------|-------|
| Total User Stories | 7 |
| Total Tasks | 94 |
| Total Story Points (Taiga) | 220 |
| Sprints Cerrados | 3 (Sprint 1, 2, 3) |
| Sprints Activos | 1 (Sprint 4) |
| Tasks en Closed | 73 |
| Tasks en In Progress | 21 |
| Epics | 2 |
| Páginas Wiki | 6 |
| Issues | 5 |

### Distribución por Sprint

| Sprint | Nombre | Fechas | US | Points | Estado | Tasks |
|--------|--------|--------|-----|--------|--------|-------|
| 1 | Sprint 1 - Seguridad | 13-27 May 2026 | 2 | 52 | ✅ Cerrado | 29 → Closed |
| 2 | Sprint 2 - Cultivos y Lotes | 27 May - 10 Jun 2026 | 2 | 72 | ✅ Cerrado | 30 → Closed |
| 3 | Sprint 3 - Eventos | 10-24 Jun 2026 | 1 | 52 | ✅ Cerrado | 14 → Closed |
| 4 | Sprint 4 - Dashboard | 24 Jun - 8 Jul 2026 | 2 | 44 | 🔄 Activo | 21 → In Progress |

### Distribución por Epic

| Epic | US | Points | Descripción |
|------|-----|--------|-------------|
| Backend API | 6 | 188 | API REST con Spring Boot |
| Frontend | 1 | 32 | Dashboard Angular |

### Estado de Tasks por Sprint

```
Sprint 1 (Cerrado): 29 tasks → Closed
Sprint 2 (Cerrado): 30 tasks → Closed  
Sprint 3 (Cerrado): 14 tasks → Closed
Sprint 4 (Activo): 21 tasks → In Progress
```

### Páginas Wiki Creadas (Total: 13 páginas)

**Básicas (6):**
1. Inicio - Introducción al proyecto
2. Arquitectura - Diagrama de componentes
3. Stack Tecnológico - Tecnologías usadas
4. Requisitos IEEE 830 - Resumen de módulos
5. Guía de Desarrollo - Configuración y comandos
6. Endpoints API - Lista de endpoints REST

**Técnicas (4):**
7. Modelo de Datos - Entidades y relaciones de la base de datos
8. Seguridad y Autenticación - JWT, roles, Spring Security
9. Configuración del Proyecto - Variables de entorno, scripts, herramientas
10. Flujo de Git y Branching - Ramas, conventional commits

**Procesos (3):**
11. Proceso de Code Review - Checklist, criterios, reglas
12. Proceso de Release - Versionado, despliegue, rollback
13. Guía de Contribución - Cómo contribuir, estándares de código

### Issues Creados

| ID | Título | Prioridad |
|----|--------|-----------|
| 2261186 | Completar tests unitarios | High |
| 2261187 | Documentar API con Swagger | Normal |
| 2261188 | Refactorizar código duplicado | Normal |
| 2261189 | Configurar CI/CD con GitHub Actions | Low |
| 2261190 | Configurar webhook Taiga-GitHub | Low |

---

## Comandos npm Disponibles

### Comandos Principales

```bash
# Crear módulos desde templates
npm run taiga "<módulo>"
npm run taiga "auth,usuarios,cultivos"

# Mostrar ayuda
npm run taiga -- --help
```

### Scripts Adicionales

```bash
# Asignar story points
npm run taiga:points

# Asignar todo al usuario actual
npm run taiga:assign

# Ver planificación de sprints
npm run taiga:sprints-plan

# Crear sprints
npm run taiga:sprints

# Activar sprints (cambiar estado US)
npm run taiga:activate

# Limpiar duplicados
npm run taiga:cleanup

# Ver estado del proyecto
npm run taiga:status
```

> **Nota**: Los scripts npm exactos dependen de la configuración en package.json. Verificar el archivo package.json para ver los scripts disponibles.

---

## Buenas Prácticas

### 1. Antes de Crear Módulos

- ✅ Revisar el backlog existente para evitar duplicados
- ✅ Verificar que las credenciales en `.env` son correctas
- ✅ Confirmar el Project ID

### 2. Después de Crear Módulos

- ✅ Ejecutar `assign-points.js` para estimar
- ✅ Ejecutar `assign-all-to-me.js` para asignar
- ✅ Revisar en Taiga que todo se creó correctamente

### 3. Gestión de Sprints

- ✅ Crear sprints al inicio del proyecto
- ✅ Asignar US a sprints antes de comenzar
- ✅ Activar sprint antes de trabajar en él
- ✅ Mantener sprint size balanceado

### 4. Gestión de Epics

- ✅ Crear epics para funcionalidades mayores
- ✅ Asignar US a epics correctamente
- ✅ Usar colores consistentes

### 5. Mantenimiento

- ✅定期 Limpiar duplicados
- ✅ Actualizar templates cuando cambien requisitos
- ✅ Documentar cambios en scripts

---

## Solución de Problemas

### Error: "Credenciales de Taiga no configuradas"

**Problema**: Faltan credenciales en el archivo `.env`

**Solución**:
1. Verificar que el archivo `.env` existe en la raíz del proyecto
2. Verificar que contiene las variables requeridas:
   ```
   TAIGA_USERNAME=tu_usuario
   TAIGA_PASSWORD=tu_password
   TAIGA_PROJECT_ID=1790796
   TAIGA_URL=https://api.taiga.io/api/v1
   ```
3. Verificar que no hay espacios extra o comillas extras

### Error: "Request failed with status code 500"

**Problema**: Error interno del servidor de Taiga

**Solución**:
1. Verificar la conexión a internet
2. Esperar unos segundos y volver a intentar
3. Verificar que el Project ID es correcto
4. Revisar el estado de Taiga en https://status.taiga.io

### Error: "Invalid role id"

**Problema**: Al intentar asignar story points, el formato del objeto de puntos es incorrecto

**Solución**: Este error ya está resuelto en el código. Los points se asignan usando los role IDs del proyecto, no user IDs.

### Error: "Request failed with status code 400" al crear sprints

**Problema**: El API de Taiga requiere campos diferentes para crear milestones

**Solución**: El script ya está actualizado para usar:
- `estimated_start` en lugar de `start_date`
- `estimated_finish` en lugar de `end_date`

### Error 404 al asignar US a sprints

**Problema**: El endpoint para asignar US a sprints cambió

**Solución**: El script usa PATCH en la US con el campo `milestone` en lugar del endpoint de milestones

### No se crean las tareas

**Problema**: La User Story ya existe (detección de duplicados)

**Solución**: El sistema detecta si ya existe una User Story con el mismo título. Si deseas recrear, tienes dos opciones:
1. Eliminar la US existente desde la UI de Taiga
2. Usar un título diferente para la nueva US

### Verbose mode muestra menos información de la esperada

**Problema**: Las opciones verbose deben ir al final

**Solución**:
```bash
npm run taiga "auth" --verbose        # Correcto
npm run taiga "auth,usuarios" --verbose  # Correcto
npm run taiga --verbose "auth"       # Incorrecto
```

### Cambiar el Project ID

**Problema**: Deseas usar otro proyecto de Taiga

**Solución**: Editar el archivo `.env` y cambiar `TAIGA_PROJECT_ID`:

```env
TAIGA_PROJECT_ID=otro_project_id
```

### Epics no se vinculan correctamente

**Problema**: La vinculación de US a epics puede fallar

**Solución**: Usar el método correcto (PATCH con campo epics):
```javascript
await api.patch(`/userstories/${usId}`, {
  epics: [epic.id],
  version: us.version,
});
```

### US no aparecen dentro del sprint

**Problema**: El campo milestone no se asignó correctamente

**Solución**: Ejecutar `fix-sprints.js` para corregir la asignación

---

## Agregar Nuevo Script

### Estructura Base

Si necesitas crear un nuevo script para automatizar otras tareas:

```javascript
const taiga = require('./taiga.js');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(msg, color = 'reset') {
  console.log(colors[color] + msg + colors.reset);
}

async function main() {
  try {
    log('🔐 Autenticando en Taiga...', 'cyan');
    await taiga.login();
    log('✅ Autenticado\n', 'green');

    // Tu lógica aquí
    const stories = await taiga.getUserStories();
    console.log(`Total User Stories: ${stories.length}`);

    // Ejemplo: Actualizar estado de todas las US
    const statuses = await taiga.getUserStoryStatuses();
    const inProgress = statuses.find(s => s.name.toLowerCase().includes('progress'));
    
    for (const story of stories) {
      await taiga.updateUserStoryStatus(story.id, inProgress.id);
      log(`   ✅ US #${story.id} actualizada a ${inProgress.name}`, 'green');
    }

    log('\n🎉 Proceso completado!', 'green');

  } catch (error) {
    log('❌ Error: ' + error.message, 'red');
    process.exit(1);
  }
}

main();
```

### Agregar como npm script

En `package.json`, agregar en la sección scripts:

```json
"scripts": {
  "mi-script": "node tools/taiga/mi-script.js"
}
```

Ejecutar:
```bash
npm run mi-script
```

### Funciones Útiles de taiga.js

| Función | Descripción |
|---------|-------------|
| `taiga.login()` | Autentica y obtiene token |
| `taiga.getUserStories()` | Lista todas las US del proyecto |
| `taiga.createUserStory(title, desc)` | Crea una nueva US |
| `taiga.getTasks(usId)` | Lista las tasks de una US |
| `taiga.createTask(usId, task)` | Crea una task |
| `taiga.getUserStoryStatuses()` | Lista estados disponibles |
| `taiga.updateUserStoryStatus(usId, statusId)` | Actualiza estado |
| `taiga.assignUserStoryToMe(usId)` | Asigna US al usuario actual |
| `taiga.assignTaskToMe(taskId)` | Asigna task al usuario actual |
| `taiga.createSprint(name, start, end)` | Crea un sprint |
| `taiga.getApiInternal()` | Obtiene el API instance |

---

## Referencias

### Documentación Externa

- [Documentación API Taiga](https://taigaio.github.io/taiga-doc/api/)
- [Taiga Support](https://taiga.io/support/)
- [Taiga API Endpoints](https://taigaio.github.io/taiga-doc/api/#api)

### Archivos del Proyecto

- [Requisitos IEEE 830](./requerimientos.md) - Fuente de requisitos funcionales
- [Plan del Proyecto](./plan.md) - Planificación general
- [Plantilla de Requisitos](./IEE%20830%20requerimientos.docx) - Documento original

### Estructura del Proyecto

```
proyecto-front/
├── .env                          # Credenciales Taiga
├── package.json                  # Scripts npm
├── tools/taiga/                  # Directorio de automatización
│   ├── taiga.js                 # Cliente API principal
│   ├── templates.js             # Definiciones de módulos
│   ├── main.js                  # CLI principal
│   └── *.js                     # Scripts adicionales
└── docs/                        # Documentación
    ├── taiga-automatizacion.md  # Este documento
    ├── requerimientos.md        # Requisitos IEEE 830
    └── plan.md                  # Plan del proyecto
```

---

## Historial de Cambios

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Mayo 2026 | Versión inicial - creación de US y Tasks |
| 2.0 | Mayo 2026 | Actualización completa - Sprints, Epics, scripts adicionales |
| 3.0 | Mayo 2026 | Cierre de sprints, estado de tasks, Wiki (6 páginas), Issues (5), documentación |
| 3.1 | Mayo 2026 | Wiki adicional (7 páginas más): Modelo datos, Seguridad, Config, Git, Code Review, Release, Contribución |

---

## Autores

- **Sistema automatizado**: Creado para el proyecto Invernadero
- **Base**: IEEE 830 Requirements Specification
- **Desarrollado por**: Nicolás Pérez
- **Fecha**: Mayo 2026

---

*Documento generado automáticamente. Para actualizaciones, editar directamente el archivo.*