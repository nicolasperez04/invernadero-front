# Plan de Automatización — SIGMA

> Documento detallado de automatizaciones a implementar en el sistema SIGMA (Sistema de Gestión de Invernaderos).
> Cada automatización describe: qué es, qué problema resuelve, cómo se ve desde la perspectiva del usuario,
> y los cambios generales necesarios en el sistema.

---

## Índice

1. [Auto-asignación de EventTypes al crear un Crop](#1-auto-asignación-de-eventtypes-al-crear-un-crop)
2. [Alertas automáticas por inactividad de lote](#2-alertas-automáticas-por-inactividad-de-lote)
3. [Generación automática de PDF al cosechar](#3-generación-automática-de-pdf-al-cosechar)
4. [Notificación automática de cosecha próxima](#4-notificación-automática-de-cosecha-próxima)
5. [Auto-actualización del estado del lote](#5-auto-actualización-del-estado-del-lote)
6. [Dashboard en tiempo real con SSE](#6-dashboard-en-tiempo-real-con-sse)
7. [JaCoCo — Medición de cobertura de tests](#7-jacoco--medición-de-cobertura-de-tests)
8. [Pre-commit hooks con Husky y lint-staged](#8-pre-commit-hooks-con-husky-y-lint-staged)
9. [Reporte automático de cobertura en Pull Requests](#9-reporte-automático-de-cobertura-en-pull-requests)

---

## 1. Auto-asignación de EventTypes al crear un Crop

### ¿Qué es?

Actualmente, los tipos de evento (RIEGO, SOWING, HARVEST, FERTILIZACIÓN, CONTROL_PLAGAS, etc.) existen como una lista global. Cualquier lote puede usar cualquier tipo de evento, sin importar qué cultivo tenga. No hay una relación entre "qué tipo de cultivo es" y "qué eventos puede recibir".

Esta automatización establece que **cada cultivo define qué tipos de evento son válidos para sus lotes**. Al crear un nuevo cultivo, el sistema asigna automáticamente un conjunto predeterminado de tipos de evento. Luego, al registrar eventos en los lotes de ese cultivo, solo se muestran y permiten los tipos de evento asociados.

### ¿Qué problema resuelve?

- **Control semántico:** Un operador podría registrar un evento `PODA` en un lote de `Lechuga` aunque ese tipo de evento no tenga sentido para lechugas. Con esta automatización, el sistema solo muestra las opciones válidas.
- **Experiencia de usuario:** El operador no tiene que recordar qué tipo de evento usar; el sistema le presenta solo los relevantes para el cultivo seleccionado.
- **Personalización por cultivo:** Cada cultivo puede tener su propio conjunto de eventos. Un cultivo de `Tomate` puede tener `PODA` y `ENTUTORADO` mientras que `Lechuga` no.

### ¿Cómo se ve desde el frontend?

1. El administrador crea un nuevo cultivo "Tomate cherry" con `estimatedGrowthDays=90`
2. El sistema automáticamente asocia todos los tipos de evento por defecto (RIEGO, SOWING, HARVEST, FERTILIZACIÓN, etc.)
3. En la pantalla de detalle del cultivo, aparece una nueva sección "Tipos de evento disponibles" con la lista y la opción de agregar/remover tipos
4. Cuando un operador va a registrar un evento en un lote de "Tomate cherry", el selector de tipo de evento solo muestra los tipos asociados a ese cultivo
5. Si el operador intenta enviar un tipo no válido, el backend lo rechaza con un mensaje claro

### Cambios generales necesarios

- **Base de datos:** Nueva tabla intermedia `crop_event_types` que relaciona cultivos con tipos de evento (relación muchos a muchos)
- **Backend:** Lógica para asignar los tipos por defecto al crear un cultivo, y validación al registrar eventos para asegurar que el tipo está permitido para ese cultivo
- **Frontend:** Nueva sección en la pantalla de detalle del cultivo para administrar sus tipos de evento; filtrado del selector de tipo de evento según el cultivo del lote

### ¿Para qué sirve?

Para que el sistema entienda semánticamente qué eventos aplican a cada cultivo, evitando errores operativos y mejorando la experiencia del usuario al mostrar solo opciones relevantes.

---

## 2. Alertas automáticas por inactividad de lote

### ¿Qué es?

Actualmente, el sistema ya calcula el nivel de inactividad de cada lote (GRAY → GREEN → YELLOW → RED) basado en los días transcurridos desde el último evento y el umbral definido en el cultivo. Sin embargo, este cálculo solo se muestra visualmente en el dashboard. **No ocurre ninguna acción automática** cuando un lote entra en estado crítico.

Esta automatización agrega un **sistema de notificaciones interno** que monitorea automáticamente la inactividad de los lotes y genera alertas visibles para los operadores.

### ¿Qué problema resuelve?

- **Lotes olvidados:** Un operador puede tener varios lotes a su cargo y olvidar que uno lleva días sin actividad. Con las alertas, el sistema le avisa proactivamente.
- **Historial de alertas:** Actualmente no hay registro de cuándo un lote entró en estado crítico. Con esta automatización, queda un historial.
- **Asignación de responsabilidad:** Las alertas pueden asignarse a un usuario específico para que las resuelva.

### ¿Cómo se ve desde el frontend?

1. En el Navbar aparece un **ícono de campana** con un badge numérico que muestra la cantidad de alertas no leídas
2. Al hacer clic en la campana, se despliega un menú con las últimas alertas, cada una mostrando:
   - Un icono según la severidad (INFO/WARNING/CRITICAL)
   - El mensaje de la alerta (ej: "Lote Norte A lleva 8 días sin actividad")
   - Hace cuánto tiempo se generó
   - Botón "Marcar como leída"
3. Existe una página `/alerts` con el listado completo de alertas, filtros por tipo y severidad, y opción de marcar todas como leídas

### ¿Qué ocurre internamente?

El backend ejecuta un proceso programado (scheduler) cada hora que:
1. Revisa todos los lotes activos
2. Calcula su nivel de inactividad mediante la lógica ya existente en `LotService`
3. Si un lote está en nivel `YELLOW` o `RED`, **crea un registro de alerta** si no existe ya una alerta sin leer para ese lote
4. La alerta queda disponible inmediatamente en el endpoint `GET /api/alerts`

### Cambios generales necesarios

- **Base de datos:** Nueva tabla `alerts` con campos: id, tipo, severidad, mensaje, lote asociado, usuario asignado, leída/no leída, fecha de creación
- **Backend:** Nuevo servicio `AlertService` con un scheduler programado (Spring `@Scheduled` cada hora), endpoints CRUD para consultar y marcar alertas
- **Frontend:** Nuevo componente `notification-bell` en el Navbar, nueva página de listado de alertas con ruta `/alerts`

### ¿Para qué sirve?

Para que el sistema supervise activamente el estado de los lotes y notifique a los operadores cuando un lote requiere atención, evitando que lotes completos se pierdan por inactividad no detectada.

---

## 3. Generación automática de PDF al cosechar

### ¿Qué es?

Actualmente, cuando un lote se cosecha (se registra un evento `HARVEST`), el sistema simplemente registra el evento y marca el lote como finalizado. No se genera ningún documento resumen del ciclo de vida del lote.

Esta automatización hace que **al registrar una cosecha, el sistema genere automáticamente un informe PDF** con todos los datos del lote: su cultivo, fechas clave, lista completa de eventos, y estadísticas de producción.

### ¿Qué problema resuelve?

- **Trazabilidad:** No existe un documento que resuma todo el ciclo de vida de un lote. Si se necesita para auditoría o análisis posterior, no hay cómo obtenerlo.
- **Reportes manuales:** Cualquier informe tendría que armarlo el usuario copiando datos de varias pantallas del sistema. Con esta automatización, el informe se genera automáticamente.
- **Cierre del ciclo:** La cosecha es el evento final del lote. Tener un PDF descargable le da un cierre formal al proceso.

### ¿Cómo se ve desde el frontend?

1. Un operador registra un evento `HARVEST` en el Lote Norte A
2. El backend procesa el evento y, además de guardarlo, genera el PDF
3. En la pantalla de detalle del lote, ahora aparece un **botón "Descargar informe de cosecha"** con un ícono de PDF
4. Al hacer clic, el navegador descarga un archivo `informe_cosecha_Lote_Norte_A_2026-05-15.pdf`
5. El PDF contiene:
   - Encabezado: "SIGMA — Informe de Cosecha"
   - Datos del lote: nombre, cultivo, estado final
   - Fechas clave: siembra, cosecha, duración total en días
   - Estadísticas: total de eventos, frecuencia de eventos por día
   - Tabla con todos los eventos ocurridos (fecha, tipo, categoría, descripción)
   - Footer con fecha de generación

### Cambios generales necesarios

- **Backend:** Nuevo servicio `PdfReportService` que usa iTextPDF (ya incluido en las dependencias del proyecto) para generar el documento con los datos del lote; modificar `EventService` para que al registrar un HARVEST invoque la generación del PDF; nuevo endpoint `GET /api/lots/{id}/report` para descargar el archivo
- **Frontend:** Agregar botón "Descargar informe" en la vista de detalle del lote, visible solo cuando el lote está en estado `FINISHED`

### ¿Para qué sirve?

Para obtener automáticamente un documento formal de cada ciclo de cultivo completo, útil para trazabilidad, auditoría, análisis de productividad y respaldo documental.

---

## 4. Notificación automática de cosecha próxima

### ¿Qué es?

Actualmente, cuando se registra un evento `SOWING`, el sistema calcula automáticamente la `estimatedHarvestDate` sumando los `estimatedGrowthDays` del cultivo a la fecha de siembra. Sin embargo, **nadie recibe un aviso** cuando esa fecha se acerca.

Esta automatización agrega un proceso diario que revisa todos los lotes en producción y genera alertas cuando la cosecha está próxima (7 días, 3 días, 1 día).

### ¿Qué problema resuelve?

- **Fechas de cosecha ignoradas:** La fecha se calcula pero los operadores pueden olvidarse de ella. Con alertas progresivas, el sistema recuerda.
- **Planificación:** Saber con 7 días de anticipación permite preparar recursos (personal, empaque, transporte, clientes).
- **Cosechas atrasadas:** Si la fecha de cosecha ya pasó y no se ha registrado HARVEST, el sistema podría generar una alerta de "cosecha vencida".

### ¿Cómo se ve desde el frontend?

Reutiliza el mismo sistema de notificaciones del punto 2. Las alertas de cosecha próxima aparecen en la misma campana de notificaciones:

1. A 7 días de la cosecha estimada: alerta informativa "La cosecha del lote Norte A está a 7 días"
2. A 3 días de la cosecha estimada: alerta de advertencia "La cosecha del lote Norte A está a 3 días — preparar recursos"
3. A 1 día de la cosecha estimada: alerta crítica "¡El lote Norte A debe cosecharse mañana!"
4. Además, en el dashboard aparece una **nueva tarjeta** llamada "Próximas cosechas" que lista los lotes con su fecha estimada, ordenados por cercanía

### Cambios generales necesarios

- **Backend:** Agregar un nuevo scheduler en `AlertService` (o el existente del punto 2) que se ejecute diariamente y verifique las `estimatedHarvestDate` de todos los lotes; modificar `DashboardService` para incluir un listado de próximas cosechas en la respuesta del dashboard
- **Frontend:** Agregar tarjeta "Próximas cosechas" en el dashboard; las notificaciones se muestran en el mismo componente del punto 2

### ¿Para qué sirve?

Para que los operadores reciban avisos progresivos antes de la cosecha, permitiendo planificar con anticipación y evitando que las cosechas se pierdan por falta de preparación.

---

## 5. Auto-actualización del estado del lote

### ¿Qué es?

Actualmente, el estado de un lote (`CREATED` → `IN_PRODUCTION` → `FINISHED`) se calcula dinámicamente cada vez que se consulta: el sistema revisa si existen eventos `SOWING` o `HARVEST` para determinar el estado. Esto funciona, pero es ineficiente y no permite hacer búsquedas directas por estado.

Esta automatización agrega un **campo `status` persistido en la base de datos** que se actualiza automáticamente cuando ocurren eventos relevantes.

### ¿Qué problema resuelve?

- **Rendimiento:** Cada vez que se consulta el estado de un lote, el sistema hace consultas adicionales a la tabla de eventos. Con el campo persistido, el estado se obtiene directamente.
- **Filtros en la API:** Sin el campo persistido, no se puede hacer `GET /api/lots?status=IN_PRODUCTION` de forma eficiente. Con esta automatización, sí.
- **Ordenamiento:** Se puede ordenar la lista de lotes por estado sin necesidad de cálculos en tiempo real.

### ¿Cómo se ve desde el frontend?

1. En la lista de lotes, aparece un nuevo **filtro desplegable** "Estado" con opciones: Todos, Creado, En producción, Finalizado
2. Al seleccionar "En producción", la tabla se filtra inmediatamente mostrando solo esos lotes
3. El badge de estado en cada lote ahora se lee directamente de la base de datos en lugar de calcularse

### ¿Qué ocurre internamente?

- Al crear un lote: `status = "CREATED"`
- Al registrar evento `SOWING`: `status = "IN_PRODUCTION"` (el backend lo actualiza automáticamente)
- Al registrar evento `HARVEST`: `status = "FINISHED"` (el backend lo actualiza automáticamente)
- El método `getLotStatus()` del servicio puede seguir existiendo para verificación, pero ya no es necesario para consultas básicas

### Cambios generales necesarios

- **Base de datos:** Nueva columna `status` (varchar, no nulo) en la tabla `lots`
- **Backend:** Modificar la entidad `Lot` para incluir el campo; modificar `LotService.createLot()` para asignar estado inicial; modificar `EventService.registerEvent()` para actualizar el estado cuando ocurran SOWING o HARVEST; agregar método de búsqueda por estado en el repositorio; agregar parámetro `status` opcional en `GET /api/lots`
- **Frontend:** Agregar filtro por estado en la lista de lotes

### ¿Para qué sirve?

Para mejorar el rendimiento de las consultas de lotes y permitir búsqueda y filtrado directo por estado, tanto en la API como en la interfaz de usuario.

---

## 6. Dashboard en tiempo real con SSE

### ¿Qué es?

Actualmente, el dashboard carga los datos cuando el usuario entra a la ruta. Si otro usuario registra un evento mientras tanto, el dashboard del primer usuario no se actualiza hasta que hace refresh manual de la página.

Esta automatización implementa **Server-Sent Events (SSE)**, una tecnología simple que permite al backend enviar notificaciones al frontend cuando hay cambios, para que el dashboard se refresque automáticamente.

### ¿Qué problema resuelve?

- **Información desactualizada:** El dashboard puede mostrar datos de hace minutos u horas si el usuario no refresca.
- **Mala experiencia en equipo:** Cuando varios operadores trabajan simultáneamente, cada uno ve una versión diferente del sistema.
- **Necesidad de refrescar manualmente:** El usuario tiene que presionar F5 o hacer clic en un botón de recargar para ver los cambios.

### ¿Cómo se ve desde el frontend?

1. El usuario abre el dashboard y ve los datos normalmente
2. En otro navegador, otro usuario registra un evento RIEGO en un lote
3. **Automáticamente, sin que el primer usuario haga nada**, el dashboard se actualiza:
   - El gráfico de eventos del último mes se refresca con el nuevo dato
   - Los contadores de lotes por estado se recalculan
   - Las tarjetas de estado de lotes se actualizan
4. No hay ningún spinner de carga ni interrupción visual — los datos simplemente cambian

### ¿Qué ocurre internamente?

- Cuando un usuario abre el dashboard, el frontend abre una conexión SSE con el backend
- Cuando cualquier servicio (EventService, LotService, CropService) crea, actualiza o elimina un registro, emite un evento SSE con el tipo de cambio
- El frontend escucha estos eventos y, según el tipo, decide qué parte del dashboard refrescar
- SSE es más simple que WebSockets: usa HTTP estándar, no requiere librerías especiales, y funciona con proxies y firewalls sin configuración adicional

### Cambios generales necesarios

- **Backend:** Nuevo servicio `SseService` que gestiona las conexiones activas y permite emitir eventos; nuevo endpoint `GET /api/sse/subscribe` para que los clientes se conecten; modificar `EventService`, `LotService`, `CropService` para emitir eventos SSE después de cada operación de escritura
- **Frontend:** Modificar el servicio de dashboard para abrir una conexión SSE al entrar a la ruta y cerrarla al salir; al recibir eventos, refrescar los datos correspondientes

### ¿Para qué sirve?

Para que el dashboard refleje los cambios en tiempo real sin que el usuario tenga que refrescar manualmente, mejorando la experiencia de uso en entornos con múltiples operadores simultáneos.

---

## 7. JaCoCo — Medición de cobertura de tests

### ¿Qué es?

JaCoCo (Java Code Coverage) es una herramienta que mide qué porcentaje del código fuente está siendo ejecutado por los tests unitarios. No modifica el comportamiento del sistema, sino que **genera reportes visuales** que muestran qué líneas de código están cubiertas por tests y cuáles no.

### ¿Qué problema resuelve?

- **Código sin tests:** Sin una métrica objetiva, es fácil agregar código nuevo sin escribir tests y que nadie lo note.
- **Calidad invisible:** No hay manera de saber si el proyecto está bien testeado o no.
- **Regresión silenciosa:** Un refactor puede romper funcionalidades sin que los tests lo detecten si no hay cobertura suficiente.

### ¿Cómo se ve?

1. Después de ejecutar `mvn test`, se genera automáticamente un reporte HTML en `target/site/jacoco/index.html`
2. Al abrirlo en el navegador, se ve un **dashboard visual** con:
   - Porcentaje general de cobertura (ej: 85% de líneas cubiertas)
   - Porcentaje por paquete (controller, service, entity, mapper)
   - Porcentaje por archivo individual
3. Al hacer clic en un archivo (ej: `CropService.java`), se ve el código fuente con:
   - **Líneas en verde:** ejecutadas por al menos un test
   - **Líneas en rojo:** nunca ejecutadas por ningún test
   - **Líneas en amarillo:** parcialmente cubiertas (ej: solo una rama de un if)
4. Además, el build falla si la cobertura baja del umbral configurado (ej: menos de 70% de líneas)

### Cambios generales necesarios

- **Backend:** Agregar el plugin JaCoCo en el `pom.xml` con la configuración de umbrales mínimo
- **CI:** Agregar un paso en el workflow de GitHub Actions para subir el reporte como artifact descargable

### ¿Para qué sirve?

Para tener una métrica objetiva y visible de la calidad de los tests, incentivar a escribir tests para el código nuevo, y evitar que el código sin probar llegue a producción.

---

## 8. Pre-commit hooks con Husky y lint-staged

### ¿Qué es?

Un **pre-commit hook** es un script que se ejecuta automáticamente antes de que un `git commit` se complete. Si el script falla, el commit se rechaza.

Usando **Husky** (herramienta que gestiona hooks de git) y **lint-staged** (que ejecuta comandos solo en los archivos modificados), esta automatización ejecuta `prettier --check` sobre los archivos que se están commitendo.

### ¿Qué problema resuelve?

- **Código mal formateado en el repositorio:** Sin un hook, es fácil olvidar ejecutar `npm run lint` antes de comitear.
- **CI fallando por formato:** Es frustrante que el CI falle no por un error lógico sino porque Prettier esperaba comillas simples y alguien usó dobles.
- **Ruido en las revisiones:** Las diferencias de formato ensucian el diff de los PRs, haciendo más difícil revisar los cambios reales.

### ¿Cómo se ve?

1. El desarrollador hace `git add .` y luego `git commit -m "feat: agrega filtro de estado"`
2. Automáticamente, antes de que el commit se cree, se ejecuta `npx lint-staged`
3. Esto corre `prettier --check` en todos los archivos `.ts`, `.html`, `.css` que están en el staging area
4. **Si todo está bien formateado:** el commit procede normalmente, el desarrollador ni se entera
5. **Si hay un archivo mal formateado:** el commit se rechaza y la terminal muestra qué archivos tienen problemas y qué cambios espera Prettier
6. El desarrollador corre `npx prettier --write archivo.ts`, vuelve a hacer `git add`, y el commit funciona

### Cambios generales necesarios

- **Frontend solamente:** Instalar Husky y lint-staged como dependencias de desarrollo; crear archivo de configuración de Husky; agregar configuración de lint-staged en `package.json`

### ¿Para qué sirve?

Para garantizar que todo el código que llega al repositorio esté correctamente formateado, eliminando commits con errores de formato y reduciendo la fricción en las revisiones de código.

---

## 9. Reporte automático de cobertura en Pull Requests

### ¿Qué es?

Una extensión del punto 7 (JaCoCo). Después de que el CI ejecuta los tests y genera el reporte de cobertura, esta automatización **comenta automáticamente en el Pull Request** con un resumen de los resultados.

### ¿Qué problema resuelve?

- **Visibilidad en el PR:** Sin esto, para ver la cobertura hay que descargar el artifact de CI y abrir el HTML localmente. Con el reporte automático, la información está en el mismo PR.
- **Feedback inmediato:** El revisor del PR ve inmediatamente si el código nuevo está testeado adecuadamente o no.
- **Cultura de calidad:** Saber que la cobertura se va a publicar automáticamente incentiva a los desarrolladores a escribir tests.

### ¿Cómo se ve?

1. Un desarrollador crea un Pull Request en GitHub
2. El CI se ejecuta automáticamente, corre los tests con JaCoCo
3. Cuando termina, GitHub Actions agrega un **comentario en el PR** como este:

   > ✅ **Code Coverage: 82%**
   >
   > | Métrica | Valor |
   > |---|---|
   > | Líneas cubiertas | 82% |
   > | Umbral mínimo | 70% |
   >
   > Reporte detallado: descargar artifact `jacoco-report`

4. Si la cobertura está por debajo del umbral (ej: 65%):

   > ❌ **Code Coverage: 65%** — por debajo del umbral (70%)
   >
   > | Métrica | Valor |
   > |---|---|
   > | Líneas cubiertas | 65% |
   > | Umbral mínimo | 70% |
   >
   > Es necesario agregar tests antes de mergear.

5. El revisor ve esto directamente en la conversación del PR y decide si acepta o pide más tests

### Cambios generales necesarios

- **CI (GitHub Actions):** Modificar el workflow del backend para extraer el porcentaje de cobertura del reporte JaCoCo y comentar el PR usando `actions/github-script`

### ¿Para qué sirve?

Para que la métrica de cobertura sea visible directamente en cada Pull Request, dando feedback inmediato a desarrolladores y revisores sobre la calidad de los tests del código propuesto.

---

## Resumen de esfuerzo total estimado

| # | Automación | Tipo | Esfuerzo estimado | ¿Se ve en UI? |
|---|---|---|---|---|
| 1 | EventTypes por Crop | Interna | 4 horas | Sí |
| 2 | Alertas de inactividad | Interna | 5 horas | Sí |
| 3 | PDF al cosechar | Interna | 4 horas | Sí |
| 4 | Cosecha próxima | Interna | 2 horas | Sí |
| 5 | Auto-status del lote | Interna | 2 horas | Sí |
| 6 | Dashboard en tiempo real | Interna | 3 horas | Sí |
| 7 | JaCoCo | DevOps | 30 minutos | Reporte HTML |
| 8 | Pre-commit hooks | DevOps | 15 minutos | Terminal |
| 9 | Reporte en PRs | DevOps | 1 hora | GitHub PR |
| | **Total** | | **~22 horas** | |

## Orden de implementación sugerido

1. **Punto 5** (auto-status) — Rápido, visible, desbloquea el filtro en la UI
2. **Punto 7** (JaCoCo) — 30 minutos, da métrica de calidad inmediata
3. **Punto 8** (pre-commit hooks) — 15 minutos, código siempre limpio
4. **Punto 1** (EventTypes por Crop) — Base para las siguientes automatizaciones
5. **Punto 2** (Alertas inactividad) — La más impactante para el usuario final
6. **Punto 4** (Cosecha próxima) — Rápida porque reusa el sistema de alertas del punto 2
7. **Punto 3** (PDF) — Reportes automáticos, valor documental
8. **Punto 6** (SSE) — Dashboard en tiempo real, mejora UX
9. **Punto 9** (Reporte en PRs) — Cierra el ciclo de calidad
