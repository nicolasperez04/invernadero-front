# Plan de Refactorización de Diseño — SIGMA Design System

## Contexto

Este documento describe la refactorización visual y de componentes del frontend del Sistema de Invernadero (proyecto-front), cuyo diseño se basa en el **SIGMA Design System**: un sistema de diseño propio con tokens CSS (earth, olive, amber), tipografía DM Serif Display + Plus Jakarta Sans, y componentes compartidos (`sigma-btn`, `sigma-card`, `sigma-badge`, `sigma-empty-state`, `sigma-spinner`, `sigma-input`, `sigma-progress`, `sigma-toggle`).

Actualmente la migración desde Angular Material hacia estos componentes sigma está parcialmente completa. Este plan detalla los pasos para finalizarla y elevar la calidad visual del sistema.

---

## Objetivos

1. **Unificar el lenguaje visual** de todas las páginas bajo el SIGMA Design System.
2. **Eliminar dependencias innecesarias** de Angular Material (MatDialog, MatBadge, MatSnackBar, MatButton, MatCheckbox).
3. **Adoptar componentes sigma existentes** que están infrautilizados (`sigma-input`, `sigma-progress`).
4. **Reducir duplicación de CSS** creando componentes compartidos donde sea necesario (`sigma-table`, `sigma-toast`).
5. **Mejorar la experiencia visual** con micro-interacciones, responsive design y consistencia tipográfica/cromática.

---

## Paso 1 — Migrar Dashboard

### Problema actual
El Dashboard es la página principal de la aplicación, pero apenas usa componentes sigma (solo `sigma-card`). Utiliza botones HTML nativos, badges con `<span>`, empty states con `<div>`, y spinners con CSS custom. Esto crea una desconexión visual con el resto de la app.

### Qué se hará
- Reemplazar todos los `<button>` del Dashboard por `<button sigma-btn>` con las variantes correspondientes (primary, ghost, danger según el contexto).
- Reemplazar los `<span>` que funcionan como badges por `<sigma-badge>` con colores del sistema (green, amber, red, blue, gray).
- Reemplazar los estados vacíos (chart empty, no data) por `<sigma-empty-state>` con icono y título descriptivos.
- Reemplazar el skeleton loading custom por `<sigma-spinner>` con label.
- Reemplazar el progress bar custom por `<sigma-progress>` con color según estado.
- Eliminar las clases CSS del Dashboard que duplican funcionalidad de sigma-components.
- Ajustar el layout del Dashboard para mantener su estructura de KPIs, timeline y charts.

### Impacto
- **Archivos**: `dashboard.ts`, `dashboard.html`, `dashboard.css`
- **Dependencias eliminadas**: Ninguna nueva, pero se reduce CSS custom.
- **Resultado visual**: Dashboard visualmente coherente con Crops, Lots y Events.

---

## Paso 2 — Migrar Login

### Problema actual
La página de Login es visualmente independiente del resto del sistema. Usa variables CSS legacy (`--primary-color`, `--primary-dark`) que ya no existen en el sistema de tokens actual. Tiene su propio botón (`.login-btn`) con estilos duplicados de `sigma-btn`. Tiene su propio spinner (`.spinner`) con estilos duplicados de `sigma-spinner`. Los inputs son nativos y no siguen el patrón visual del resto de formularios.

### Qué se hará
- Reemplazar el botón de login por `<sigma-btn variant="primary" fullWidth>`.
- Reemplazar el spinner inline por `<sigma-spinner size="sm">`.
- Reemplazar los inputs nativos por `<sigma-input>` con type="email" y type="password".
- Sustituir las variables legacy (`--primary-color`, etc.) por los tokens actuales del design system (`--earth-*`, `--olive-*`).
- Mantener el fondo con gradiente pero actualizándolo para usar los colores del sistema actual.
- Asegurar que los mensajes de error usen los estilos de error del design system.
- Ajustar el layout general para que se sienta parte de la misma aplicación (misma tipografía, mismos radios, mismas sombras).

### Impacto
- **Archivos**: `login.ts`, `login.html`, `login.css`
- **Dependencias eliminadas**: Código CSS legacy (~200 líneas reemplazables).
- **Resultado visual**: Login integrado visualmente con el resto de la app.

