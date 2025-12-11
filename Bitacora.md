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