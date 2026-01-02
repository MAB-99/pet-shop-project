# Bitácora de Desarrollo - Pet Shop

# Fase 1: Backend  (Node.js + Express + MongoDB)--------------------------------------------------------------------------------------------------------------------------------------

## 1. Arquitectura del Backend
- **Node.js + Express:** Nuestro servidor web.
- **MongoDB:** Base de datos NoSQL (orientada a documentos).
- **Mongoose:** Librería para conectar Node con MongoDB y definir esquemas.

## 2. Modelos de Datos (Schemas)
Creamos el modelo de `Usuario` (User.js).
**Teoría:**
- MongoDB no tiene esquema por defecto (es flexible).
- Usamos `mongoose.Schema` para imponer reglas estrictas (tipos de datos, obligatoriedad, unicidad).
- **Validaciones:** `required: true` (obligatorio), `unique: true` (sin duplicados).
- **Timestamps:** Mongoose gestiona automáticamente `createdAt` y `updatedAt`.

## 3. Controladores y Rutas
- **Controlador (`userController.js`):** Contiene la lógica. Recibe `req` (petición) y `res` (respuesta).
    - `await`: Esperamos a que la base de datos responda antes de seguir.
    - `usuario.save()`: Método de Mongoose para guardar en MongoDB.
- **Ruta (`userRoutes.js`):** Define la URL.
    - `router.post('/')`: Usamos POST porque estamos enviando datos para guardar.

## 4. Git y Control de Versiones
- **Error común:** `fatal: The current branch main has no upstream branch`.
- **Causa:** La rama local (`main`) no tiene un vínculo establecido con la rama remota en GitHub (`origin`).
- **Solución:** Usar `git push --set-upstream origin main` la primera vez para crear ese "puente".

## 5. Solución de Errores Git
- **Error:** `fatal: repository '...' not found`.
- **Causa:** El "control remoto" (`origin`) apunta a una dirección de GitHub que no existe o es incorrecta.
- **Solución:**
    1. `git remote -v`: Para ver a dónde está apuntando actualmente.
    2. `git remote remove origin`: Para borrar la dirección vieja.
    3. `git remote add origin <NUEVA_URL>`: Para poner la dirección correcta.

## 6. Error de Permisos (403 Forbidden)
- **Error:** `Permission to ... denied to <usuario_viejo>`.
- **Causa:** Windows tenía guardada una contraseña de una cuenta de GitHub antigua (`mauroBossio`) que no tiene permiso en el repositorio actual (`MAB-99`).
- **Solución:**
    1. Ir a "Administrador de Credenciales" en Windows.
    2. Borrar las credenciales de `git:https://github.com`.
    3. Hacer `git push` de nuevo e iniciar sesión con la cuenta correcta (Dueño del repo).

## 7. Pruebas de API (Testing)
- **Herramienta:** Postman (actúa como cliente en lugar del navegador).
- **Flujo de datos:**
    1. Cliente envía JSON (`req.body`).
    2. Servidor recibe, valida y guarda en MongoDB.
    3. Servidor responde JSON (`res.json`).
- **Prueba de unicidad:** Intentar registrar el mismo email dos veces debe devolver error 400.

## 8. Errores de Importación (Module Not Found)
- **Error:** `ERR_MODULE_NOT_FOUND`.
- **Causa:** El código intenta importar un archivo que no existe o cuyo nombre no coincide **exactamente**.
- **Detalle:** Node.js distingue mayúsculas, minúsculas y plurales. `User.js` no es lo mismo que `Users.js`.
- **Solución:** Verificar que el nombre del archivo en la carpeta coincida letra por letra con la ruta del `import`.

