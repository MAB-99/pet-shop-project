# Bitácora de Desarrollo - Pet Shop

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