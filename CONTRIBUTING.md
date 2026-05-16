# Guía de Contribución

Gracias por tu interés en contribuir al proyecto. Este documento establece las normas y procedimientos para contribuir.

## Código de Conducta

- Ser respetuoso y profesional
- Aceptar críticas constructivas de manera positiva
- Enfocarse en lo que es mejor para el proyecto y la comunidad

## Cómo Contribuir

### 1. Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

- Título descriptivo
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica

### 2. Sugerir Mejoras

Para sugerir nuevas características:

- Describe la funcionalidad deseada
- Explica por qué sería útil
- Incluye ejemplos de uso si es posible

### 3. Pull Requests

#### Proceso

1. Fork el repositorio
2. Crea una rama para tu feature/fix (`git checkout -b feature/nombre`)
3. Realiza tus cambios siguiendo las convenciones
4. Ejecuta las pruebas localmente
5. Commit con mensajes descriptivos
6. Push a tu fork y crea un Pull Request

#### Normas para PRs

- El código debe pasar todas las verificaciones de CI
- Incluye pruebas para nueva funcionalidad
- Actualiza la documentación si es necesario
- Describe claramente los cambios realizados

## Estándares de Código

### TypeScript

- Usar `const` sobre `let` cuando sea posible
- Tipado explícito para argumentos y retornos de funciones
- Nombres descriptivos en camelCase

```typescript
// Correcto
const cropList: Crop[] = [];
function getCropById(id: number): Crop | undefined;

// Incorrecto
let list = [];
function get(id) {}
```

### Componentes Angular

- Usar arquitectura standalone
- Imports explícitos en el componente
- Separar template, estilos y lógica

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  selector: 'app-crop-list',
  templateUrl: './crop-list.html',
  styleUrl: './crop-list.css',
})
export class CropListComponent {
  // lógica del componente
}
```

### Convenciones de Nombres

| Tipo        | Convención           | Ejemplo             |
| ----------- | -------------------- | ------------------- |
| Componentes | PascalCase           | `CropListComponent` |
| Servicios   | PascalCase + Service | `CropService`       |
| Guards      | PascalCase + Guard   | `AuthGuard`         |
| Archivos    | kebab-case           | `crop-list.ts`      |
| Variables   | camelCase            | `cropList`          |
| Constantes  | UPPER_SNAKE_CASE     | `API_URL`           |

### Estilos

- Usar CSS moderno (flexbox, grid)
- Preferir `:host` para estilos encapsulados
- Mantener archivos por debajo de 8kB
- No usar `!important` salvo necesario

### Funcionalidad

- Evitar `alert()` y `confirm()` - usar MatSnackBar o MatDialog
- No hardcodear URLs - usar environment
- Manejar errores centralizadamente
- Traducir textos visibles con i18n

## Commits

### Mensajes de Commit

Formato: `tipo(scope): descripción`

Tipos:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (sin cambio de lógica)
- `refactor`: Refactorización
- `test`: Pruebas
- `chore`: Mantenimiento

Ejemplos:

```
feat(crops): add crop creation form
fix(dashboard): resolve chart rendering issue
docs(readme): update installation instructions
```

## Pruebas

### Pruebas Unitarias

Ejecutar antes de commit:

```bash
npm test
```

Escribir tests para:

- Componentes nuevos
- Servicios con lógica de negocio
- Guards e interceptors

### Verificar Formato

```bash
npm run lint
```

## Configuración de Desarrollo

### Pre-commit Hooks

El proyecto usa Prettier para formato automático. Configura tu editor:

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Variables de Entorno

Crear `src/environments/environment.ts` si no existe:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
};
```

## Recursos

- [Angular Style Guide](https://angular.dev/guide/styleguide)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Material](https://material.angular.io/)

## Preguntas

Si tienes dudas sobre cómo contribuir, abre un issue para discutirlo.

---

_Dernière actualización: Mayo 2026_
