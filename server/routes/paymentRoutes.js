import express from 'express';
import { createPreference, receiveWebhook } from '../controllers/paymentController.js';
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

router.post('/create-preference', checkAuth, createPreference);

// RUTA NUEVA: Aquí MercadoPago nos avisará los cambios
router.post('/webhook', receiveWebhook);

export default router;