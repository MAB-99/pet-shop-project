import express from 'express';
import { createPreference, receiveWebhook } from '../controllers/paymentController.js';
import { authMiddleware } from '../middlewares/auth.Middleware.js';

const router = express.Router();

router.post('/create-preference', authMiddleware, createPreference);

// RUTA NUEVA: Aquí MercadoPago nos avisará los cambios
router.post('/webhook', receiveWebhook);

export default router;