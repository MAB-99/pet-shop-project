// index.js

// 1. Importar las librerías
import express from 'express'; // El servidor en sí
import cors from 'cors';       // Permiso para que el front hable con el back
import dotenv from 'dotenv';   // Para leer variables de entorno

// Cargar configuración de variables de entorno (si tuvieras un archivo .env)
dotenv.config();

// 2. Crear la aplicación de Express
const app = express();

// 3. Middlewares (Configuraciones intermedias)
app.use(cors());                 // Habilitar CORS
app.use(express.json());         // Permitir que el servidor entienda datos JSON (muy importante para el login)

// 4. Rutas (Endpoints)
// Esta es una ruta de prueba para ver si funciona
app.get('/', (req, res) => {
    res.send('¡Hola! El servidor del Pet Shop está funcionando 🐶🐱');
});

// 5. Levantar el servidor
const PORT = process.env.PORT || 4000; // Usar el puerto definido o el 4000
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});