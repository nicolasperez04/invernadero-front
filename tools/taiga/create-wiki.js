const taiga = require('./taiga.js');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

function log(msg, color = 'reset') {
  console.log(colors[color] + msg + colors.reset);
}

const wikiPages = [
  {
    slug: 'inicio',
    title: 'Inicio',
    content: `# Proyecto Invernadero - Greenhouse Management System

## Descripcion
Sistema de gestion de invernadero automatizado para el control de cultivos, lotes y eventos agricolas.

## Objetivos
- Gestion completa de cultivos con parametros de crecimiento
- Control de lotes con estados dinamicos (CREATED/IN_PRODUCTION/FINISHED)
- Registro de eventos agricolas (SIEMBRA, COSECHA, RIEGO, FERTILIZACION)
- Dashboard con metricas en tiempo real
- Autenticacion segura con JWT y control de acceso por roles

## Equipo
- **Project Owner**: Nicolas Perez
- **Desarrollador**: Nicolas Perez

## Enlaces
- [Taiga Project](https://tree.taiga.io/nicolasperez04/invernadero)
- [Repositorio Frontend](https://github.com/proyecto-front)
`,
  },
  {
    slug: 'arquitectura',
    title: 'Arquitectura',
    content: `# Arquitectura del Sistema

## Diagrama de Componentes

\`\`\`
+----------------+     +----------------+     +----------------+
|   Angular     | <-> |   Spring Boot  | <-> |     Taiga      |
|   Frontend    |     |     Backend    |     |    Project     |
+----------------+     +----------------+     +----------------+
       |                      |                      |
       v                      v                      v
+----------------+     +----------------+     +----------------+
| Angular       |     | Spring Security|     | User Stories  |
| Material UI   |     | JWT Auth       |     | Tasks          |
+----------------+     +----------------+     +----------------+
                           |
                    +------v-------+
                    |   PostgreSQL |
                    |   Database   |
                    +--------------+
\`\`\`

## Capas

### Frontend (Angular 21)
- **Componentes**: Dashboard, CRUD de entidades
- **Servicios**: API REST integration
- **Routing**: Navegacion entre vistas

### Backend (Spring Boot)
- **Controllers**: REST endpoints
- **Services**: Logica de negocio
- **Repositories**: Acceso a datos
- **Security**: JWT + Spring Security

### Base de Datos
- PostgreSQL
- Entidades: Users, Crops, Lots, Events, EventTypes
`,
  },
  {
    slug: 'stack-tecnologico',
    title: 'Stack Tecnologico',
    content: `# Stack Tecnologico

## Frontend
| Tecnologia | Version | Uso |
|------------|---------|-----|
| Angular | 21 | Framework SPA |
| Angular Material | 21 | UI Components |
| TypeScript | 5.x | Lenguaje |
| Chart.js | - | Graficos |
| @ngx-translate | - | i18n |

## Backend
| Tecnologia | Version | Uso |
|------------|---------|-----|
| Spring Boot | 3.x | Framework |
| Spring Security | 6.x | Seguridad |
| JWT | - | Autenticacion |
| Spring Data JPA | - | ORM |
| PostgreSQL | 15 | Base de datos |

## Herramientas
| Herramienta | Uso |
|-------------|-----|
| Taiga | Gestion de proyecto |
| Git | Control de versiones |
| npm | Gestor de paquetes |
| Vitest | Testing |
| GitHub Actions | CI/CD |
`,
  },
  {
    slug: 'requisitos-ieee-830',
    title: 'Requisitos IEEE 830',
    content: `# Requisitos IEEE 830 - Resumen

## Modulos Funcionales

### AUTH - Autenticacion
- AUTH-RF-01: Inicio de sesion con credenciales
- AUTH-RF-02: Control de acceso basado en roles

### USR - Gestion de Usuarios
- USR-RF-01: Crear usuario
- USR-RF-02: Listar usuarios
- USR-RF-03: Actualizar usuario
- USR-RF-04: Eliminar usuario (soft delete)
- USR-RF-05: Asignar roles

### CRP - Gestion de Cultivos
- CRP-RF-01 al CRP-RF-06: CRUD completo de cultivos

### LOT - Gestion de Lotes
- LOT-RF-01 al LOT-RF-10: Estados dinamicos, inactividad, progreso

### EVT - Gestion de Eventos
- EVT-RF-01 al EVT-RF-07: Registro y seguimiento de eventos

### EVT-TYPE - Tipos de Eventos
- EVT-TYPE-RF-01: Listar tipos
- EVT-TYPE-RF-02: CRUD completo

### DSH - Dashboard
- DSH-RF-01 al DSH-RF-04: Metricas y graficos

## Requisitos No Funcionales
- RNF-01: Control de acceso por roles
- RNF-02: Seguridad con JWT
- RNF-03: Trazabilidad
- RNF-04: Interfaz responsiva
`,
  },
  {
    slug: 'guia-desarrollo',
    title: 'Guia de Desarrollo',
    content: `# Guia de Desarrollo

## Configuracion del Entorno

### Prerrequisitos
- Node.js 18+
- npm 9+
- Java 17+
- PostgreSQL 15+

### Instalacion Frontend
\`\`\`bash
cd proyecto-front
npm install
npm start
\`\`\`

### Instalacion Backend
\`\`\`bash
cd proyecto-back
./mvnw spring-boot:run
\`\`\`

## Comandos Utiles

### Frontend
| Comando | Descripcion |
|---------|-------------|
| npm start | Iniciar servidor dev |
| npm run build | Compilar |
| npm test | Ejecutar tests |

### Backend
| Comando | Descripcion |
|---------|-------------|
| mvn spring-boot:run | Iniciar aplicacion |
| mvn test | Ejecutar tests |
| mvn package | Compilar |

## Convenciones de Codigo
- Usar TypeScript strict mode
- Nombres en camelCase para variables
- Nombres en PascalCase para componentes
- Servicios con sufijo Service
- Repositorios con sufijo Repository
`,
  },
  {
    slug: 'endpoints-api',
    title: 'Endpoints API',
    content: `# Endpoints API REST

## Autenticacion
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /auth/login | Iniciar sesion |

## Usuarios
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /users | Crear usuario |
| GET | /users | Listar usuarios |
| GET | /users/{id} | Obtener usuario |
| PUT | /users/{id} | Actualizar usuario |
| DELETE | /users/{id} | Eliminar usuario |

## Cultivos
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /crops | Crear cultivo |
| GET | /crops | Listar cultivos |
| GET | /crops/{id} | Obtener cultivo |
| PUT | /crops/{id} | Actualizar cultivo |
| DELETE | /crops/{id} | Eliminar cultivo |

## Lotes
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /lots | Crear lote |
| GET | /lots | Listar lotes |
| GET | /lots/{id} | Obtener lote |
| PUT | /lots/{id} | Actualizar lote |
| DELETE | /lots/{id} | Eliminar lote |

## Eventos
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /events | Crear evento |
| GET | /events | Listar eventos |
| GET | /events/{id} | Obtener evento |
| PUT | /events/{id} | Actualizar evento |

## Tipos de Evento
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | /event-types | Listar tipos |
| POST | /event-types | Crear tipo |
| PUT | /event-types/{id} | Actualizar tipo |
| DELETE | /event-types/{id} | Eliminar tipo |

## Dashboard
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | /dashboard | Obtener metricas |
`,
  },
];

async function main() {
  try {
    log('Autenticando en Taiga...', 'cyan');
    await taiga.login();
    log('Autenticado\n', 'green');

    const api = taiga.getApiInternal();
    const projectId = process.env.TAIGA_PROJECT_ID;

    log('Creando paginas de Wiki...\n', 'bright');

    for (const page of wikiPages) {
      try {
        log(`Creando: ${page.title}`, 'cyan');

        const response = await api.post('/wiki', {
          project: parseInt(projectId),
          slug: page.slug,
          content: page.content,
        });

        log(`   OK - Pagina creada\n`, 'green');
      } catch (err) {
        if (err.response?.status === 400) {
          log(`   La pagina ya existe, actualizando...\n`, 'yellow');
        } else {
          log(`   Error: ${err.message}\n`, 'yellow');
        }
      }
    }

    log('Wiki creado exitosamente!', 'green');
  } catch (error) {
    log('Error: ' + error.message, 'red');
    process.exit(1);
  }
}

main();