## 9. Error de Conexión (Timeout en Localhost)
- **Problema:** Node.js v17+ prefiere usar IPv6 (`::1`) por defecto, pero MongoDB local en Windows suele escuchar en IPv4 (`127.0.0.1`).
- **Síntoma:** Error `MongooseError: Operation ... buffering timed out`.
- **Solución:** Forzar el uso de IPv4 en la conexión de Mongoose.
- **Código:**
  ```javascript
  mongoose.connect(process.env.MONGO_URI, {
      family: 4 // Fuerza IPv4
  });

## 10. Solución de Conexión Local (0.0.0.0)
- **Problema:** Conflictos de resolución de nombre entre `localhost` / `127.0.0.1` y Node.js en Windows.
- **Solución:** Usar la IP `0.0.0.0` en la cadena de conexión.
- **Por qué:** `0.0.0.0` indica "escuchar en todas las interfaces de red locales", lo que suele evitar el bloqueo que causa el timeout.

## 11. Solución Definitiva de Conexión
- **Solución:** Reemplazar `localhost` por `127.0.0.1` en la cadena de conexión.
- **Razón:** Evita que Node.js intente resolver el nombre usando IPv6, garantizando una conexión directa IPv4 a la base de datos local.

## 12. Seguridad y Hashing (Bcrypt)
- **Problema:** Guardar contraseñas en texto plano es una vulnerabilidad crítica.
- **Solución:** Usar `bcrypt` para hashear la contraseña.
- **Implementación:** Usamos un `pre('save')` hook en el modelo de Mongoose.
    - Se ejecuta automáticamente antes de guardar en la DB.
    - `bcrypt.hash`: Convierte la contraseña en un hash irreversible.
    - `this.isModified`: Evita re-encriptar si solo editamos otros datos del usuario.

## 13. Control de Flujo en Middleware
- **Regla:** Al usar `next()` dentro de un condicional (`if`), siempre usar `return next()`.
- **Por qué:** `next()` avisa a Mongoose que continúe, pero no detiene la ejecución de la función actual. Sin el `return`, el código seguiría ejecutándose y podría re-encriptar datos innecesariamente.

## 14. JSON Web Tokens (JWT)
- **Concepto:** HTTP es "sin estado" (el servidor olvida quién eres tras cada petición). JWT soluciona esto.
- **Funcionamiento:**
    1. Usuario hace Login.
    2. Servidor genera un Token firmado con una clave secreta (`JWT_SECRET`) y lo envía.
    3. El Frontend guarda ese Token.
    4. En futuras peticiones, el Frontend envía el Token para decir "Soy yo".
- **Librería:** `jsonwebtoken`. Método `jwt.sign({payload}, secret, {expiresIn})`.

## 15. Anatomía de `jwt.sign()`
La función para crear tokens recibe 3 parámetros:
1.  **Payload (Carga Útil):** Objeto con datos a guardar dentro del token (ej: `{ id: usuario._id }`). **Nota:** No guardar datos sensibles como passwords.
2.  **Secret Key (Llave Privada):** String almacenado en `.env` que sirve para firmar digitalmente el token. Garantiza que nadie modificó el token.
3.  **Options (Opciones):** Configuraciones como `expiresIn` (tiempo de vida del token).

## 16. Middleware de Autenticación y Bearer Token
- **Concepto:** Un middleware intercepta la petición antes de llegar al controlador.
- **Flujo:** `Request` -> `checkAuth` (Verifica Token) -> `Controller`.
- **Bearer Token:** Es el estándar para enviar tokens. El cliente envía `Authorization: Bearer <token>`.
- **req.user:** En el middleware, si el token es válido, buscamos al usuario en la DB y lo guardamos en `req.user`. Así, cualquier controlador siguiente ya sabe quién es el usuario sin volver a consultar la DB.

## 17. Lógica de Negocio: Productos
- **Modelo (`Product.js`):** Estructura de los items que venderemos.
- **Validación `enum`:** Restringe un campo de texto a una lista específica de valores permitidos (ej: solo 'perro' o 'gato').
- **Rutas Públicas vs Privadas:**
    - `GET /api/products`: Pública (todos ven el catálogo).
    - `POST /api/products`: Privada (requiere Token, usamos `checkAuth`).

## 18. Rutas Dinámicas y CRUD Completo
- **Parametros de URL (`req.params`):**
    - En la ruta definimos `:id` (ej: `router.route('/:id')`).
    - Express captura lo que escribamos ahí y lo guarda en `req.params.id`.
    - Usamos ese ID para buscar en la base de datos con `.findById(id)`.
- **Métodos HTTP:**
    - `PUT`: Para actualizar un recurso existente.
    - `DELETE`: Para eliminar un recurso.

## 19. Modelado de Pedidos y Relaciones
- **Relaciones en Mongoose:**
    - Usamos `mongoose.Schema.Types.ObjectId` para indicar que un campo guarda el ID de otro documento.
    - Usamos `ref: 'Modelo'` para indicar a qué colección pertenece ese ID.
- **Flujo de Compra:**
    - El pedido (`Order`) guarda el ID del usuario (`user`) y un array de items.
    - Usamos `req.user._id` (obtenido del token JWT) para asignar automáticamente la compra al usuario logueado.

# Fase 2: Frontend (React + Vite)-----------------------------------------------------------------------------------------------------------------------------------------------------

## 20. Inicialización del Cliente
- **Herramienta:** Vite (más rápido que Webpack/CRA).
- **Comando:** `npm create vite@latest client`.
- **Estructura:**
    - `/server`: Todo el Backend (Node/Express).
    - `/client`: Todo el Frontend (React).
    - Son dos proyectos "separados" que conviven en la misma carpeta principal.

## 21. Estructura y Routing del Frontend
- **Limpieza:** Eliminamos el boilerplate de Vite (`App.css`, `index.css`).
- **React Router Dom:** Librería estándar para navegación en SPAs.
    - `BrowserRouter`: Componente padre que envuelve toda la aplicación en `main.jsx` para habilitar la navegación sin recargas.
- **Arquitectura de Carpetas:**
    - `pages`: Vistas completas (Rutas).
    - `components`: Piezas reutilizables.
    - `layout`: Estructura maestra (Navbar, Footer).

## 22. Integración de Estilos (Tailwind CSS)
- **Decisión:** Se detectó que el proyecto anterior ("Horizon") usaba Tailwind CSS. Para reutilizar el código visual, se instaló en el nuevo proyecto.
- **Versión:** Se optó por **Tailwind v3.4 (Estable)** en lugar de la v4 (Beta) para evitar conflictos de configuración con Vite.
- **Configuración:**
  - `tailwind.config.js`: Se configuró el `content` para escanear archivos `.jsx` en `/src`.
  - `index.css`: Se agregaron las directivas `@tailwind base`, `components` y `utilities`.

## 23. Conexión Frontend-Backend (Login)
- **Librería HTTP:** Se instaló **Axios** para realizar peticiones al servidor.
- **Adaptación de Componentes:** Se migró el formulario de Login de Horizon.
  - Se reemplazaron componentes complejos externos (shadcn/ui) por etiquetas HTML estándar (`<button>`, `<input>`) manteniendo las clases de Tailwind para preservar el diseño idéntico.
- **Convención de Rutas:** Se reafirmó la importancia de usar rutas en **SINGULAR** para coincidir con el Backend:
  - Backend: `POST /api/user/login`
  - Frontend: `axios.post('http://localhost:4000/api/user/login', ...)`

## 24. Estado Global (Context API + AuthProvider)
- **Problema:** React "olvida" al usuario al cambiar de página.
- **Solución:** Implementación de `AuthProvider` (Context API).
  - Envuelve a toda la aplicación en `App.jsx`.
  - Al cargar la app (`useEffect`), busca si existe un `token` en `localStorage`.
  - Si existe, lo valida contra el Backend (`GET /perfil`) y guarda los datos del usuario en un estado global `auth`.
- **Persistencia:** Permite que el usuario recargue la página (F5) sin perder la sesión.

## 25. Custom Hooks y Errores Comunes
- **Hook `useAuth`:** Se creó un hook personalizado para consumir el contexto de autenticación fácilmente (`const { auth } = useAuth()`).
- **Error de Importación (ES Modules):**
  - **Error:** `Uncaught SyntaxError: ... does not provide an export named 'useAuth'`.
  - **Causa:** Intentar importar con llaves `{ useAuth }` una función que fue exportada como `export default`.
  - **Solución:** Importar sin llaves: `import useAuth from ...`.

## 26. Estructura Maestra (Layout y UI Global)
- **Constantes Globales:** Se creó `client/src/lib/constants.js` para centralizar datos de la empresa (dirección, redes sociales) y evitar "hardcoding".
- **Componentes UI:**
  - **Footer:** Migrado y adaptado. Usa las constantes globales.
  - **Header (Navbar):** Reescrito para eliminar dependencias externas (`shadcn/ui`).
    - Integra `useAuth` para mostrar avatar de usuario o botón de login.
    - Menú móvil y dropdown de usuario funcional con estados locales (`useState`).
- **Layout Principal:** Creación de `MainLayout.jsx` que implementa el patrón de diseño `Header + Outlet + Footer`. Esto evita repetir código en cada página.

## 27. Migración de Página de Inicio (Home)
- **Librerías Visuales:**
  - `react-helmet`: Para gestión de SEO (títulos de pestaña y metadatos).
  - `framer-motion`: Para animaciones de entrada y transiciones suaves.
- **Adaptación:** Se migró el `Home.jsx` de Horizon, reemplazando componentes propietarios por HTML5 + Tailwind CSS, manteniendo la estética original (Banner, Features, Ubicación).
- **Solución de Errores:**
  - Error de caché en Vite con Framer Motion (`Could not resolve react/jsx-runtime`). Solucionado forzando el reinicio con `npm run dev -- --force`.

## 28. Ciclo de E-commerce Completo (Tienda, Carrito y Perfil)
- **Tienda (Shop):**
  - Implementación de `Shop.jsx` con consumo de API real (`/api/product`).
  - Lógica de filtrado en cliente (Categoría, Precio, Buscador).
  - Tarjetas de producto (`ProductCard.jsx`) con control de stock visual.
- **Gestión del Carrito (Global State):**
  - Creación de `CartProvider` y hook `useCart` para manejar el estado global de la compra.
  - Funciones: agregar, eliminar, modificar cantidad y calcular totales.
  - Persistencia en `localStorage`.
- **Checkout & UI:**
  - `CartDrawer`: Panel deslizante lateral integrado en `MainLayout`.
  - Lógica de Checkout: Validación de usuario logueado y envío de orden al Backend (`POST /api/order`).
- **Perfil de Usuario:**
  - Creación de ruta protegida `/perfil`.
  - Visualización de datos del usuario y **Historial de Pedidos** (`GET /api/order/myorders`).
  - Backend: Se añadieron los controladores y rutas para soportar la consulta de historial personal.

## 29. Panel de Administración (Fases 1 y 2)
- **Estructura del Dashboard:**
  - Creación de `AdminDashboard.jsx` con sistema de pestañas (Resumen, Productos, Órdenes).
  - Protección de ruta en Frontend: Redirección automática si el usuario no tiene `isAdmin: true`.
- **Gestión de Productos (CRUD):**
  - **Lectura:** Componente `ProductsTable.jsx` que lista el inventario con indicadores visuales de stock bajo.
  - **Eliminación:** Funcionalidad para borrar productos (`DELETE /api/product/:id`) con confirmación.
  - **Creación y Edición:** Componente `ProductForm.jsx` reutilizable.
    - Maneja estado "Nuevo" (POST) y "Editar" (PUT).
    - Previsualización de imágenes en tiempo real.
    - Integración fluida en el Dashboard para alternar entre tabla y formulario.

## 30. Gestión de Órdenes (Admin Panel)
- **Backend**: 
  - Se modificó el modelo `Order.js` para incluir el campo `status` con estados definidos (Pendiente, Enviado, Entregado, Cancelado).
  - Se agregaron los controladores `getAllOrders` (para ver todo el historial) y `updateOrderStatus` (para cambiar el estado) en `orderController.js`.
  - Se definieron las rutas correspondientes en `orderRoutes.js`.
- **Frontend**:
  - Se implementó la lógica completa en el componente `OrdersTab` dentro de `AdminDashboard.jsx`.
  - Ahora se listan todas las compras de la base de datos en una tabla con diseño responsivo.
  - Se integró la funcionalidad para cambiar el estado de la orden en tiempo real mediante un menú desplegable.

## 31. Panel de Administración: Resumen General (Dashboard Stats)
- **Objetivo:** Mostrar métricas clave del negocio en tiempo real en la pantalla de bienvenida del admin.
- **Backend:**
  - Se creó el controlador `getDashboardStats` en `orderController.js`.
  - Lógica:
    - **Ventas Totales:** Suma del `totalPrice` de todas las órdenes (excluyendo canceladas).
    - **Conteo:** Uso de `countDocuments` para el total de productos y `length` para las órdenes.
  - Ruta: `GET /api/order/stats` (Protegida con `checkAuth`).
- **Frontend:**
  - Integración en `AdminDashboard.jsx` (Componente `OverviewTab`).
  - Carga de datos asíncrona (`useEffect` + `fetch`) al montar el componente.
  - Formateo de moneda local (`toLocaleString`) para mostrar los montos.

## 32. Servicio de Peluquería y Gestión de Turnos (Appointments)
- **Objetivo:** Permitir a los clientes solicitar turnos y al administrador gestionarlos, confirmando fechas y contactando vía WhatsApp.
- **Backend:**
  - **Modelo `Appointment`:** Se creó el esquema con soporte para `confirmedDate` (fecha real del turno) y estados (`Pendiente`, `Confirmado`, `Finalizado`, `Cancelado`).
  - **Controladores:** Lógica para crear solicitud (Cliente), listar todas (Admin) y actualizar estado/fecha (Admin).
  - **Rutas:** Se configuró `/api/appointment` y se registró en `index.js`.
- **Frontend (Cliente):**
  - **Página `Services.jsx`:** Formulario validado que requiere autenticación. Envía nombre de mascota, foto, contacto y notas.
- **Frontend (Admin Dashboard):**
  - **Pestaña `AppointmentsTab`:**
    - Visualización de solicitudes en tarjetas.
    - **Botón WhatsApp:** Enlace directo (`wa.me`) pre-llenado con mensaje personalizado.
    - **Zoom de Imagen:** Modal emergente para ver la foto de la mascota en detalle.
    - **Agenda Inteligente:** Al cambiar estado a "Confirmado", se abre un modal para seleccionar Fecha/Hora y muestra una lista de horarios ya ocupados para evitar superposiciones.
  
## 33. Página Institucional "Sobre Nosotros"
- **Objetivo:** Migrar el contenido institucional del sitio anterior para generar confianza en la marca.
- **Implementación:**
  - Creación de `About.jsx` utilizando `framer-motion` para animaciones de entrada.
  - Diseño responsivo con Tailwind CSS, incluyendo sección "Hero" con imagen de fondo y grilla de valores.
  - Integración de `lucide-react` para iconografía.
  - Configuración de SEO básico con `react-helmet`.

## 34. Página de Contacto
- **Objetivo:** Facilitar la comunicación con los clientes mediante formulario y datos de ubicación.
- **Implementación:**
  - Creación de `Contact.jsx` adaptando el diseño previo a Tailwind CSS.
  - Formulario funcional con redirección automática a WhatsApp pre-llenado.
  - Integración de mapa (iframe) y lista de redes sociales/horarios.
  - Diseño responsivo con animaciones suaves (`framer-motion`).

## 35. Integración de Imágenes con Cloudinary
- **Objetivo:** Permitir la subida de imágenes reales desde el dispositivo del usuario/admin en lugar de depender de URLs de texto.
- **Configuración:**
  - Se creó cuenta en Cloudinary y se configuró un "Upload Preset" en modo *Unsigned* para permitir cargas desde el frontend.
- **Frontend:**
  - Creación del helper utilitario `client/src/lib/uploadImage.js` para gestionar la petición a la API de Cloudinary.
  - **Admin (Productos):** Se modificó `ProductForm.jsx` para aceptar inputs de tipo `file`, mostrando una previsualización de la imagen y un estado de carga ("Subiendo...").
  - **Cliente (Servicios):** Se actualizó `Services.jsx` para que los usuarios puedan subir la foto de su mascota al solicitar un turno.

## 36. Despliegue (Deploy) y Configuración de Producción
- **Objetivo:** Publicar la aplicación en internet y asegurar que el Frontend se conecte al Backend correcto dinámicamente.
- **Backend (Render):**
  - Despliegue del servidor Node.js/Express en **Render**.
  - Configuración de variables de entorno (`MONGO_URI`, `JWT_SECRET`) en la nube.
  - Configuración de seguridad en **MongoDB Atlas** (Network Access) para permitir conexiones externas.
- **Frontend (Vercel & Refactor):**
  - Centralización de la URL de la API en `client/src/lib/constants.js` usando lógica condicional.
  - Configuración de Variables de Entorno con `.env.production` (`VITE_BACKEND_URL`).
  - **Refactorización Masiva:** Se reemplazaron todas las llamadas `fetch` harcodeadas (`localhost:4000`) por la constante dinámica `API_URL` en:
    - `AuthProvider.jsx` (Autenticación)
    - `Shop.jsx` (Tienda)
    - `Services.jsx` (Turnos)
    - `AdminDashboard.jsx` (Panel de Administración)
    - `ProductForm.jsx` (Gestión de Productos)

## 37. Correcciones Post-Despliegue y Optimización
- **Objetivo:** Solucionar errores de conexión y navegación detectados en el entorno de producción (Vercel/Render).
- **Backend & Base de Datos:**
  - Resolución de errores de conexión MongoDB (`ECONNREFUSED` y `whitelisted IP`) configurando correctamente el Network Access en Atlas.
  - Actualización de credenciales de base de datos para evitar conflictos con caracteres especiales.
- **Frontend:**
  - Creación de `vercel.json` con reglas de *rewrite* para solucionar el error 404 al recargar páginas internas (SPA Routing).
  - **Limpieza de Código:** Se eliminaron todas las referencias residuales a `localhost:4000` en `CartProvider`, `AdminDashboard` y `Register`, reemplazándolas por la variable de entorno dinámica.
  - Implementación de la página de Registro de usuarios (`Register.jsx`) que había quedado pendiente.

## 38. Integración de Pasarela de Pagos (MercadoPago)
- **Objetivo:** Permitir a los usuarios realizar compras reales (simuladas en Sandbox) utilizando MercadoPago.
- **Backend:**
  - Instalación y configuración del SDK de `mercadopago`.
  - Creación del controlador `paymentController.js` para generar preferencias de pago.
  - Endpoint `/api/payment/create-preference` que recibe el carrito y devuelve la URL de pago (`init_point`).
- **Frontend:**
  - Implementación de la función `handlePayment` en `CartProvider` para comunicar con el backend y gestionar la redirección.
  - Conexión del botón "Pagar con MercadoPago" en `CartDrawer.jsx` para iniciar el flujo de compra.
  - Configuración de `back_urls` para que el usuario regrese a la tienda tras finalizar (éxito/fallo).

## 39. Optimización del Flujo de Compra (Checkout Dual)
- **Objetivo:** Ofrecer al usuario flexibilidad para elegir entre pago online (MercadoPago) o pago manual (Efectivo/A convenir) dentro del mismo carrito.
- **Frontend (`CartDrawer.jsx`):**
  - **Reestructuración de UI:** Se implementó un sistema de "pasos" (`step`: 'cart' vs 'checkout') para navegar dentro del panel lateral sin salir de la tienda.
  - **Integración MercadoPago:** Botón dedicado que conecta con el endpoint `/create-preference` y redirige a la pasarela segura.
  - **Flujo Manual:** Formulario de datos de envío integrado para pedidos en efectivo, conectando con el endpoint estándar de creación de órdenes.
  - Mejoras visuales con iconos (`lucide-react`) y transiciones suaves (`framer-motion`).

## 40. Verificación y Testing de Pagos (Sandbox)
- **Hito:** Se completó exitosamente el flujo de compra real (modo prueba) con MercadoPago.
- **Solución de Errores:**
  - Se resolvió el error `500 Internal Server Error` verificando las credenciales en Render.
  - Se resolvió el error de "Collector is a production user" utilizando **Cuentas de Prueba (Test Users)** y navegación en modo incógnito para separar la sesión del vendedor de la del comprador.
- **Estado Actual:** La aplicación permite:
  1. Login/Registro de usuarios.
  2. Agregar productos al carrito.
  3. Elegir entre Pagar Online (MP) o Efectivo.
  4. Procesar la transacción y vaciar el carrito post-compra.

## 41. Control de Stock Inteligente (Frontend)
- **Objetivo:** Impedir que un usuario agregue al carrito más unidades de las disponibles en inventario (Issue #3).
- **Implementación Global (`CartProvider`):**
  - Se blindaron las funciones `addToCart` y `updateQuantity` para validar contra `product.stock` antes de modificar el estado.
  - Se agregaron alertas nativas para informar al usuario cuando intenta exceder el límite.
- **Implementación UI (`ProductCard`):**
  - Refactorización completa: Ahora el componente es "consciente" del carrito (`availableStock = stock - inCartQuantity`).
  - Feedback visual:
    - Botón deshabilitado si se alcanza el límite.
    - Badges dinámicos ("Agotado", "Máximo Alcanzado", "En Carrito"). 
    - Contador bloqueado para no superar el disponible real.
- **Resultado:** Eliminación de inconsistencias entre la tienda y el carrito visual.

## 42. Globalización del Estado del Carrito (UI Fix)  
- **Problema Detectado:** El botón del carrito en el `Header` no desplegaba el menú lateral porque no había comunicación entre componentes hermanos.
- **Solución Arquitectónica:** Se migró el control de visibilidad (`isOpen`) al Contexto Global (`CartProvider`).
- **Cambios Realizados:**

## 43. Mejora en Dashboard Admin (UI)
- **Visualización de Pagos:** Se agregó una columna de estado en la tabla de órdenes para identificar rápidamente transacciones aprobadas vs. pendientes.
- **Feedback Visual:** Uso de badges de color (Verde/Amarillo) basados en la propiedad `isPaid` de la base de datos.
- **Feedback Adicional:** Se agregó el método de pago (MP/Efectivo) debajo del estado del pago.

## 44. Gestión Automática de Inventario (Backend)
- **Funcionalidad:** Implementación de lógica de descuento de stock en tiempo real.
- **Flujo:**
  1. El Webhook recibe confirmación de pago `approved`.
  2. Se valida que la orden no haya sido procesada previamente (idempotencia).
  3. Se iteran los items de la orden y se actualiza el documento `Product` en MongoDB restando la cantidad vendida.
- **Resultado:** El inventario de la tienda refleja las ventas inmediatamente después del pago.

## 45. Mejora de UI/UX: Notificaciones Modernas
- **Objetivo:** Reemplazar las alertas nativas del navegador (`window.alert`) que interrumpen la navegación y se ven anticuadas.
- **Herramienta:** Implementación de la librería `react-hot-toast`.
- **Cambios Realizados:**
  - Configuración global del componente `<Toaster />` en `App.jsx`.
  - Refactorización de `Login.jsx` para mostrar feedback de éxito/error en el inicio de sesión.
  - Refactorización de `CartDrawer.jsx` para notificaciones de compra, validación de stock y errores.
- **Resultado:** Feedback visual no intrusivo, estético y consistente con el diseño de la aplicación.

## 46. Sistema de Notificaciones y Ajuste de Webhooks
- **Funcionalidad:** Sistema de alertas para administradores y usuarios sobre eventos importantes (Ventas, Stock, etc.).
- **Backend:**
  - Creación del modelo `Notification` y rutas API.
  - Integración en `paymentController`: Generación automática de alerta al Admin tras pago exitoso.
  - Refactorización de `receiveWebhook` para evitar duplicidad de lógica y errores de variables (`totalPrice`).
- **Frontend:**
  - Creación de Hook `useNotifications` con *polling* (actualización cada 30s).
  - Implementación de UI: Componente `NotificationMenu` y contador en el Header.
  - Corrección de rutas API (singular/plural) para sincronizar con el servidor.
- **Resultado:** El administrador recibe un aviso visual inmediato cuando se concreta una venta.

## 47. Sistema Integral de Notificaciones y Robustez en Pagos
- **Objetivo:** Cerrar el ciclo de comunicación entre el sistema, el administrador y el cliente, y solucionar problemas de concurrencia en los pagos.
- **Backend (Notificaciones):**
  - Creación del modelo `Notification` (Mensaje, Tipo, Usuario destino, Leído).
  - Implementación de lógica automática de avisos en los controladores:
    - **Ventas:** Aviso al Admin cuando entra un pago (Webhook) o una orden en efectivo.
    - **Turnos:** Aviso al Admin al solicitar, aviso al Cliente al confirmar/cancelar.
    - **Logística:** Aviso al Cliente cuando su pedido es marcado como "Enviado/Entregado".
- **Backend (Pagos & Webhooks):**
  - **Corrección de Bug Crítico:** Solución a la "Condición de Carrera" (Race Condition) en Mercado Pago usando `findOneAndUpdate` atómico para evitar duplicidad de notificaciones y doble descuento de stock.
  - Estandarización de lectura del Webhook (Body vs Query).
- **Frontend (Admin Dashboard):**
  - Implementación de **Botones de Acción Rápida** en tablas (Camión para envíos, Check/X para turnos) para agilizar la gestión.
  - Corrección de rutas API (Error 404 en `/status`) para sincronizar con el Backend.
  - Integración de `react-hot-toast` para feedback visual inmediato.
- **Frontend (Cliente):**
  - Nuevo componente `NotificationMenu` y Hook `useNotifications` con polling (actualización automática cada 30s).
  - Indicador visual (punto rojo) en el Header para nuevas alertas.