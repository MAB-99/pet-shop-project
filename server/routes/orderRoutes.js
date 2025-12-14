import express from 'express';
import { addOrderItems, getMyOrders } from '../controllers/orderController.js';
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

router.post('/', checkAuth, addOrderItems);
router.get('/myorders', checkAuth, getMyOrders);

export default router;