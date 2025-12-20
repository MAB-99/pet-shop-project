import express from 'express';
import { createPreference } from '../controllers/paymentController.js';
// Importamos authMiddleware si quieres que solo usuarios logueados paguen
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

router.post('/create-preference', checkAuth, createPreference);

export default router;