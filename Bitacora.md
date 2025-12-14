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