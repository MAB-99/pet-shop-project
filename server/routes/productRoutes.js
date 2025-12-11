import express from 'express';
import {
    agregarProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
} from '../controllers/productController.js';
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

// Rutas a la raíz '/' (Obtener todos y Crear uno)
router.route('/')
    .get(obtenerProductos)
    .post(checkAuth, agregarProducto);

// Rutas con ID '/:id' (Operaciones sobre un producto específico)
router.route('/:id')
    .get(obtenerProducto)
    .put(checkAuth, actualizarProducto)
    .delete(checkAuth, eliminarProducto);

export default router;