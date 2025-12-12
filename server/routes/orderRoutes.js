import express from 'express';
import { addOrderItems } from '../controllers/orderController.js';
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

// Solo usuarios registrados pueden comprar (checkAuth)
router.post('/', checkAuth, addOrderItems);

export default router;