> **Especificación de requisitos de software**

#### Proyecto: Invernadero {#proyecto-invernadero .unnumbered}

# Instrucciones para el uso de este formato {#instrucciones-para-el-uso-de-este-formato .unnumbered}

> *Este formato es una plantilla tipo para documentos de requisitos del software. Está basado y es conforme con el estándar IEEE Std 830-1998.*
>
> *Las secciones que no se consideren aplicables al sistema descrito podrán de forma justificada indicarse como no aplicables (NA).*
>
> *Notas:*
>
> *Los textos en color azul son indicaciones que deben eliminarse y, en su caso, sustituirse por los contenidos descritos en cada apartado.*
>
> *Los textos entre corchetes del tipo "\[Inserte aquí el texto\]" permiten la inclusión directa de texto con el color y estilo adecuado a la sección, al pulsar sobre ellos con el puntero del ratón.*
>
> *Los títulos y subtítulos de cada apartado están definidos como estilos de MS Word, de forma que su numeración consecutiva se genera automáticamente según se trate de estilos "Titulo1, Titulo2 y Titulo3".*
>
> *La sangría de los textos dentro de cada apartado se genera automáticamente al pulsar Intro al final de la línea de título. (Estilos Normal indentado1, Normal indentado 2 y Normal indentado 3).*
>
> *El índice del documento es una tabla de contenido que MS Word actualiza tomando como criterio los títulos del documento.*
>
> *Una vez terminada su redacción debe indicarse a Word que actualice todo su contenido para reflejar el contenido definitivo.*

