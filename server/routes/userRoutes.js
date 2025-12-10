import express from 'express';
import { registrarUsuario } from '../controllers/userController.js';

const router = express.Router();

// Cuando alguien visite '/' (la raíz de usuarios) usando POST, ejecuta registrarUsuario
router.post('/', registrarUsuario);

export default router;