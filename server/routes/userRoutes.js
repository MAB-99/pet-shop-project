import express from 'express';
import { registrarUsuario, autenticar, perfil } from '../controllers/userController.js';
import checkAuth from '../middleware/auth.Middleware.js';
const router = express.Router();

// Autenticación, Registro y Confirmación de Usuarios
router.post('/', registrarUsuario);
router.post('/login', autenticar);
router.get('/perfil', checkAuth, perfil);

export default router;  