[]{#_heading=h.7lflz0oo1og2 .anchor}

# Contenido {#contenido .unnumbered}

> [**FICHA DEL DOCUMENTO** **3**](#_heading=h.7lflz0oo1og2)
>
> [**CONTENIDO** **4**](#_heading=h.9vdxnk28w5eo)

1.  [**INTRODUCCIÓN** **6**](#introducción)

    1.  [**Propósito** **6**](#propósito)

    2.  [**Alcance** **6**](#alcance)

    3.  [**Personal involucrado** **6**](#_heading=h.iw0qh9za2n2z)

    4.  [**Definiciones, acrónimos y abreviaturas** **7**](#definiciones-acrónimos-y-abreviaturas)

    5.  [**Referencias** **7**](#_heading=h.j20z1p6g5zpx)

    6.  [**Resumen** **7**](#_heading=h.t2esckbicyvr)

2.  [**DESCRIPCIÓN GENERAL** **7**](#_heading=h.brqp65jl8hvp)

    1.  [**Perspectiva del producto** **7**](#_heading=h.qi5eszvizf6w)

    2.  [**Funcionalidad del producto** **8**](#_heading=h.hclxtbrvq4y3)

    3.  [**Características de los usuarios** **8**](#_heading=h.cmhruqnt3i35)

    4.  [**Restricciones** **9**](#_heading=h.wksgodeliq1v)

    5.  [**Suposiciones y dependencias** **9**](#_heading=h.pvg2auxyajna)

3.  [**REQUISITOS ESPECÍFICOS** **9**](#_heading=h.a4wwkfszefqg)

    1.  [**Requisitos comunes de las interfaces** **17**](#_heading=h.ypvjbxoap2lp)

        1.  [Interfaces de usuario 17](#_heading=h.g5m4zp49z6j3)

        2.  [Interfaces de hardware 17](#_heading=h.bqqtrubcgljx)

        3.  [Interfaces de software 17](#_heading=h.p1bho2zhi4bx)

        4.  [Interfaces de comunicación 17](#_heading=h.uylrn3kb11zd)

    2.  **Requerimientos funcionales 17**

        1.  [Requisito funcional 1 17](#_heading=h.fbeigesi1s9c)

        2.  [Requisito funcional 2 17](#_heading=h.ff5aico4z90q)

        3.  [Requisito funcional 3 18](#_heading=h.7r2wh9w1oas4)

        4.  [Requisito funcional 4 18](#_heading=h.stpr7z6olgrt)

        5.  [Requisito funcional 5 18](#_heading=h.rjy8b8joambz)

        6.  [Requisito funcional 6 19](#_heading=h.el06qgw2bhn)

        7.  [Requisito funcional 7 19](#_heading=h.xjlnmzbui2fg)

> Descripción de requisitos del sofware

8.  [Requisito funcional 8 19](#_heading=h.i4nyf37shiso)

9.  [Requisito funcional 9 19](#_heading=h.ofc8p3bmtv55)

<!-- -->

3.  **Requerimientos no funcionales 19**

    1.  [Requisitos de rendimiento 19](#_heading=h.rqiftcnzrtm2)

    2.  [Seguridad 20](#_heading=h.e7ww0xcc99b6)

    3.  [Fiabilidad 20](#_heading=h.cne49jy5qqne)

    4.  [Disponibilidad 20](#_heading=h.xbxheiirtpig)

    5.  [Mantenibilidad 20](#_heading=h.bfbaswfsuhps)

    6.  [Portabilidad 20](#_heading=h.974jreb91x78)

> Descripción de requisitos del sofware

# Introducción

La especificación ha sido elaborada siguiendo las directrices del estándar IEEE Std 830-1998: Práctica Recomendada para Especificaciones de Requisitos Software.

## Propósito

Este documento establece los requerimientos funcionales y no funcionales de un sistema de gestión de invernaderos que permite administrar el ciclo completo de producción agrícola, desde la siembra hasta la cosecha, con monitoreo de progreso y niveles de inactividad.

## Alcance

El sistema permite:

- Gestión de usuarios con control de roles (ADMIN, OPERATOR, VIEWER)

- Administración del catálogo de cultivos

- Control de lotes y parcelas dentro del invernadero

- Registro y seguimiento de eventos agrícolas

- Visualización de métricas y dashboard en tiempo real

## Definiciones, acrónimos y abreviaturas

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 85%" />
</colgroup>
<tbody>
<tr class="odd">
<td><blockquote>
<p><em><strong>Término</strong></em></p>
</blockquote></td>
<td><em><strong>Descripción</strong></em></td>
</tr>
<tr class="even">
<td><blockquote>
<p>JWT</p>
</blockquote></td>
<td><blockquote>
<p>JSON Web Token - Método de autenticación</p>
</blockquote></td>
</tr>
<tr class="odd">
<td><blockquote>
<p>CRUD</p>
</blockquote></td>
<td><blockquote>
<p>Create, Read, Update, Delete</p>
</blockquote></td>
</tr>
<tr class="even">
<td><blockquote>
<p>FK</p>
</blockquote></td>
<td><blockquote>
<p>Foreign Key - Clave Foránea</p>
</blockquote></td>
</tr>
<tr class="odd">
<td><blockquote>
<p>PK</p>
</blockquote></td>
<td><blockquote>
<p>Primary Key - Clave Primaria</p>
</blockquote></td>
</tr>
<tr class="even">
<td><blockquote>
<p>API</p>
</blockquote></td>
<td><blockquote>
<p>Application Programming Interface</p>
</blockquote></td>
</tr>
<tr class="odd">
<td><blockquote>
<p>REST</p>
</blockquote></td>
<td><blockquote>
<p>Representational State Transfer</p>
</blockquote></td>
</tr>
</tbody>
</table>

#  {#section .unnumbered}

# Módulos del sistema

| **Código** | **Módulo**          | **Descripción**                                      | **Prioridad** |
|------------|---------------------|------------------------------------------------------|---------------|
| AUTH       | Autenticación       | Login, validación de credenciales, generación de JWT | Alta          |
| USR        | Gestión de Usuarios | CRUD de usuarios, control de roles y estados         | Alta          |
| CRP        | Gestión de Cultivos | Catálogo de cultivos, validación de unicidad         | Alta          |
| LOT        | Gestión de Lotes    | CRUD de lotes, cálculo de estados y progreso         | Alta          |
| EVT        | Gestión de Eventos  | Registro de eventos, validaciones de secuencia       | Alta          |
| EVT-TYPE   | Tipos de Evento     | Catálogo de tipos de eventos                         | Alta          |
| DSH        | Dashboard           | Métricas, gráficos y visualización de datos          | Alta          |

**3. Requisitos Específicos**

**Requerimientos Funcionales**

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>AUTH-RF-01 — Inicio de Sesión de Usuario</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> AUTH-RF-01</p>
<p><strong>Nombre del requerimiento:</strong> Inicio de sesión con generación de JWT</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Autenticación (AUTH)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir a los usuarios autenticarse en el sistema mediante credenciales (email y password), generando un token JWT válido para todas las requests subsecuentes.</p>
<p><strong>Entradas:</strong></p>
<ol type="1">
<li><p>Email del usuario (identificador único)</p></li>
<li><p>Contraseña del usuario</p></li>
</ol>
<p><strong>Precondiciones:</strong></p>
<ol type="1">
<li><p>El usuario debe existir en la base de datos</p></li>
<li><p>El usuario debe tener el campo active en true</p></li>
<li><p>Las credenciales deben ser válidas</p></li>
</ol>
<p><strong>Validaciones y Reglas:</strong></p>
<ol type="1">
<li><p><strong>Formato de email:</strong> Validar que el email tenga formato válido</p></li>
<li><p><strong>Usuario existente:</strong> Verificar que el email exista en la base de datos</p></li>
<li><p><strong>Usuario activo:</strong> Verificar que el usuario tenga active = true</p></li>
<li><p><strong>Contraseña válida:</strong> Validar la contraseña contra BCrypt hash almacenado</p></li>
</ol>
<p><strong>Flujo Principal:</strong></p>
<ol type="1">
<li><p>El usuario ingresa email y contraseña en la interfaz de login</p></li>
<li><p>El sistema valida las credenciales usando Spring Authentication Manager</p></li>
<li><p>Si las credenciales son válidas, el sistema genera un JWT usando JwtService</p></li>
<li><p>El sistema retorna el token JWT al cliente</p></li>
<li><p>El cliente debe incluir el token en el header Authorization: Bearer &lt;token&gt; para requests subsecuentes</p></li>
</ol>
<p><strong>Excepciones / Errores:</strong></p>
<ul>
<li><p><strong>Credenciales inválidas:</strong> Cuando el email o contraseña son incorrectos</p></li>
<li><p><strong>Usuario no encontrado:</strong> Cuando el email no existe en la base de datos</p></li>
<li><p><strong>Usuario inactivo:</strong> Cuando el usuario tiene active = false</p></li>
</ul>
<p><strong>Postcondiciones:</strong></p>
<ol type="1">
<li><p>El usuario recibe un token JWT válido</p></li>
<li><p>El token debe ser usado en todas las requests autenticadas</p></li>
<li><p>El token tiene una vigencia configurada (expira después de un tiempo)</p></li>
</ol>
<p><strong>Salidas Esperadas:</strong></p>
<ol type="1">
<li><p>Token JWT válido (string)</p></li>
<li><p>Mensaje de error si la autenticación falla</p></li>
</ol></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir la autenticación de usuarios mediante credenciales (email y contraseña), validando su existencia y estado activo en la base de datos, y retornando un token JWT para uso en requests subsecuentes.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01 RNF-02</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>AUTH-RF-02 — Validación de Token JWT</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> AUTH-RF-02</p>
<p><strong>Nombre del requerimiento:</strong> Validación de token JWT en cada request</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Autenticación (AUTH)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Validar el token JWT en cada request protegida para asegurar que el usuario está autenticado y tiene los permisos adecuados.</p>
<p><strong>Entradas:</strong></p>
<p>1. Token JWT en el header Authorization</p>
<p><strong>Precondiciones:</strong></p>
<ol type="1">
<li><p>El token debe existir y estar en formato correcto (Bearer token)</p></li>
<li><p>El token no debe haber expirado</p></li>
</ol>
<p><strong>Validaciones y Reglas:</strong></p>
<ol type="1">
<li><p><strong>Token presente:</strong> Verificar que el header Authorization exista</p></li>
<li><p><strong>Formato válido:</strong> Verificar que el token tenga el prefijo "Bearer "</p></li>
<li><p><strong>Firma válida:</strong> Verificar que el token fue firmado con la clave secreta correcta</p></li>
<li><p><strong>Token no expirado:</strong> Verificar que la fecha de expiración sea posterior a la actual</p></li>
</ol>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El cliente envía una request con el header Authorization</p></li>
<li><p>El JwtAuthenticationFilter intercepta la request</p></li>
<li><p>El filtro valida el token usando JwtService</p></li>
<li><p>Si el token es válido, se cargan las autoridades del usuario y se configura el SecurityContext</p></li>
<li><p>La request continúa al controlador correspondiente</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<ul>
<li><p><strong>Token expirado:</strong> El token ha superado su tiempo de validez</p></li>
<li><p><strong>Token inválido:</strong> El token no fue generado por el sistema o fue manipulado</p></li>
<li><p><strong>Token no proporcionado:</strong> No se incluyó el header Authorization</p></li>
</ul>
<p><strong>Postcondiciones:</strong></p>
<ul>
<li><p>El usuario autenticado queda configurado en el contexto de seguridad</p></li>
<li><p>Los filtros de autorización verifican los roles del usuario</p></li>
</ul>
<p><strong>Salidas Esperadas:</strong></p>
<ul>
<li><p>Request procesada si el token es válido</p></li>
<li><p>Error 401/403 si el token es inválido o no tiene permisos</p></li>
</ul></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe interceptar cada request protegida y validar el token JWT incluido en el header Authorization, verificando su firma, formato y vigencia antes de permitir el acceso al recurso.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01 RNF-02</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>USR-RF-01 — Crear Usuario</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> USR-RF-01</p>
<p><strong>Nombre del requerimiento:</strong> Crear nuevo usuario en el sistema</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Usuarios (USR)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la creación de nuevos usuarios con roles específicos (ADMIN, OPERATOR, VIEWER).</p>
<p><strong>Entradas:</strong></p>
<ul>
<li><p>name: Nombres del usuario (String, obligatorio)</p></li>
<li><p>lastName: Apellidos del usuario (String, obligatorio)</p></li>
<li><p>email: Correo electrónico (String, único, obligatorio)</p></li>
<li><p>password: Contraseña (String, obligatorio)</p></li>
<li><p>role: Rol del usuario (Enum: ADMIN, OPERATOR, VIEWER, obligatorio)</p></li>
</ul>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado con rol ADMIN</p></li>
<li><p>El email no debe existir en la base de datos</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Email único:</strong> No puede existir otro usuario con el mismo email</p></li>
<li><p><strong>Campos obligatorios:</strong> Todos los campos marcados como obligatorios deben estar presentes</p></li>
<li><p><strong>Formato de email:</strong> Validar formato de email válido</p></li>
<li><p><strong>Rol válido:</strong> El rol debe ser uno de los valores permitidos (ADMIN, OPERATOR, VIEWER)</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El administrador ingresa los datos del nuevo usuario</p></li>
<li><p>El sistema valida que el email sea único</p></li>
<li><p>El sistema encripta la contraseña usando BCrypt</p></li>
<li><p>El sistema crea el usuario con active = true por defecto</p></li>
<li><p>El sistema guarda el usuario en la base de datos</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<ul>
<li><p><strong>Email ya existe:</strong> Ya existe un usuario con el email proporcionado</p></li>
<li><p><strong>Campos obligatorios faltantes:</strong> Algún campo obligatorio no fue proporcionado</p></li>
</ul>
<p><strong>Postcondiciones:</strong></p>
<ul>
<li><p>El nuevo usuario queda registrado en la base de datos</p></li>
<li><p>El usuario puede autenticarse inmediatamente</p></li>
</ul>
<p><strong>Salidas Esperadas:</strong></p>
<ul>
<li><p>Usuario creado con todos sus datos</p></li>
<li><p>Response con el usuario creado (sin password)</p></li>
</ul></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir al administrador registrar nuevos usuarios asignándoles un rol específico, validando unicidad del email y encriptando la contraseña antes de persistir el registro.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01 RNF-02</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>USR-RF-02 — Listar Todos los Usuarios</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> USR-RF-02</p>
<p><strong>Nombre del requerimiento:</strong> Obtener lista de todos los usuarios del sistema</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Usuarios (USR)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la visualización de todos los usuarios registrados en el sistema.</p>
<p><strong>Entradas:</strong></p>
<p>No requiere parámetros de entrada</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Autenticación:</strong> El usuario debe tener un token JWT válido</p></li>
<li><p><strong>Permisos:</strong> Solo ADMIN y OPERATOR pueden listar usuarios</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado solicita la lista de usuarios</p></li>
<li><p>El sistema consulta todos los usuarios en la base de datos</p></li>
<li><p>El sistema retorna la lista de usuarios (sin passwords)</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>No autorizado:</strong> El usuario no tiene permisos para ver la lista</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna la lista completa de usuarios</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lista de usuarios con id, name, lastName, email, role, active</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir a usuarios con rol ADMIN u OPERATOR obtener la lista completa de usuarios registrados, excluyendo información sensible como contraseñas.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>USR-RF-03 — Obtener Usuario por ID</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> USR-RF-03</p>
<p><strong>Nombre del requerimiento:</strong> Obtener detalles de un usuario específico</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Usuarios (USR)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Obtener los detalles de un usuario específico por su identificador.</p>
<p><strong>Entradas:</strong></p>
<p>id: Identificador único del usuario (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado</p></li>
<li><p>El usuario debe existir en la base de datos</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ol start="5" type="1">
<li><p><strong>Usuario existente:</strong> Verificar que el usuario con el ID proporcionado exista</p></li>
</ol>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado proporciona el ID del usuario</p></li>
<li><p>El sistema busca el usuario por su ID</p></li>
<li><p>El sistema retorna los datos del usuario</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Usuario no encontrado:</strong> No existe un usuario con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna los datos del usuario solicitado</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Datos del usuario (sin password)</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir consultar los datos de un usuario específico mediante su ID, retornando toda la información excepto la contraseña.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>USR-RF-04 — Actualizar Usuario</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> USR-RF-04</p>
<p><strong>Nombre del requerimiento:</strong> Actualizar información de un usuario existente</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Usuarios (USR)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la actualización de la información de un usuario existente.</p>
<p><strong>Entradas:</strong></p>
<ul>
<li><p>id: Identificador único del usuario (Long, obligatorio)</p></li>
<li><p>name: Nombres del usuario (String, opcional)</p></li>
<li><p>lastName: Apellidos del usuario (String, opcional)</p></li>
<li><p>email: Correo electrónico (String, opcional)</p></li>
<li><p>role: Rol del usuario (Enum, opcional)</p></li>
<li><p>active: Estado de activación (Boolean, opcional)</p></li>
</ul>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado</p></li>
<li><p>El usuario a actualizar debe existir</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Usuario existente:</strong> Verificar que el usuario exista</p></li>
<li><p><strong>Email único:</strong> Si se proporciona un nuevo email, debe ser único</p></li>
<li><p><strong>Rol válido:</strong> El rol debe ser uno de los valores permitidos</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario proporciona el ID y los campos a actualizar</p></li>
<li><p>El sistema busca el usuario existente</p></li>
<li><p>El sistema actualiza solo los campos proporcionados</p></li>
<li><p>El sistema guarda los cambios</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<ul>
<li><p><strong>Usuario no encontrado:</strong> No existe un usuario con el ID proporcionado</p></li>
<li><p><strong>Email ya en uso:</strong> El nuevo email ya pertenece a otro usuario</p></li>
</ul>
<p><strong>Postcondiciones:</strong></p>
<p>Los datos del usuario quedan actualizados</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Usuario con los datos actualizados</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir la actualización parcial de los datos de un usuario existente, validando la unicidad del email en caso de ser modificado.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>USR-RF-05 — Eliminar Usuario (Soft Delete)</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> USR-RF-05</p>
<p><strong>Nombre del requerimiento:</strong> Desactivar usuario sin eliminarlo del sistema</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Usuarios (USR)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Desactivar un usuario cambiando su campo active a false, sin eliminar el registro de la base de datos (soft delete).</p>
<p><strong>Entradas:</strong></p>
<p>id: Identificador único del usuario (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado con rol ADMIN</p></li>
<li><p>El usuario a eliminar debe existir y debe estar activo</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Usuario existente:</strong> Verificar que el usuario exista</p></li>
<li><p><strong>Usuario activo:</strong> Solo se pueden desactivar usuarios activos</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El administrador proporciona el ID del usuario a eliminar</p></li>
<li><p>El sistema busca el usuario</p></li>
<li><p>El sistema cambia el campo active a false</p></li>
<li><p>El sistema guarda los cambios</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Usuario no encontrado:</strong> No existe un usuario con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<ul>
<li><p>El usuario queda marcado como inactivo</p></li>
<li><p>El usuario no puede autenticarse</p></li>
</ul>
<p><strong>Salidas Esperadas:</strong></p>
<p>Confirmación de eliminación exitosa</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe implementar eliminación lógica de usuarios (soft delete), cambiando el campo active a false sin borrar el registro, impidiendo posteriores autenticaciones.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>CRP-RF-01 — Crear Cultivo</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> CRP-RF-01</p>
<p><strong>Nombre del requerimiento:</strong> Crear nuevo cultivo en el catálogo</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Cultivos (CRP)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la creación de nuevos tipos de cultivo con sus parámetros de crecimiento.</p>
<p><strong>Entradas:</strong></p>
<ul>
<li><p>name: Nombre del cultivo (String, obligatorio, único)</p></li>
<li><p>description: Descripción del cultivo (String, opcional)</p></li>
<li><p>inactivityDaysThreshold: Días máximos de inactividad (Integer, obligatorio)</p></li>
<li><p>estimatedGrowthDays: Días estimados de crecimiento (Integer, obligatorio)</p></li>
</ul>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado con rol ADMIN u OPERATOR</p></li>
<li><p>El nombre del cultivo debe ser único</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Nombre único:</strong> No puede existir otro cultivo con el mismo nombre</p></li>
<li><p><strong>Campos obligatorios:</strong> inactivityDaysThreshold y estimatedGrowthDays son obligatorios</p></li>
<li><p><strong>Valores positivos:</strong> inactivityDaysThreshold y estimatedGrowthDays deben ser mayores a 0</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario ingresa los datos del cultivo</p></li>
<li><p>El sistema verifica que el nombre sea único</p></li>
<li><p>El sistema crea el cultivo con los parámetros proporcionados</p></li>
<li><p>El sistema guarda el cultivo en la base de datos</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<ul>
<li><p><strong>Nombre duplicado:</strong> Ya existe un cultivo con ese nombre</p></li>
<li><p><strong>Campos obligatorios faltantes:</strong> No se proporcionaron los días requeridos</p></li>
</ul>
<p><strong>Postcondiciones:</strong></p>
<p>El cultivo queda registrado y disponible para asociar a lotes</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Cultivo creado con todos sus datos</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir registrar nuevos cultivos con sus parámetros de crecimiento e inactividad, validando la unicidad del nombre antes de persistir el registro.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>CRP-RF-02 — Validar Nombre Único de Cultivo</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> CRP-RF-02</p>
<p><strong>Nombre del requerimiento:</strong> Validar que el nombre del cultivo sea único antes de crear</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Cultivos (CRP)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Asegurar la integridad de los datos validando que no existan cultivos con el mismo nombre.</p>
<p><strong>Entradas:</strong></p>
<p>name: Nombre del cultivo a validar (String, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<p>Ninguna (puede ejecutarse antes de crear para validación en tiempo real)</p>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Unicidad del nombre:</strong> Verificar que no exista ningún cultivo con el nombre proporcionado</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El sistema recibe el nombre del cultivo</p></li>
<li><p>El sistema consulta si existe algún cultivo con ese nombre</p></li>
<li><p>Si existe, lanza una excepción</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Ya existe un cultivo con ese nombre:</strong> El nombre ya está en uso</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema permite o rechaza la operación</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Ninguna (valida y lanza excepción si hay conflicto)</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe verificar que no exista un cultivo con el mismo nombre antes de permitir su creación, garantizando la integridad del catálogo.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional (Validación)</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>CRP-RF-03 — Listar Todos los Cultivos</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> CRP-RF-03</p>
<p><strong>Nombre del requerimiento:</strong> Obtener lista de todos los cultivos del catálogo</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Cultivos (CRP)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la visualización de todos los cultivos disponibles en el sistema.</p>
<p><strong>Entradas:</strong></p>
<p>No requiere parámetros de entrada</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Autenticación:</strong> El usuario debe tener un token JWT válido</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado solicita la lista de cultivos</p></li>
<li><p>El sistema consulta todos los cultivos en la base de datos</p></li>
<li><p>El sistema retorna la lista de cultivos</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>No autorizado:</strong> El usuario no tiene permisos para ver la lista</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna la lista completa de cultivos</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lista de cultivos con id, name, description, inactivityDaysThreshold, estimatedGrowthDays</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe retornar la lista completa de cultivos registrados en el catálogo, disponible para cualquier usuario autenticado.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>CRP-RF-04 — Obtener Cultivo por ID</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> CRP-RF-04</p>
<p><strong>Nombre del requerimiento:</strong> Obtener detalles de un cultivo específico</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Cultivos (CRP)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Obtener los detalles de un cultivo específico por su identificador.</p>
<p><strong>Entradas:</strong></p>
<p>id: Identificador único del cultivo (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado</p></li>
<li><p>El cultivo debe existir en la base de datos</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Cultivo existente:</strong> Verificar que el cultivo con el ID proporcionado exista</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado proporciona el ID del cultivo</p></li>
<li><p>El sistema busca el cultivo por su ID</p></li>
<li><p>El sistema retorna los datos del cultivo</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Cultivo no encontrado:</strong> No existe un cultivo con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna los datos del cultivo solicitado</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Datos completos del cultivo</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir consultar los datos completos de un cultivo específico mediante su identificador único.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>CRP-RF-05 — Actualizar Cultivo</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> CRP-RF-05</p>
<p><strong>Nombre del requerimiento:</strong> Actualizar información de un cultivo existente</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Cultivos (CRP)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la actualización de la información de un cultivo existente.</p>
<p><strong>Entradas:</strong></p>
<ul>
<li><p>id: Identificador único del cultivo (Long, obligatorio)</p></li>
<li><p>name: Nombre del cultivo (String, opcional)</p></li>
<li><p>description: Descripción del cultivo (String, opcional)</p></li>
<li><p>inactivityDaysThreshold: Días de inactividad (Integer, opcional)</p></li>
<li><p>estimatedGrowthDays: Días de crecimiento (Integer, opcional)</p></li>
</ul>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado con rol ADMIN u OPERATOR</p></li>
<li><p>El cultivo a actualizar debe existir</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Cultivo existente:</strong> Verificar que el cultivo exista</p></li>
<li><p><strong>Nombre único:</strong> Si se proporciona un nuevo nombre, debe ser único</p></li>
<li><p><strong>Valores positivos:</strong> Los valores numéricos deben ser mayores a 0</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario proporciona el ID y los campos a actualizar</p></li>
<li><p>El sistema busca el cultivo existente</p></li>
<li><p>El sistema actualiza solo los campos proporcionados (actualización parcial)</p></li>
<li><p>El sistema guarda los cambios</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<ul>
<li><p><strong>Cultivo no encontrado:</strong> No existe un cultivo con el ID proporcionado</p></li>
<li><p><strong>Nombre ya en uso:</strong> El nuevo nombre ya pertenece a otro cultivo</p></li>
</ul>
<p><strong>Postcondiciones:</strong></p>
<p>Los datos del cultivo quedan actualizados</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Cultivo con los datos actualizados</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir la actualización parcial de los datos de un cultivo existente, validando la unicidad del nombre si es modificado y que los valores numéricos sean positivos.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>CRP-RF-06 — Eliminar Cultivo</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> CRP-RF-06</p>
<p><strong>Nombre del requerimiento:</strong> Eliminar un cultivo del sistema</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Cultivos (CRP)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la eliminación de un cultivo del catálogo.</p>
<p><strong>Entradas:</strong></p>
<p>id: Identificador único del cultivo (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado con rol ADMIN u OPERATOR</p></li>
<li><p>El cultivo debe existir en la base de datos</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ol start="6" type="1">
<li><p><strong>Cultivo existente:</strong> Verificar que el cultivo exista</p></li>
</ol>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario proporciona el ID del cultivo a eliminar</p></li>
<li><p>El sistema busca el cultivo</p></li>
<li><p>El sistema elimina el cultivo de la base de datos</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Cultivo no encontrado:</strong> No existe un cultivo con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El cultivo es eliminado (con cascade a lotes si aplica)</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Confirmación de eliminación exitosa</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir la eliminación definitiva de un cultivo del catálogo, aplicando eliminación en cascada a los lotes asociados cuando corresponda.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>LOT-RF-01 — Crear Lote</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> LOT-RF-01</p>
<p><strong>Nombre del requerimiento:</strong> Crear nuevo lote de cultivo</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Lotes (LOT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la creación de nuevos lotes de cultivo asociados a un cultivo específico.</p>
<p><strong>Entradas:</strong></p>
<ul>
<li><p>name: Nombre identificador del lote (String, obligatorio)</p></li>
<li><p>cropId: Identificador del cultivo (Long, obligatorio)</p></li>
<li><p>startDate: Fecha de inicio del lote (Instant, obligatorio)</p></li>
<li><p>endDate: Fecha de fin del lote (Instant, opcional)</p></li>
</ul>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado con rol ADMIN u OPERATOR</p></li>
<li><p>El cultivo asociado debe existir en la base de datos</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Cultivo existente:</strong> Verificar que el cropId proporcionado corresponda a un cultivo válido</p></li>
<li><p><strong>Campos obligatorios:</strong> name, cropId y startDate son obligatorios</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario ingresa los datos del lote</p></li>
<li><p>El sistema verifica que el cultivo exista</p></li>
<li><p>El sistema crea el lote con los parámetros proporcionados</p></li>
<li><p>El sistema guarda el lote en la base de datos</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Cultivo no encontrado:</strong> El cropId proporcionado no corresponde a ningún cultivo</p>
<p><strong>Postcondiciones:</strong></p>
<p>El lote queda registrado y disponible para registrar eventos</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lote creado con todos sus datos</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir la creación de lotes de cultivo asociados a un cultivo existente, registrando fechas de inicio y fin del ciclo productivo.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>LOT-RF-02 — Calcular Estado del Lote</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> LOT-RF-02</p>
<p><strong>Nombre del requerimiento:</strong> Determinar el estado dinámico del lote según eventos</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Lotes (LOT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Calcular dinámicamente el estado de un lote basado en los eventos registrados (SOWING/HARVEST).</p>
<p><strong>Entradas:</strong></p>
<p>lotId: Identificador único del lote (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<p>El lote debe existir en la base de datos</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Verificar eventos SOWING:</strong> Consultar si existe evento de tipo SOWING</p></li>
<li><p><strong>Verificar eventos HARVEST:</strong> Consultar si existe evento de tipo HARVEST</p></li>
<li><p><strong>Lógica de estados:</strong> Si no existe SOWING → CREATED; Si existe SOWING y HARVEST → FINISHED; Si existe SOWING y no existe HARVEST → IN_PRODUCTION</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El sistema recibe la solicitud de obtener el estado del lote</p></li>
<li><p>El sistema consulta si existe evento SOWING para el lote</p></li>
<li><p>El sistema consulta si existe evento HARVEST para el lote</p></li>
<li><p>El sistema aplica la lógica de estados</p></li>
<li><p>El sistema retorna el estado correspondiente</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Lote no encontrado:</strong> No existe un lote con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El estado se calcula dinámicamente (no se almacena)</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>String con el estado: CREATED, IN_PRODUCTION o FINISHED</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe calcular el estado actual del lote en tiempo real, basándose en la existencia de eventos SOWING y HARVEST registrados, retornando CREATED, IN_PRODUCTION o FINISHED.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-03</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional (Cálculo)</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>LOT-RF-03 — Calcular Nivel de Inactividad del Lote</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> LOT-RF-03</p>
<p><strong>Nombre del requerimiento:</strong> Determinar el nivel de inactividad del lote</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Lotes (LOT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Calcular el nivel de inactividad de un lote basado en el tiempo transcurrido desde el último evento y el threshold definido en el cultivo.</p>
<p><strong>Entradas:</strong></p>
<p>lotId: Identificador único del lote (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El lote debe existir en la base de datos</p></li>
<li><p>El lote debe tener un cultivo asociado</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Obtener último evento:</strong> Consultar el evento más reciente del lote</p></li>
<li><p><strong>Calcular días sin eventos:</strong> Diferencia entre Instant.now() y timestamp del último evento</p></li>
<li><p><strong>Obtener threshold:</strong> Días de inactividad permitidos del cultivo asociado</p></li>
<li><p><strong>Lógica de niveles:</strong> Sin eventos → GRAY; threshold null → UNKNOWN; días &gt;= threshold → RED; días &gt;= threshold/2 → YELLOW; días &lt; threshold/2 → GREEN</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El sistema recibe la solicitud de obtener el nivel de inactividad</p></li>
<li><p>El sistema busca el último evento del lote</p></li>
<li><p>Si no hay eventos, retorna GRAY</p></li>
<li><p>Si hay eventos, calcula los días transcurridos</p></li>
<li><p>Compara con el threshold del cultivo</p></li>
<li><p>Retorna el nivel correspondiente</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Lote no encontrado:</strong> No existe un lote con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El nivel se calcula dinámicamente</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>String con el nivel: GREEN, YELLOW, RED, GRAY o UNKNOWN</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe calcular el nivel de inactividad del lote comparando los días desde el último evento con el threshold de inactividad definido en el cultivo asociado.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-03 RNF-04</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional (Cálculo)</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>LOT-RF-04 — Calcular Progreso del Cultivo</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> LOT-RF-04</p>
<p><strong>Nombre del requerimiento:</strong> Calcular el porcentaje de progreso del cultivo en el lote</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Lotes (LOT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Calcular el porcentaje de avance del cultivo basado en la fecha de siembra y la fecha estimada de cosecha.</p>
<p><strong>Entradas:</strong></p>
<p>lotId: Identificador único del lote (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El lote debe existir en la base de datos</p></li>
<li><p>El lote debe tener fecha estimada de cosecha</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Obtener evento SOWING:</strong> Buscar el evento de tipo SOWING</p></li>
<li><p><strong>Obtener fecha estimada de cosecha:</strong> Del campo estimatedHarvestDate del lote</p></li>
<li><p><strong>Calcular progreso:</strong> Sin SOWING o sin fecha → 0%; días totales &lt;= 0 → 100%; Progreso = (días transcurridos / días totales) * 100; máximo 100%</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El sistema recibe la solicitud de obtener el progreso</p></li>
<li><p>El sistema busca el evento SOWING del lote</p></li>
<li><p>Si no existe SOWING, retorna 0</p></li>
<li><p>Obtiene la fecha estimada de cosecha</p></li>
<li><p>Si no existe fecha estimada, retorna 0</p></li>
<li><p>Calcula los días totales entre SOWING y cosecha</p></li>
<li><p>Calcula los días transcurridos desde SOWING</p></li>
<li><p>Retorna el porcentaje (máximo 100%)</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Lote no encontrado:</strong> No existe un lote con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El progreso se calcula dinámicamente</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Porcentaje de progreso (double, 0-100)</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe calcular el porcentaje de avance del cultivo en el lote, comparando los días transcurridos desde la siembra con el total de días estimados hasta la cosecha.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-03 RNF-04</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional (Cálculo)</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>LOT-RF-05 — Listar Todos los Lotes</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> LOT-RF-05</p>
<p><strong>Nombre del requerimiento:</strong> Obtener lista de todos los lotes del sistema</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Lotes (LOT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la visualización de todos los lotes disponibles en el sistema.</p>
<p><strong>Entradas:</strong></p>
<p>No requiere parámetros de entrada</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Autenticación:</strong> El usuario debe tener un token JWT válido</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado solicita la lista de lotes</p></li>
<li><p>El sistema consulta todos los lotes en la base de datos</p></li>
<li><p>El sistema retorna la lista de lotes</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>No autorizado:</strong> El usuario no tiene permisos para ver la lista</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna la lista completa de lotes</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lista de lotes con id, name, cropId, startDate, endDate, estimatedHarvestDate</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe retornar la lista completa de lotes registrados, disponible para cualquier usuario autenticado.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>LOT-RF-06 — Listar Lotes por Cultivo</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> LOT-RF-06</p>
<p><strong>Nombre del requerimiento:</strong> Obtener lista de lotes filtrados por cultivo</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Lotes (LOT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la visualización de los lotes asociados a un cultivo específico.</p>
<p><strong>Entradas:</strong></p>
<p>cropId: Identificador del cultivo (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Cultivo existente:</strong> Verificar que el cultivo exista</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado proporciona el ID del cultivo</p></li>
<li><p>El sistema consulta los lotes asociados a ese cultivo</p></li>
<li><p>El sistema retorna la lista de lotes filtrados</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Cultivo no encontrado:</strong> No existe un cultivo con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna la lista de lotes del cultivo</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lista de lotes del cultivo especificado</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir filtrar los lotes por cultivo, retornando únicamente los lotes asociados al cultivo identificado.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>LOT-RF-07 — Obtener Lote por ID</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> LOT-RF-07</p>
<p><strong>Nombre del requerimiento:</strong> Obtener detalles de un lote específico</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Lotes (LOT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Obtener los detalles de un lote específico por su identificador.</p>
<p><strong>Entradas:</strong></p>
<p>id: Identificador único del lote (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado</p></li>
<li><p>El lote debe existir en la base de datos</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Lote existente:</strong> Verificar que el lote con el ID proporcionado exista</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado proporciona el ID del lote</p></li>
<li><p>El sistema busca el lote por su ID</p></li>
<li><p>El sistema retorna los datos del lote</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Lote no encontrado:</strong> No existe un lote con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna los datos del lote solicitado</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Datos completos del lote</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir consultar los datos completos de un lote específico mediante su identificador único.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>LOT-RF-08 — Actualizar Lote</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> LOT-RF-08</p>
<p><strong>Nombre del requerimiento:</strong> Actualizar información de un lote existente</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Lotes (LOT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la actualización de la información de un lote existente.</p>
<p><strong>Entradas:</strong></p>
<ul>
<li><p>id: Identificador único del lote (Long, obligatorio)</p></li>
<li><p>name: Nombre del lote (String, opcional)</p></li>
<li><p>startDate: Fecha de inicio (Instant, opcional)</p></li>
<li><p>endDate: Fecha de fin (Instant, opcional)</p></li>
</ul>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado con rol ADMIN u OPERATOR</p></li>
<li><p>El lote a actualizar debe existir</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Lote existente:</strong> Verificar que el lote exista</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario proporciona el ID y los campos a actualizar</p></li>
<li><p>El sistema busca el lote existente</p></li>
<li><p>El sistema actualiza solo los campos proporcionados (actualización parcial)</p></li>
<li><p>El sistema guarda los cambios</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Lote no encontrado:</strong> No existe un lote con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>Los datos del lote quedan actualizados</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lote con los datos actualizados</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir la actualización parcial de los datos de un lote existente, preservando los campos no incluidos en la solicitud.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>LOT-RF-09 — Eliminar Lote</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> LOT-RF-09</p>
<p><strong>Nombre del requerimiento:</strong> Eliminar un lote del sistema</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Lotes (LOT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la eliminación de un lote.</p>
<p><strong>Entradas:</strong></p>
<p>id: Identificador único del lote (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado con rol ADMIN u OPERATOR</p></li>
<li><p>El lote debe existir en la base de datos</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Lote existente:</strong> Verificar que el lote exista</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario proporciona el ID del lote a eliminar</p></li>
<li><p>El sistema busca el lote</p></li>
<li><p>El sistema elimina el lote de la base de datos</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Lote no encontrado:</strong> No existe un lote con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El lote es eliminado (con cascade a eventos)</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Confirmación de eliminación exitosa</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir la eliminación definitiva de un lote, incluyendo todos los eventos asociados mediante eliminación en cascada.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>LOT-RF-10 — Obtener Resumen del Lote</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> LOT-RF-10</p>
<p><strong>Nombre del requerimiento:</strong> Obtener resumen completo del lote con métricas</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Lotes (LOT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Obtener un resumen completo del lote incluyendo estado, inactividad, progreso, frecuencia de eventos y último evento.</p>
<p><strong>Entradas:</strong></p>
<p>lotId: Identificador único del lote (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<p>El lote debe existir en la base de datos</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Lote existente:</strong> Verificar que el lote exista</p></li>
<li><p><strong>Integración de servicios:</strong> Combinar resultados de múltiples métodos del LotService</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El sistema recibe la solicitud de obtener el resumen</p></li>
<li><p>Obtiene el lote completo</p></li>
<li><p>Calcula el estado (LOT-RF-02)</p></li>
<li><p>Calcula el nivel de inactividad (LOT-RF-03)</p></li>
<li><p>Cuenta los eventos</p></li>
<li><p>Calcula la duración en días</p></li>
<li><p>Calcula la frecuencia de eventos</p></li>
<li><p>Obtiene los detalles de progreso</p></li>
<li><p>Obtiene el último evento (tipo y fecha)</p></li>
<li><p>Retorna el resumen completo</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Lote no encontrado:</strong> No existe un lote con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>Retorna objeto LotSummary con toda la información</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Objeto LotSummary con: lotId, lotName, status, inactivityStatus, totalEvents, durationDays, eventFrequency, sowingDate, totalDays, daysElapsed, daysRemaining, estimatedHarvestDate, lastEventDate, lastEventType</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe consolidar todas las métricas del lote en un único objeto de respuesta, integrando estado, inactividad, progreso y frecuencia de eventos calculados dinámicamente.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-03 RNF-04</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional (Cálculo Compuesto)</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>EVT-RF-01 — Registrar Evento</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> EVT-RF-01</p>
<p><strong>Nombre del requerimiento:</strong> Registrar un nuevo evento en un lote</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Eventos (EVT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir el registro de eventos agrícolas (siembra, riego, cosecha, etc.) en un lote específico.</p>
<p><strong>Entradas:</strong></p>
<ul>
<li><p>lotId: Identificador del lote (Long, obligatorio)</p></li>
<li><p>type: Nombre del tipo de evento (String, obligatorio)</p></li>
<li><p>userId: Identificador del usuario que registra (Long, obligatorio)</p></li>
<li><p>timestamp: Fecha/hora del evento (Instant, obligatorio)</p></li>
<li><p>description: Descripción del evento (String, opcional)</p></li>
</ul>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado con rol ADMIN u OPERATOR</p></li>
<li><p>El lote debe existir</p></li>
<li><p>El tipo de evento debe existir</p></li>
<li><p>El usuario debe existir</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Lote existente:</strong> Verificar que el lotId corresponda a un lote válido</p></li>
<li><p><strong>Tipo de evento existente:</strong> Verificar que el tipo de evento exista</p></li>
<li><p><strong>Usuario existente:</strong> Verificar que el userId corresponda a un usuario válido</p></li>
<li><p><strong>Timestamp válido:</strong> Verificar que no sea null</p></li>
<li><p><strong>Validación de secuencia:</strong> Verificar reglas de secuencia de eventos (EVT-RF-02)</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario ingresa los datos del evento</p></li>
<li><p>El sistema valida que lote, tipo y usuario existan</p></li>
<li><p>El sistema ejecuta las validaciones de secuencia (EVT-RF-02)</p></li>
<li><p>El sistema crea el evento con timestamp de creación automático</p></li>
<li><p>Si el tipo es SOWING, calcula y guarda la fecha estimada de cosecha (EVT-RF-03)</p></li>
<li><p>El sistema guarda el evento en la base de datos</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<ul>
<li><p><strong>Lote no encontrado:</strong> El lote no existe</p></li>
<li><p><strong>Tipo de evento no encontrado:</strong> El tipo de evento no existe</p></li>
<li><p><strong>Usuario no encontrado:</strong> El usuario no existe</p></li>
<li><p><strong>Timestamp requerido:</strong> El timestamp es obligatorio</p></li>
</ul>
<p><strong>Postcondiciones:</strong></p>
<ul>
<li><p>El evento queda registrado</p></li>
<li><p>Si es SOWING, se calcula la fecha estimada de cosecha</p></li>
</ul>
<p><strong>Salidas Esperadas:</strong></p>
<p>Evento creado con todos sus datos</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir el registro de eventos agrícolas en un lote, validando la existencia de entidades relacionadas y las reglas de secuencia antes de persistir.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01 RNF-03</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>EVT-RF-02 — Validar Secuencia de Eventos</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> EVT-RF-02</p>
<p><strong>Nombre del requerimiento:</strong> Validar reglas de secuencia antes de registrar evento</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Eventos (EVT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Asegurar la integridad del flujo de eventos validando las reglas de secuencia antes de permitir el registro.</p>
<p><strong>Entradas:</strong></p>
<ul>
<li><p>lotId: Identificador del lote (Long, obligatorio)</p></li>
<li><p>typeName: Nombre del tipo de evento a registrar (String, obligatorio)</p></li>
</ul>
<p><strong>Precondiciones:</strong></p>
<p>El lote debe existir</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Verificar SOWING existente:</strong> Consultar si ya existe un evento SOWING en el lote</p></li>
<li><p><strong>Verificar HARVEST existente:</strong> Consultar si ya existe un evento HARVEST en el lote</p></li>
<li><p><strong>Reglas:</strong> HARVEST sin SOWING → RECHAZAR; segundo SOWING → RECHAZAR; lote con HARVEST → RECHAZAR</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El sistema recibe el lotId y el typeName</p></li>
<li><p>Consulta si existe SOWING en el lote</p></li>
<li><p>Consulta si existe HARVEST en el lote</p></li>
<li><p>Aplica las reglas de validación</p></li>
<li><p>Si todo es válido, permite continuar</p></li>
<li><p>Si infringe alguna regla, lanza excepción</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<ul>
<li><p><strong>No puede registrar harvest antes de siembra:</strong> Intento de HARVEST sin SOWING</p></li>
<li><p><strong>Ya existe una siembra para este lote:</strong> Intento de segundo SOWING</p></li>
<li><p><strong>Este lote ya está terminado:</strong> Intento de registrar evento en lote con HARVEST</p></li>
</ul>
<p><strong>Postcondiciones:</strong></p>
<p>Se permite o rechaza el registro del evento</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Ninguna (valida y lanza excepción si hay conflicto)</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe validar las reglas de secuencia de eventos antes de permitir su registro, garantizando la coherencia del flujo de producción agrícola en cada lote.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-03</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional (Validación)</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>EVT-RF-03 — Calcular Fecha Estimada de Cosecha</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> EVT-RF-03</p>
<p><strong>Nombre del requerimiento:</strong> Calcular automáticamente la fecha estimada de cosecha al registrar SOWING</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Eventos (EVT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Al registrar un evento de tipo SOWING (siembra), calcular automáticamente la fecha estimada de cosecha basada en los días de crecimiento del cultivo.</p>
<p><strong>Entradas:</strong></p>
<ul>
<li><p>timestamp: Fecha/hora de la siembra (Instant, obligatorio)</p></li>
<li><p>cropId: Identificador del cultivo del lote (Long, obligatorio)</p></li>
</ul>
<p><strong>Precondiciones:</strong></p>
<p>El cultivo debe tener definidos los estimatedGrowthDays</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Verificar estimatedGrowthDays:</strong> El cultivo debe tener días de crecimiento definidos</p></li>
<li><p><strong>Cálculo:</strong> fechaEstimada = timestamp + estimatedGrowthDays</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>Cuando se registra un evento de tipo SOWING</p></li>
<li><p>El sistema obtiene los estimatedGrowthDays del cultivo del lote</p></li>
<li><p>Si los días están definidos, calcula: timestamp + (estimatedGrowthDays en días)</p></li>
<li><p>Actualiza el campo estimatedHarvestDate del lote</p></li>
<li><p>Guarda el lote actualizado</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p>No lanza excepciones, simplemente no calcula si no hay datos</p>
<p><strong>Postcondiciones:</strong></p>
<p>El campo estimatedHarvestDate del lote queda actualizado</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lote con fecha estimada de cosecha actualizada</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe calcular y almacenar automáticamente la fecha estimada de cosecha cuando se registra un evento de siembra, sumando los días de crecimiento del cultivo a la fecha de siembra.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-03 RNF-04</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional (Cálculo Automático)</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>EVT-RF-04 — Listar Todos los Eventos</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> EVT-RF-04</p>
<p><strong>Nombre del requerimiento:</strong> Obtener lista de todos los eventos del sistema</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Eventos (EVT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la visualización de todos los eventos registrados.</p>
<p><strong>Entradas:</strong></p>
<p>No requiere parámetros de entrada</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Autenticación:</strong> El usuario debe tener un token JWT válido</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado solicita la lista de eventos</p></li>
<li><p>El sistema consulta todos los eventos en la base de datos</p></li>
<li><p>El sistema retorna la lista de eventos</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>No autorizado:</strong> El usuario no tiene permisos para ver la lista</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna la lista completa de eventos</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lista de eventos con id, lotId, typeId, userId, timestamp, description, createdAt</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe retornar la lista completa de eventos registrados en todos los lotes, disponible para cualquier usuario autenticado.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01 RNF-03</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>EVT-RF-05 — Listar Eventos por Lote</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> EVT-RF-05</p>
<p><strong>Nombre del requerimiento:</strong> Obtener lista de eventos de un lote específico</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Eventos (EVT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la visualización de todos los eventos asociados a un lote específico.</p>
<p><strong>Entradas:</strong></p>
<p>lotId: Identificador del lote (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado</p></li>
<li><p>El lote debe existir</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Lote existente:</strong> Verificar que el lote exista</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado proporciona el ID del lote</p></li>
<li><p>El sistema consulta los eventos del lote ordenados por timestamp ascendente</p></li>
<li><p>El sistema retorna la lista de eventos</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Lote no encontrado:</strong> No existe un lote con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna la lista de eventos del lote</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lista de eventos del lote especificado</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe retornar todos los eventos de un lote específico, ordenados cronológicamente por timestamp ascendente.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01 RNF-03</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>EVT-RF-06 — Obtener Evento por ID</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> EVT-RF-06</p>
<p><strong>Nombre del requerimiento:</strong> Obtener detalles de un evento específico</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Eventos (EVT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Obtener los detalles de un evento específico por su identificador.</p>
<p><strong>Entradas:</strong></p>
<p>id: Identificador único del evento (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado</p></li>
<li><p>El evento debe existir en la base de datos</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Evento existente:</strong> Verificar que el evento con el ID proporcionado exista</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado proporciona el ID del evento</p></li>
<li><p>El sistema busca el evento por su ID</p></li>
<li><p>El sistema retorna los datos del evento</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Evento no encontrado:</strong> No existe un evento con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna los datos del evento solicitado</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Datos completos del evento</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir consultar los datos completos de un evento específico mediante su identificador único.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>EVT-RF-07 — Filtrar Eventos</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> EVT-RF-07</p>
<p><strong>Nombre del requerimiento:</strong> Filtrar eventos por múltiples criterios</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Gestión de Eventos (EVT)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir filtrar eventos por lote, tipo y rango de fechas.</p>
<p><strong>Entradas:</strong></p>
<ul>
<li><p>lotId: Identificador del lote (Long, opcional)</p></li>
<li><p>type: Nombre del tipo de evento (String, opcional)</p></li>
<li><p>startDate: Fecha inicial del rango (Instant, opcional)</p></li>
<li><p>endDate: Fecha final del rango (Instant, opcional)</p></li>
</ul>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Parámetros opcionales:</strong> Todos los parámetros son opcionales</p></li>
<li><p><strong>Rango de fechas:</strong> Si se proporcionan ambos, startDate debe ser anterior a endDate</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario proporciona los filtros deseados</p></li>
<li><p>El sistema construye la consulta según los parámetros proporcionados</p></li>
<li><p>El sistema retorna los eventos que coincidan con los filtros</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p>Ninguna (retorna lista vacía si no hay coincidencias)</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna la lista filtrada de eventos</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lista de eventos que coinciden con los filtros</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir filtrar eventos mediante combinaciones opcionales de lote, tipo de evento y rango de fechas, retornando lista vacía si no hay coincidencias.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>EVT-TYPE-RF-01 — Listar Tipos de Evento</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> EVT-TYPE-RF-01</p>
<p><strong>Nombre del requerimiento:</strong> Obtener lista de todos los tipos de evento</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Tipos de Evento (EVT-TYPE)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Permitir la visualización de todos los tipos de eventos disponibles en el catálogo.</p>
<p><strong>Entradas:</strong></p>
<p>No requiere parámetros de entrada</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Autenticación:</strong> El usuario debe tener un token JWT válido</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado solicita la lista de tipos de evento</p></li>
<li><p>El sistema consulta todos los tipos en la base de datos</p></li>
<li><p>El sistema retorna la lista de tipos de evento</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>No autorizado:</strong> El usuario no tiene permisos para ver la lista</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna la lista completa de tipos de evento</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lista de tipos de evento con id, name, category</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe retornar el catálogo completo de tipos de evento disponibles para registrar en los lotes.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>EVT-TYPE-RF-02 — Obtener Tipo de Evento por ID</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> EVT-TYPE-RF-02</p>
<p><strong>Nombre del requerimiento:</strong> Obtener detalles de un tipo de evento específico</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Tipos de Evento (EVT-TYPE)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Obtener los detalles de un tipo de evento específico por su identificador.</p>
<p><strong>Entradas:</strong></p>
<p>id: Identificador único del tipo de evento (Long, obligatorio)</p>
<p><strong>Precondiciones:</strong></p>
<ul>
<li><p>El usuario debe estar autenticado</p></li>
<li><p>El tipo de evento debe existir en la base de datos</p></li>
</ul>
<p><strong>Validaciones y Reglas:</strong></p>
<p><strong>Tipo existente:</strong> Verificar que el tipo de evento con el ID proporcionado exista</p>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado proporciona el ID del tipo de evento</p></li>
<li><p>El sistema busca el tipo por su ID</p></li>
<li><p>El sistema retorna los datos del tipo</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Tipo de evento no encontrado:</strong> No existe un tipo con el ID proporcionado</p>
<p><strong>Postcondiciones:</strong></p>
<p>El sistema retorna los datos del tipo de evento solicitado</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Datos completos del tipo de evento</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe permitir consultar los detalles de un tipo de evento específico mediante su identificador único.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>DSH-RF-01 — Obtener Dashboard Completo</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> DSH-RF-01</p>
<p><strong>Nombre del requerimiento:</strong> Obtener dashboard con todas las métricas del sistema</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Dashboard (DSH)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Proporcionar una vista consolidada del estado del sistema incluyendo gráfico de eventos, estados de lotes y progreso de cultivos.</p>
<p><strong>Entradas:</strong></p>
<p>cropId: Identificador del cultivo (Long, opcional)</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado con rol ADMIN, OPERATOR o VIEWER</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Parámetro opcional:</strong> Si se proporciona cropId, filtrar por ese cultivo</p></li>
<li><p><strong>Integración de servicios:</strong> Combinar resultados de múltiples servicios</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario autenticado solicita el dashboard (opcionalmente con cropId)</p></li>
<li><p>Si cropId es null, obtener todos los lotes; si tiene valor, filtrar por cultivo</p></li>
<li><p>Obtener el gráfico de eventos (DSH-RF-02)</p></li>
<li><p>Obtener los estados de lotes (DSH-RF-03)</p></li>
<li><p>Obtener el progreso de lotes (DSH-RF-04)</p></li>
<li><p>Retornar objeto DashboardResponse con toda la información</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p>Ninguna (retorna datos incluso si no hay registros)</p>
<p><strong>Postcondiciones:</strong></p>
<p>Retorna estructura consolidada del dashboard</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Objeto DashboardResponse con: eventChart (labels, values), lotStatuses (lista de lotId, lotName, status, inactivityLevel), lotProgress (lista con lotId, lotName, progress, estimatedHarvestDate, sowingDate, totalDays, daysElapsed, daysRemaining)</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe proporcionar una vista unificada del estado operacional del invernadero, integrando métricas de eventos, estados de lotes y progreso de cultivos en un único endpoint.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>DSH-RF-02 — Obtener Gráfico de Eventos (Últimos 7 Días)</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> DSH-RF-02</p>
<p><strong>Nombre del requerimiento:</strong> Obtener datos para gráfico de eventos de los últimos 7 días</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Dashboard (DSH)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Proporcionar datos para visualizar la cantidad de eventos por día en los últimos 7 días.</p>
<p><strong>Entradas:</strong></p>
<p>cropId: Identificador del cultivo (Long, opcional)</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Período fijo:</strong> Últimos 7 días desde la fecha actual</p></li>
<li><p><strong>Días sin eventos:</strong> Retornar valor 0 para días sin eventos</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>Calcular fecha de inicio (Instant.now() - 7 días)</p></li>
<li><p>Consultar eventos agrupados por día usando eventRepository</p></li>
<li><p>Crear mapa con los 7 días (hoy - 6 días hasta hoy)</p></li>
<li><p>Llenar con datos de la consulta o 0 si no hay eventos</p></li>
<li><p>Retornar objeto EventChartDTO con labels y values</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p>Ninguna</p>
<p><strong>Postcondiciones:</strong></p>
<p>Retorna datos del gráfico con exactamente 7 días</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Objeto EventChartDTO con: labels (lista de 7 fechas YYYY-MM-DD), values (lista de 7 enteros)</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe calcular y retornar la cantidad de eventos registrados por día durante los últimos 7 días, completando con cero los días sin actividad.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-04</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>DSH-RF-03 — Obtener Estados de Lotes</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> DSH-RF-03</p>
<p><strong>Nombre del requerimiento:</strong> Obtener lista de lotes con su estado y nivel de inactividad</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Dashboard (DSH)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Proporcionar una lista de todos los lotes con su estado actual y nivel de inactividad.</p>
<p><strong>Entradas:</strong></p>
<p>cropId: Identificador del cultivo (Long, opcional)</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Integración con LotService:</strong> Usar métodos getLotStatus y getInactivityStatus</p></li>
<li><p><strong>Cálculo dinámico:</strong> Los estados se calculan en tiempo real</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>Obtener lista de lotes (todos o filtrados por cropId)</p></li>
<li><p>Para cada lote: obtener estado usando LotService.getLotStatus() y nivel de inactividad usando LotService.getInactivityStatus()</p></li>
<li><p>Retornar lista de LotStatusDTO</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p>Ninguna</p>
<p><strong>Postcondiciones:</strong></p>
<p>Retorna lista de estados de lotes</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lista de objetos LotStatusDTO con: lotId, lotName, status, inactivityLevel</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe retornar el estado actual y nivel de inactividad de cada lote, calculados en tiempo real mediante los servicios de negocio correspondientes.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>DSH-RF-04 — Obtener Progreso de Lotes</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> DSH-RF-04</p>
<p><strong>Nombre del requerimiento:</strong> Obtener lista de lotes con su porcentaje de progreso</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Dashboard (DSH)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Proporcionar una lista de todos los lotes con su progreso de cultivo.</p>
<p><strong>Entradas:</strong></p>
<p>cropId: Identificador del cultivo (Long, opcional)</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>Integración con LotService:</strong> Usar métodos getCropProgress, getLotProgressDetails y getEstimatedHarvestDate</p></li>
<li><p><strong>Cálculo dinámico:</strong> El progreso se calcula en tiempo real</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>Obtener lista de lotes (todos o filtrados por cropId)</p></li>
<li><p>Para cada lote: obtener progreso, detalles de progreso y fecha estimada de cosecha</p></li>
<li><p>Retornar lista de LotProgressDTO</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p>Ninguna</p>
<p><strong>Postcondiciones:</strong></p>
<p>Retorna lista de progreso de lotes</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Lista de objetos LotProgressDTO con: lotId, lotName, progress, estimatedHarvestDate, sowingDate, totalDays, daysElapsed, daysRemaining</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe retornar el porcentaje de progreso y métricas de tiempo de cada lote, calculados dinámicamente a partir de la fecha de siembra y cosecha estimada.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>RNF-01 RNF-04</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: Funcional</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>RNF-01 — Control de Acceso por Roles</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> RNF-01</p>
<p><strong>Nombre del requerimiento:</strong> Control de acceso basado en roles de usuario</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Seguridad (RNF)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Garantizar que los usuarios solo puedan acceder a funcionalidades según su rol asignado.</p>
<p><strong>Entradas:</strong></p>
<p>Rol del usuario autenticado</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado con token JWT válido</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p><strong>ADMIN:</strong> Acceso completo a todas las funcionalidades</p></li>
<li><p><strong>OPERATOR:</strong> Gestión de cultivos, lotes y eventos (no gestión de usuarios)</p></li>
<li><p><strong>VIEWER:</strong> Solo visualización del dashboard</p></li>
<li><p>Spring Security con anotaciones @PreAuthorize</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El sistema intercepta cada request</p></li>
<li><p>Verifica el token JWT y extrae el rol del usuario</p></li>
<li><p>Compara el rol con las anotaciones @PreAuthorize del endpoint</p></li>
<li><p>Permite o deniega el acceso según la configuración de seguridad</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Acceso denegado:</strong> El usuario no tiene el rol requerido para acceder al recurso</p>
<p><strong>Postcondiciones:</strong></p>
<p>El usuario accede solo a los recursos autorizados según su rol</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Acceso permitido o error 403 Forbidden</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe implementar control de acceso basado en roles (RBAC), restringiendo el acceso a funcionalidades según el rol asignado a cada usuario (ADMIN, OPERATOR, VIEWER).</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>N/A</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: No Funcional — Seguridad</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>RNF-02 — Autenticación JWT</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> RNF-02</p>
<p><strong>Nombre del requerimiento:</strong> Sistema de autenticación basado en JWT</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Seguridad (RNF)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Proporcionar un sistema de autenticación seguro y sin estado.</p>
<p><strong>Entradas:</strong></p>
<p>Credenciales de usuario (email y password)</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe existir en la base de datos</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p>Token JWT generado al hacer login</p></li>
<li><p>Token incluido en header Authorization de cada request</p></li>
<li><p>Token con fecha de expiración configurada</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El usuario se autentica con sus credenciales</p></li>
<li><p>El sistema genera un token JWT firmado</p></li>
<li><p>El cliente incluye el token en cada request subsecuente</p></li>
<li><p>El sistema valida el token en cada request protegida</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p><strong>Token inválido o expirado:</strong> Error 401 Unauthorized</p>
<p><strong>Postcondiciones:</strong></p>
<p>El usuario tiene acceso a los recursos según su rol durante la vigencia del token</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Token JWT válido con información de usuario y rol</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe implementar autenticación basada en tokens JWT sin estado, generando tokens firmados al iniciar sesión y validándolos en cada request protegida.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>N/A</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Alta — Tipo: No Funcional — Seguridad</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>RNF-03 — Trazabilidad de Eventos</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> RNF-03</p>
<p><strong>Nombre del requerimiento:</strong> Registro de auditoría de todas las operaciones</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Auditoría (RNF)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Mantener registro de todas las operaciones para auditoría.</p>
<p><strong>Entradas:</strong></p>
<p>Datos de cada evento registrado</p>
<p><strong>Precondiciones:</strong></p>
<p>El usuario debe estar autenticado</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p>Campo createdAt en eventos con timestamp automático</p></li>
<li><p>Usuario que registra cada evento almacenado</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El sistema registra automáticamente el timestamp de creación (createdAt) en cada evento</p></li>
<li><p>El sistema almacena el userId del usuario que registra el evento</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p>N/A</p>
<p><strong>Postcondiciones:</strong></p>
<p>Todos los eventos tienen registro de auditoría completo</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Campos createdAt y userId en cada evento</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe registrar automáticamente metadatos de auditoría en cada evento, incluyendo timestamp de creación y usuario responsable, garantizando trazabilidad completa.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>N/A</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: No Funcional — Auditoría</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>RNF-04 — Gestión de Zonas Horarias</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nombre del Requerimiento:</strong></td>
<td><p><strong>Código del requerimiento:</strong> RNF-04</p>
<p><strong>Nombre del requerimiento:</strong> Manejo correcto de zonas horarias</p>
<p><strong>Versión:</strong> 1.0</p>
<p><strong>Fecha de creación:</strong> 2026/05/08</p>
<p><strong>Módulo:</strong> Configuración (RNF)</p></td>
</tr>
<tr class="even">
<td><strong>Características:</strong></td>
<td><p><strong>Objetivo:</strong></p>
<p>Asegurar que las fechas se almacenen en UTC y se muestren en la zona horaria correcta.</p>
<p><strong>Entradas:</strong></p>
<p>Fechas y timestamps del sistema</p>
<p><strong>Precondiciones:</strong></p>
<p>Configuración de zona horaria en application.properties</p>
<p><strong>Validaciones y Reglas:</strong></p>
<ul>
<li><p>Almacenamiento en Instant (UTC)</p></li>
<li><p>Conversión a America/Bogota para display</p></li>
<li><p>Configuración en application.properties</p></li>
</ul>
<p><strong>Flujo Principal:</strong></p>
<ul>
<li><p>El sistema recibe fechas del cliente</p></li>
<li><p>Almacena en formato Instant (UTC) en la base de datos</p></li>
<li><p>Convierte a zona horaria America/Bogota para visualización</p></li>
</ul>
<p><strong>Excepciones / Errores:</strong></p>
<p>N/A</p>
<p><strong>Postcondiciones:</strong></p>
<p>Todas las fechas se muestran correctamente en la zona horaria de Colombia</p>
<p><strong>Salidas Esperadas:</strong></p>
<p>Fechas en formato UTC para almacenamiento y America/Bogota para display</p></td>
</tr>
<tr class="odd">
<td><strong>Descripción del requerimiento:</strong></td>
<td>El sistema debe almacenar todas las fechas en formato UTC (Instant) y convertirlas a la zona horaria America/Bogota para su visualización, según configuración en application.properties.</td>
</tr>
<tr class="even">
<td><strong>Requerimiento NO funcional:</strong></td>
<td>N/A</td>
</tr>
<tr class="odd">
<td><strong>Prioridad del requerimiento:</strong></td>
<td>Media — Tipo: No Funcional — Configuración</td>
</tr>
</tbody>
</table>