---

## Paso 3 — Migrar CropEventTypesDialog

### Problema actual
Este diálogo (usado desde crop-list para asignar tipos de evento a un cultivo) es el único componente que todavía usa Angular Material `MatDialog`, `MatButton`, `MatCheckbox` y `MatIconModule` directamente. Además, tiene estilos inline con colores hardcodeados en hex (`#666`, `#f9f9f9`, `#e8f5e9`, `#333`, `#888`) que rompen el sistema de tokens.

### Qué se hará
- Reemplazar `MatDialog` por un overlay modal custom usando las mismas técnicas del modal de lot-list (`.modal-overlay` + `.modal-card` con backdrop blur y animación de entrada).
- Reemplazar `MatCheckbox` por `<sigma-toggle>` o inputs nativos estilizados con los tokens del sistema.
- Reemplazar `MatButton` por `<sigma-btn>`.
- Reemplazar `MatIcon` por la clase CSS `material-icons`.
- Eliminar todos los estilos inline y moverlos a un archivo CSS externo que use las variables del design system.
- Extraer el template a un archivo HTML externo (actualmente está inline en el componente TS).

### Impacto
- **Archivos**: `crop-event-types-dialog.ts` (nuevo: `.html`, `.css`)
- **Dependencias eliminadas**: `MatDialogModule`, `MatButtonModule`, `MatCheckboxModule`.
- **Resultado visual**: Diálogo consistente con el resto de modales y componentes del sistema.

---

## Paso 4 — Migrar NotificationBell

### Problema actual
El componente NotificationBell (campana de notificaciones en el navbar) usa `MatBadgeModule` para mostrar el contador de notificaciones no leídas, y `MatIconModule` para los iconos.

### Qué se hará
- Reemplazar `matBadge` por un badge custom estilizado con los tokens del sistema (círculo rojo con número blanco, posicionado absolutamente sobre el icono de campana).
- Reemplazar `mat-icon` por la clase CSS `material-icons`.
- Mantener la funcionalidad existente (dropdown, SSE, marcar como leído).

### Impacto
- **Archivos**: `notification-bell.ts`, `notification-bell.html`, `notification-bell.css`
- **Dependencias eliminadas**: `MatBadgeModule`.
- **Resultado visual**: Badge de notificaciones consistente con `sigma-badge`.

---

## Paso 5 — Adoptar sigma-input en formularios

### Problema actual
Existe un componente `sigma-input` completo (con `ControlValueAccessor`, soporte para label, error, hint, icono, y 9 tipos de input incluyendo textarea, date, datetime-local, select, etc.) pero **ninguna página lo utiliza**. En su lugar, crop-list, lot-list y event-list usan inputs nativos con estilos CSS duplicados en tres archivos diferentes (~120 líneas de CSS casi idéntico).

### Qué se hará
- En **crop-list**: Reemplazar los `<input>` y `<select>` nativos por `<sigma-input>`.
- En **lot-list**: Reemplazar los `<input>` y `<select>` nativos por `<sigma-input>`, tanto en el formulario de crear como en el de editar.
- En **event-list**: Reemplazar el `<select>`, `<input type="datetime-local">` y `<textarea>` por `<sigma-input>`.
- Eliminar el CSS de `.form-field`, `.form-field label`, `.form-field input`, `.form-field select`, `.form-field textarea` y sus variantes (`focus`, `disabled`, `placeholder`) de los tres archivos CSS (`crop-list.css`, `lot-list.css`, `event-list.css`).
- Mantener solo las clases específicas de layout (`.form-grid`, `.form-row`, `.form-actions`, `.selector-row`).

### Impacto
- **Archivos**: `crop-list.html/.css`, `lot-list.html/.css`, `event-list.html/.css`
- **Líneas eliminadas**: ~120 líneas de CSS duplicado.
- **Resultado visual**: Formularios idénticos visualmente, mantenimiento centralizado en `sigma-input`.

---

## Paso 6 — Adoptar sigma-progress donde corresponda

