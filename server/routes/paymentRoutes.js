import express from 'express';
import { createPreference, receiveWebhook } from '../controllers/paymentController.js';
// 👇 1. IMPORTAR ESTO
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

// 👇 2. AGREGAR "checkAuth" AQUÍ (El portero de seguridad)
router.post('/create-preference', checkAuth, createPreference);

router.post('/webhook', receiveWebhook);

export default router;