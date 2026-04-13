# Plan de trabajo inicial del equipo — Peludópolis

Este documento reúne las tareas principales del proyecto con una breve descripción de cada una, con el objetivo de que el equipo pueda discutirlas, refinarlas y después asignarlas formalmente.

> Integrantes del equipo:
> - Isa
> - Denise
> - Esteban

> Nota inicial:
> Esteban tomará desde el inicio las partes más críticas del proyecto, especialmente base de datos, autenticación, endpoints base del sistema y piezas de backend que desbloquean el trabajo del resto del equipo.

---

## 1. Objetivo de este documento

Este archivo no define todavía la asignación final de responsables. Su propósito es:

- listar todo lo que se debe construir
- describir brevemente cada bloque
- identificar dependencias técnicas
- facilitar la discusión del equipo
- servir como base para repartir tareas en GitHub Projects, Trello o Notion

---

## 2. Cómo conviene dividir el proyecto

No conviene repartir el proyecto solamente por carpetas o por tecnologías.

La mejor forma de dividirlo es por bloques funcionales:

- base técnica y cimientos
- backend por módulos
- frontend por flujos y vistas
- integración entre módulos
- pruebas y documentación

Esto reduce choques entre integrantes y permite que cada quien avance en piezas más completas.

---

## 3. Tareas base del proyecto

### 3.1 Levantar backend base
**Descripción:**
Configurar Express + TypeScript con la estructura inicial del backend, manejo básico de errores, rutas globales, middlewares base y variables de entorno.

**Incluye:**
- archivo principal del servidor
- configuración de app
- lectura de variables de entorno
- manejo básico de errores
- rutas base

**Resultado esperado:**
El backend corre localmente y responde peticiones simples.

---

### 3.2 Crear endpoints de sistema
**Descripción:**
Endpoints mínimos para validar que el backend está vivo y para revisar información básica del sistema.

**Endpoints sugeridos:**
- `GET /health`
- `GET /system/info`
- `GET /`

**Resultado esperado:**
Se puede verificar rápidamente si el backend está funcionando.

---

### 3.3 Configurar conexión a PostgreSQL
**Descripción:**
Preparar la conexión del backend con la base de datos usando PostgreSQL y dejar listo el acceso desde repositorios.

**Incluye:**
- configuración de conexión
- manejo de errores de conexión
- pool de conexiones
- prueba simple de consulta

**Resultado esperado:**
El backend puede conectarse correctamente a la base de datos.

---

### 3.4 Diseñar y levantar el esquema inicial de base de datos
**Descripción:**
Crear el modelo relacional del sistema con tablas, relaciones, restricciones y estructura base para el proyecto.

**Incluye:**
- tablas principales
- llaves primarias y foráneas
- restricciones de integridad
- estados base del sistema
- esquema inicial versionado

**Resultado esperado:**
Base de datos lista para soportar usuarios, mascotas, habitaciones, servicios, paquetes, carrito, reservaciones, pagos y movimientos.

---

### 3.5 Crear seeds y catálogos iniciales
**Descripción:**
Preparar datos iniciales para que el sistema pueda probarse sin tener que capturar todo manualmente.

**Incluye:**
- roles de usuario
- estados principales
- servicios base
- paquetes base
- habitaciones demo
- métodos de pago

**Resultado esperado:**
Entorno funcional para pruebas iniciales.

---

## 4. Módulo de autenticación y seguridad

### 4.1 Crear endpoints de autenticación
**Descripción:**
Implementar el módulo base de autenticación del sistema.

