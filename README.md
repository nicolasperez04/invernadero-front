# Invernadero Frontend

[![CI](https://github.com/nicolasperez04/invernadero-front/actions/workflows/ci.yml/badge.svg)](https://github.com/nicolasperez04/invernadero-front/actions)
[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular)](https://angular.dev)
[![Node](https://img.shields.io/badge/Node-20-339933?logo=node.js)

Aplicación frontend para gestión de invernaderos - desarrollada con Angular 21 y Angular Material.

## Descripción

Sistema de gestión agrícola que permite administrar cultivos, lotes y eventos de un invernadero. La aplicación consume una API REST con autenticación JWT.

## Características

- **Autenticación**: Login con JWT (localStorage)
- **Gestión de Cultivos**: CRUD completo de cultivos
- **Gestión de Lotes**: Administración de lotes del invernadero
- **Seguimiento de Eventos**: Registro de siembras, cosechas y otros eventos
- **Internacionalización**: Soporte para español e inglés (i18n)
- **Dashboard**: Métricas y visualización de datos

## Tech Stack

| Tecnología       | Versión |
| ---------------- | ------- |
| Angular          | 21.x    |
| Angular Material | 21.x    |
| TypeScript       | 5.9.x   |
| Vitest           | 4.x     |
| Playwright       | 1.59.x  |
| ngx-translate    | 15.x    |

## Requisitos Previos

- Node.js 20 o superior
- npm 10.x

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en: `http://localhost:4200`

## Scripts Disponibles

| Comando          | Descripción                                |
| ---------------- | ------------------------------------------ |
| `npm start`      | Inicia el servidor de desarrollo           |
| `npm run build`  | Compila para producción                    |
| `npm run watch`  | Compilación incremental en modo desarrollo |
| `npm test`       | Ejecuta pruebas unitarias (Vitest)         |
| `npm run lint`   | Verifica formato de código (Prettier)      |
| `npm run e2e`    | Ejecuta pruebas E2E (Playwright)           |
| `npm run e2e:ui` | Abre interfaz gráfica de E2E               |

## Configuración de Entornos

### Desarrollo

Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
};
```

### Producción

Edita `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-production.com/api',
};
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/           # Servicios, guards, interceptors
│   │   ├── guards/     # AuthGuard, RoleGuard
│   │   ├── interceptors/ # AuthInterceptor, ErrorInterceptor
│   │   ├── models/     # Modelos de datos
│   │   └── services/   # Servicios HTTP
│   ├── features/      # Módulos de características
│   │   ├── auth/      # Login
│   │   ├── crops/     # Gestión de cultivos
│   │   ├── dashboard/ # Dashboard
│   │   ├── events/    # Gestión de eventos
│   │   └── lots/      # Gestión de lotes
│   ├── shared/        # Componentes compartidos
│   │   ├── components/
│   │   └── layout/
│   └── models/        # Modelos de dominio
├── assets/
│   └── i18n/          # Archivos de traducción (es.json, en.json)
└── environments/      # Archivos de entorno
```

## Autenticación

El sistema utiliza JWT para autenticación:

1. El usuario inicia sesión en `/login`
2. El backend retorna un token JWT
3. El token se almacena en `localStorage`
4. El `AuthInterceptor` adjunta el token a cada request

### Roles de Usuario

- **ADMIN**: Acceso completo
- **OPERATOR**: Gestión de cultivos, lotes y eventos
- **VIEWER**: Solo lectura

## Internacionalización

La aplicación soporta español (es) e inglés (en).

- Archivos de traducción: `src/assets/i18n/es.json` y `en.json`
- Cambio de idioma desde la barra de navegación

## Pruebas

### Pruebas Unitarias

```bash
npm test
```

### Pruebas E2E

```bash
npm run e2e
```

## Despliegue

### Render (Producción)

El proyecto está configurado para desplegarse en [Render](https://render.com).

1. Conectar el repositorio GitHub a Render
2. Configurar:
   - Build Command: `npm run build`
   - Publish Directory: `dist/proyecto-front/browser`

### GitHub Actions

El workflow de CI se ejecuta en cada push a `main` y Pull Requests:

- Instala dependencias
- Ejecuta pruebas unitarias
- Verifica formato de código
- Compila para producción
- Sube artifact con el build

## Contributing

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guidelines de contribución.

## Licencia

MIT
