import express from 'express';
import { registrarUsuario, autenticar } from '../controllers/userController.js';

const router = express.Router();

// Autenticación, Registro y Confirmación de Usuarios
router.post('/', registrarUsuario);
router.post('/login', autenticar);

export default router;