**Endpoints sugeridos:**
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout` (opcional, dependiendo de cómo se maneje el token)

**Incluye:**
- registro de usuario
- inicio de sesión
- lectura del usuario autenticado
- emisión de JWT
- hash de contraseñas

**Resultado esperado:**
Un usuario puede registrarse, iniciar sesión y consultar su sesión actual.

---

### 4.2 Crear middleware de autenticación
**Descripción:**
Middleware que revise el JWT para proteger rutas privadas.

**Incluye:**
- lectura del token en headers
- validación del token
- rechazo de tokens inválidos o expirados
- inyección del usuario autenticado al request

**Resultado esperado:**
Las rutas privadas quedan protegidas.

---

### 4.3 Crear middleware de roles
**Descripción:**
Middleware que limite el acceso según el rol del usuario.

**Incluye:**
- validación de rol admin
- restricción de rutas administrativas
- protección contra acceso no autorizado

**Resultado esperado:**
El sistema distingue entre cliente y administrador.

---

### 4.4 Validación de datos de entrada
**Descripción:**
Validar body, params y query para evitar peticiones inválidas.

**Incluye:**
- validación en login y registro
- validación en fechas
- validación en ids
- validación en datos de negocio

**Resultado esperado:**
El backend devuelve errores claros y evita datos corruptos.

---

## 5. Módulo de usuarios

### 5.1 Consultar perfil del usuario autenticado
**Descripción:**
Permitir que cada usuario vea sus propios datos.

**Endpoint sugerido:**
- `GET /users/me`

**Resultado esperado:**
El usuario puede consultar su perfil.

---

### 5.2 Editar perfil del usuario autenticado
**Descripción:**
Permitir la actualización de datos personales del usuario.

**Endpoint sugerido:**
- `PATCH /users/me`

**Resultado esperado:**
El usuario puede editar su información.

---

### 5.3 Gestión administrativa de usuarios
**Descripción:**
Permitir que el administrador consulte y gestione usuarios del sistema.

**Endpoints sugeridos:**
- `GET /admin/users`
- `GET /admin/users/:id`
- `PATCH /admin/users/:id`
- `PATCH /admin/users/:id/status`

**Resultado esperado:**
El administrador puede visualizar y gestionar usuarios.

---

### 5.4 Consulta de mascotas por usuario para administrador
**Descripción:**
Permitir que el administrador vea las mascotas relacionadas a un usuario.

**Endpoint sugerido:**
- `GET /admin/users/:id/pets`

**Resultado esperado:**
El administrador tiene una vista más completa del cliente.

---

## 6. Módulo de mascotas

### 6.1 Registrar mascota
**Descripción:**
Permitir al usuario crear registros de mascotas.

**Endpoint sugerido:**
- `POST /pets`

**Resultado esperado:**
El usuario puede dar de alta sus mascotas.

---

### 6.2 Listar mascotas del usuario
**Descripción:**
Permitir consultar todas las mascotas registradas por el usuario.

**Endpoint sugerido:**
- `GET /pets`

**Resultado esperado:**
El usuario puede ver su listado de mascotas.

---

### 6.3 Editar mascota
**Descripción:**
Permitir modificar los datos de una mascota existente.

**Endpoint sugerido:**
- `PATCH /pets/:id`

**Resultado esperado:**
La mascota puede actualizarse sin volver a crearla.

---

### 6.4 Eliminar o desactivar mascota
**Descripción:**
Permitir una baja lógica o eliminación controlada.

**Endpoint sugerido:**
- `DELETE /pets/:id`

**Resultado esperado:**
El usuario deja de usar una mascota sin afectar la integridad del sistema.

---

## 7. Módulo de habitaciones

### 7.1 Listar habitaciones
**Descripción:**
Mostrar el catálogo de habitaciones disponibles.

**Endpoints sugeridos:**
- `GET /rooms`
- `GET /rooms/:id`

**Resultado esperado:**
El usuario puede explorar habitaciones.

---

### 7.2 Filtrar habitaciones
**Descripción:**
Permitir filtrar por criterios útiles para la reserva.

**Endpoint sugerido:**
- `GET /rooms?petType=&size=&priceMin=&priceMax=&startDate=&endDate=`

**Resultado esperado:**
Búsqueda más precisa de habitaciones.

---

### 7.3 CRUD administrativo de habitaciones
**Descripción:**
Herramientas para que el administrador gestione habitaciones.

**Endpoints sugeridos:**
- `POST /admin/rooms`
- `PATCH /admin/rooms/:id`
- `DELETE /admin/rooms/:id`
- `PATCH /admin/rooms/:id/status`

**Resultado esperado:**
El administrador puede administrar el catálogo de habitaciones.

---

### 7.4 Validar compatibilidad mascota-habitación
**Descripción:**
Regla de negocio para impedir reservas incompatibles según tipo y tamaño.

**Resultado esperado:**
Solo se puede reservar una habitación válida para la mascota.

---

## 8. Módulo de servicios adicionales

### 8.1 Listado de servicios
**Descripción:**
Mostrar los servicios adicionales disponibles para el cliente.

**Endpoints sugeridos:**
- `GET /services`
- `GET /services/:id`

**Resultado esperado:**
El cliente puede revisar el catálogo de servicios.

---

### 8.2 CRUD administrativo de servicios
**Descripción:**
Gestión administrativa del catálogo de servicios.

**Endpoints sugeridos:**
- `POST /admin/services`
- `PATCH /admin/services/:id`
- `DELETE /admin/services/:id`
- `GET /admin/services`

**Resultado esperado:**
Servicios administrables desde el panel admin.

---

## 9. Módulo de paquetes / promociones

### 9.1 Listado de paquetes
**Descripción:**
Mostrar paquetes o promociones disponibles para el usuario.

**Endpoints sugeridos:**
- `GET /packages`
- `GET /packages/:id`

**Resultado esperado:**
El usuario puede consultar promociones agrupadas.

---

### 9.2 CRUD administrativo de paquetes
**Descripción:**
Permitir al administrador crear, editar y desactivar paquetes.

**Endpoints sugeridos:**
- `POST /admin/packages`
- `PATCH /admin/packages/:id`
- `DELETE /admin/packages/:id`

**Resultado esperado:**
Promociones controladas desde administración.

---

### 9.3 Aplicación de promociones y descuentos
**Descripción:**
Reglas de negocio para aplicar correctamente descuentos o promociones al total.

**Resultado esperado:**
El total de la reserva es consistente y trazable.

---

## 10. Módulo de carrito

### 10.1 Crear o recuperar carrito activo
**Descripción:**
Mantener un carrito temporal por usuario antes de confirmar la reservación.

**Endpoints sugeridos:**
- `GET /cart`
- `POST /cart/init` (opcional)

**Resultado esperado:**
El usuario puede trabajar una reservación en progreso.

---

### 10.2 Agregar habitación al carrito
**Descripción:**
Guardar la habitación seleccionada junto con fechas y datos base.

**Endpoint sugerido:**
- `POST /cart/rooms`

**Resultado esperado:**
La reservación empieza a construirse.

---

### 10.3 Quitar habitación del carrito
**Descripción:**
Permitir remover una habitación del carrito.

**Endpoint sugerido:**
- `DELETE /cart/rooms/:id`

**Resultado esperado:**
El carrito se puede editar.

---

### 10.4 Agregar servicios al carrito
**Descripción:**
Permitir añadir servicios adicionales antes de confirmar la reservación.

**Endpoint sugerido:**
- `POST /cart/services`

**Resultado esperado:**
El usuario puede personalizar la reserva.

---

### 10.5 Agregar paquetes al carrito
**Descripción:**
Permitir añadir paquetes o promociones al carrito.

**Endpoint sugerido:**
- `POST /cart/packages`

**Resultado esperado:**
Promociones integradas al flujo de compra.

---

### 10.6 Consultar resumen del carrito
**Descripción:**
Mostrar todos los elementos seleccionados, con subtotales y total general.

**Endpoint sugerido:**
- `GET /cart/summary`

**Resultado esperado:**
El usuario revisa su selección antes de confirmar.

---

## 11. Módulo de reservaciones

### 11.1 Confirmar reservación
**Descripción:**
Transformar el carrito en una reservación formal.

**Endpoint sugerido:**
- `POST /reservations`

**Incluye:**
- validación de fechas
- validación de disponibilidad
- validación de mascotas
- cálculo final del total
- persistencia de la reservación

**Resultado esperado:**
La reserva queda registrada en el sistema.

---

### 11.2 Listar reservaciones del usuario
**Descripción:**
Permitir al usuario consultar su historial.

**Endpoints sugeridos:**
- `GET /reservations`
- `GET /reservations/:id`

**Resultado esperado:**
El usuario puede revisar sus reservaciones y detalles.

---

### 11.3 Cancelar reservación
**Descripción:**
Cambiar el estado de una reservación sin borrarla físicamente.

**Endpoint sugerido:**
- `PATCH /reservations/:id/cancel`

**Resultado esperado:**
Manejo correcto por estados.

---

### 11.4 Gestión administrativa de reservaciones
**Descripción:**
Permitir al administrador consultar, filtrar y cambiar estados de las reservaciones.

**Endpoints sugeridos:**
- `GET /admin/reservations`
- `GET /admin/reservations/:id`
- `PATCH /admin/reservations/:id/status`
- `GET /admin/reservations?date=&user=&status=`

**Resultado esperado:**
El administrador puede operar el flujo del hotel.

---

### 11.5 Validación de traslapes
**Descripción:**
Impedir que la misma habitación sea reservada dos veces en fechas superpuestas.

**Resultado esperado:**
Se evita la doble ocupación.

---

### 11.6 Cálculo automático del total
**Descripción:**
Calcular correctamente noches, habitación, servicios, paquetes y descuentos.

**Resultado esperado:**
El total de la reservación es confiable.

---

## 12. Módulo de pagos

### 12.1 Registrar pago
**Descripción:**
Crear el pago asociado a una reservación.

**Endpoint sugerido:**
- `POST /payments`

**Incluye:**
- monto
- método de pago
- estado
- referencia de transacción

**Resultado esperado:**
Cada reservación puede vincularse a un pago.

---

### 12.2 Consultar pago o confirmación
**Descripción:**
Permitir consultar el estado del pago.

**Endpoints sugeridos:**
- `GET /payments/:id`
- `GET /reservations/:id/payment`

**Resultado esperado:**
El usuario sabe si el pago fue registrado o confirmado.

---

### 12.3 Consulta administrativa de pagos
**Descripción:**
Permitir que el administrador vea los pagos del sistema.

**Endpoint sugerido:**
- `GET /admin/payments`

**Resultado esperado:**
Control operativo y financiero básico.

---

## 13. Módulo de check-in / check-out

### 13.1 Solicitar check-in
**Descripción:**
Permitir al usuario solicitar el check-in de una reservación válida.

**Endpoint sugerido:**
- `POST /reservations/:id/check-in`

**Resultado esperado:**
Movimiento inicial de entrada registrado.

---

### 13.2 Solicitar check-out
**Descripción:**
Permitir al usuario solicitar el check-out.

**Endpoint sugerido:**
- `POST /reservations/:id/check-out`

**Resultado esperado:**
Movimiento de salida registrado.

---

### 13.3 Confirmación administrativa de check-in / check-out
**Descripción:**
Permitir al administrador validar formalmente estos movimientos.

**Endpoints sugeridos:**
- `PATCH /admin/reservations/:id/check-in/confirm`
- `PATCH /admin/reservations/:id/check-out/confirm`

**Resultado esperado:**
Los estados operativos del hospedaje quedan controlados.

---

### 13.4 Historial de movimientos
**Descripción:**
Registrar todos los movimientos de entrada y salida relacionados con una reservación.

**Resultado esperado:**
Existe trazabilidad de operaciones de hospedaje.

---

## 14. Tareas de frontend

### 14.1 Layout general del sitio
**Descripción:**
Definir navbar, estructura base, navegación principal y organización visual.

---

### 14.2 Vista principal / inicio
**Descripción:**
Landing page o pantalla de bienvenida del sistema.

---

### 14.3 Formularios de registro y login
**Descripción:**
Interfaces para autenticación e integración con backend.

---

### 14.4 Vista de perfil de usuario
**Descripción:**
Pantalla para consultar y editar datos personales.

---

### 14.5 Vista de mascotas
**Descripción:**
Pantalla para listar, crear, editar y eliminar mascotas.

---

### 14.6 Vista de habitaciones
**Descripción:**
Catálogo de habitaciones con filtros y acceso al detalle.

---

### 14.7 Vista de detalle de habitación
**Descripción:**
Pantalla para mostrar la información completa de una habitación específica.

---

### 14.8 Vista de servicios
**Descripción:**
Catálogo de servicios adicionales.

---

### 14.9 Vista de paquetes
**Descripción:**
Catálogo de promociones y paquetes.

---

### 14.10 Vista de carrito
**Descripción:**
Pantalla para revisar habitación, servicios, paquetes y total.

---

### 14.11 Vista de reservaciones
**Descripción:**
Pantalla de historial y detalle de reservaciones del usuario.

---

### 14.12 Vista de pago
**Descripción:**
Pantalla para registrar pago y visualizar confirmación.

---

### 14.13 Vista de check-in / check-out
**Descripción:**
Pantallas o acciones para solicitud de entrada y salida.

---

### 14.14 Panel administrativo
**Descripción:**
Conjunto de vistas para administración de usuarios, habitaciones, servicios, paquetes, reservaciones y pagos.

---

## 15. Tareas transversales

### 15.1 Manejo de errores
**Descripción:**
Definir mensajes claros tanto en backend como en frontend para errores esperados e inesperados.

---

### 15.2 Validaciones de negocio
**Descripción:**
Asegurar que las reglas importantes no dependan solamente del frontend.

**Ejemplos:**
- fechas válidas
- habitación compatible con mascota
- sin traslapes de habitación
- usuario dueño del recurso
- total correcto

---

### 15.3 Datos demo para pruebas
**Descripción:**
Preparar datos suficientes para probar el sistema completo.

---

### 15.4 Documentación técnica
**Descripción:**
Documentar endpoints, estructura, reglas, decisiones técnicas y forma de correr el proyecto.

---

### 15.5 Pruebas del flujo completo
**Descripción:**
Probar el sistema desde el punto de vista del cliente y del administrador.

---

### 15.6 Integración de módulos
**Descripción:**
Unir frontend, backend y base de datos sin romper contratos ni nombres de campos.

---

## 16. Tareas 

### Isa:

---

### Denise:

---

### Esteban: 

- levantar backend base
- configurar conexión a PostgreSQL
- diseñar esquema inicial de base de datos
- crear seeds y catálogos iniciales
- crear endpoints base de sistema (`health`, `system`, etc.)
- crear módulo inicial de autenticación
- configurar JWT
- crear middlewares de auth y roles
- construir lógica base de disponibilidad
- construir lógica base de reservaciones
- dejar lista la estructura para pagos y check-in/check-out

---


## 17. Propuesta inicial de división por bloques

> Esta sección es solo una propuesta. El equipo puede ajustarla.

### Bloque 1 — Cimientos y backend crítico

**Incluye:**
- backend base
- base de datos
- autenticación
- middlewares
- endpoints de sistema
- reglas de negocio críticas
- reservaciones base
- pagos base

---

### Bloque 2 — Frontend cliente

**Incluye:**
- home
- login y registro
- perfil
- mascotas
- habitaciones
- paquetes
- carrito
- historial

---

### Bloque 3 — Admin e integración operativa

**Incluye:**
- admin de usuarios
- admin de habitaciones
- admin de servicios
- admin de paquetes
- admin de reservaciones
- check-in / check-out
- integración operativa de estados

---

## 18. Orden recomendado de implementación

### Fase 1
- backend base
- conexión a base de datos
- esquema SQL
- seeds
- endpoints de sistema

### Fase 2
- autenticación
- usuarios
- mascotas

### Fase 3
- habitaciones
- servicios
- paquetes
- filtros

### Fase 4
- carrito
- reservaciones
- cálculo del total
- validaciones de disponibilidad

### Fase 5
- pagos
- confirmaciones
- historial
- check-in / check-out

### Fase 6
- panel administrativo
- pruebas integrales
- documentación final
- ajustes y correcciones

---


## 20. Próximos pasos recomendados para el equipo

Antes de empezar a programar por separado, conviene cerrar juntos lo siguiente:

- modelo de base de datos
- contrato inicial de endpoints
- estados del sistema
- flujo de reservación
- alcance real del MVP
- reparto inicial de módulos

Esto evitará que frontend y backend queden desalineados.

---