### Problema actual
El componente `sigma-progress` existe (con 3 colores, 2 tamaños, label y porcentaje) pero no se usa. El Dashboard tiene una barra de progreso custom en CSS (`.progress-track`/`.progress-fill`) y el modal de lot-list tiene otra barra de progreso custom similar.

### Qué se hará
- En **Dashboard**: Reemplazar el progress bar del avance promedio por `<sigma-progress>`.
- En **lot-list**: Reemplazar el progress bar del modal de resumen por `<sigma-progress>`.
- Eliminar el CSS custom de progress bars de ambos archivos.

### Impacto
- **Archivos**: `dashboard.html/.css`, `lot-list.html/.css`
- **Resultado visual**: Barras de progreso consistentes en toda la app.

---

## Paso 7 — Crear sigma-table (nuevo componente compartido)

### Problema actual
Las tablas en crop-list, lot-list y event-list tienen estructuras HTML similares pero CSS casi idéntico duplicado en tres archivos (~180 líneas total). Cualquier cambio de diseño de tabla requiere editar tres archivos.

### Qué se hará
- Crear `sigma-table` como componente standalone con:
  - Input `columns: SigmaColumn[]` (definición de columnas con label, key, type).
  - Input `data: any[]` (datos a mostrar).
  - Input `loading: boolean` (muestra skeleton rows).
  - Input `emptyMessage: string` (texto para estado vacío).
  - Content projection para celdas personalizadas (template ref).
  - Slot `actions` para columna de acciones (botones de editar/eliminar).
  - Sortable columns opcional.
  - Variante compacta o normal.
- Migrar las tablas de crop-list, lot-list y event-list para usar `sigma-table`.
- Mantener las personalizaciones por página mediante content projection (ej: badges en celdas, botones de acción).
- Eliminar el CSS de tablas de los tres archivos de componentes.

### Impacto
- **Archivos nuevos**: `shared/components/sigma-table/` (`.ts`, `.html`, `.css`)
- **Archivos modificados**: `crop-list.html/.css`, `lot-list.html/.css`, `event-list.html/.css`
- **Líneas eliminadas**: ~180 líneas de CSS duplicado.
- **Resultado visual**: Tablas consistentes, mantenimiento centralizado.

---

## Paso 8 — Crear sigma-toast service

### Problema actual
`MatSnackBar` de Angular Material se usa directamente en crop-list y lot-list para mostrar notificaciones toast (éxito, error). Esto crea una dependencia directa de Material y hace que los toasts tengan un estilo visual diferente al resto de la app.

### Qué se hará
- Crear un servicio `SigmaToastService` que abstraiga `MatSnackBar` con una interfaz limpia:
  - `success(message: string, duration?: number)`
  - `error(message: string, duration?: number)`
  - `info(message: string, duration?: number)`
- Configurar paneles de snackbar con clases CSS que usen los tokens del design system (fondo verde para éxito, rojo para error, etc.).
- Reemplazar todas las llamadas a `this.snackBar.open(...)` por `this.toast.success(...)` / `this.toast.error(...)`.
- En el futuro, cuando se elimine MatSnackBar, solo se cambia la implementación interna del servicio.

### Impacto
- **Archivos nuevos**: `core/services/sigma-toast.service.ts`
- **Archivos modificados**: `crop-list.ts`, `lot-list.ts`
- **Dependencias eliminadas**: Uso directo de `MatSnackBar` en componentes (queda abstraído).
- **Resultado visual**: Toasts con los mismos colores y tipografía del design system.

---

## Paso 9 — Responsive Design

### Problema actual
La aplicación no tiene media queries. En pantallas menores a 1024px:
- El grid de KPIs del Dashboard (4 columnas) se desborda.
- El grid de 2 columnas en formularios se desborda.
- La tabla horizontal requiere scroll pero no hay indicación visual.
- El sidebar ocupa 240px fijos.

