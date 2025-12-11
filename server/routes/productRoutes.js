import express from 'express';
import { agregarProducto, obtenerProductos } from '../controllers/productController.js';
// Importamos el middleware porque para AGREGAR productos, deberías estar logueado
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

// Ruta para obtener productos (Pública: Cualquiera puede ver el catálogo)
router.get('/', obtenerProductos);

// Ruta para agregar productos (Privada: Solo usuarios registrados)
router.post('/', checkAuth, agregarProducto);

export default router;