### Qué se hará
- Agregar breakpoints para tablets (>768px) y móviles (>480px).
- **Dashboard KPIs**: 4 cols → 2 cols (tablet) → 1 col (mobile).
- **Form grids**: 2 cols → 1 col (mobile).
- **Tablas**: Mantener scroll horizontal pero agregar indicador visual (sombra en el borde derecho).
- **Sidebar**: Auto-colapsar a iconos en mobile, con overlay.
- **Sigma-card**: Ajustar padding en mobile (24px → 16px).
- **Sigma-btn**: fullWidth en mobile para facilidad de uso táctil.

### Impacto
- **Archivos**: `dashboard.css`, `crop-list.css`, `lot-list.css`, `event-list.css`, `layout.css`, `styles.css`, componentes sigma.
- **Resultado visual**: App utilizable en tablets y móviles.

---

## Paso 10 — Micro-interacciones y Polish

### Problema actual
Aunque la app tiene transiciones suaves (hover en cards, foco en inputs), las micro-interacciones son mínimas y no hay "personalidad" en la interacción.

### Qué se hará
- **Staggered reveal en tablas**: Las filas aparecen con un pequeño delay escalonado al cargar (`animation-delay` basado en el índice).
- **Hover en filas de tabla**: Efecto más rico (sutil elevación + cambio de background).
- **Animación en sigma-badge**: Escala sutil al aparecer.
- **Transición en sigma-btn**: Mejorar el feedback táctil con micro-escala al hacer click.
- **Loading states**: Transición suave entre loading y contenido en sigma-spinner.
- **Empty states**: Animación de entrada (fade + slide up) para sigma-empty-state.
- **Tooltips**: Los botones de acción en tablas tienen tooltips con `title` — reemplazar por un tooltip custom sutil.
- **Focus visible**: Asegurar que todos los elementos interactivos tengan `:focus-visible` ring con los colores del sistema.

### Impacto
- **Archivos**: Componentes sigma + feature pages (ajustes menores).
- **Resultado visual**: App con "personalidad" y sensación más pulida y profesional.

---

## Paso 11 — Dark Mode (opcional, largo plazo)

### Problema actual
Solo existe modo claro. No hay variables CSS para modo oscuro ni `prefers-color-scheme`.

### Qué se hará
- Definir variables CSS para modo oscuro en `styles.css` usando `@media (prefers-color-scheme: dark)`.
- Ajustar colores: fondos earth pasan a ser dark (brown oscuro casi negro), textos pasan a crema, olives se aclaran.
- Probar en todos los componentes sigma y feature pages.
- Agregar toggle manual en el layout (sol/luna) como override.

### Impacto
- **Archivos**: `styles.css`, `layout.html/.css`
- **Resultado visual**: App con soporte completo de modo oscuro.

---

## Resumen de Entregables

| Paso | Entregable | Archivos | Esfuerzo |
|------|-----------|----------|----------|
| 1 | Dashboard migrado | 3 modificados | ~1.5h |
| 2 | Login migrado | 3 modificados | ~1.5h |
| 3 | CropEventTypesDialog migrado | 3 nuevos, 1 modificado | ~1h |
| 4 | NotificationBell migrado | 3 modificados | ~30min |
| 5 | sigma-input adoptado | 6 modificados | ~1.5h |
| 6 | sigma-progress adoptado | 4 modificados | ~30min |
| 7 | sigma-table creado | 4 nuevos, 6 modificados | ~2h |
| 8 | sigma-toast creado | 1 nuevo, 2 modificados | ~1h |
| 9 | Responsive design | 6+ modificados | ~2h |
| 10 | Micro-interacciones | 5+ modificados | ~1.5h |
| 11 | Dark mode | 2+ modificados | ~1h |

**Total estimado:** ~13-15 horas distribuidas en 11 pasos.

---

## Notas Técnicas

- Cada paso debe compilar sin errores (`npm run build`) antes de pasar al siguiente.
- Los pasos 1-4 son independientes entre sí y pueden ejecutarse en paralelo.
- Los pasos 5-6 dependen de la existencia de `sigma-input` y `sigma-progress` (ya existen).
- El paso 7 (sigma-table) y 8 (sigma-toast) crean nueva infraestructura compartida.
- Los pasos 9-10 son polish sobre todo lo anterior.
- El paso 11 (dark mode) es opcional y puede posponerse.
