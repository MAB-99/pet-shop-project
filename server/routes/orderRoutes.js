import express from 'express';
import { addOrderItems, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

router.post('/', checkAuth, addOrderItems);
router.get('/myorders', checkAuth, getMyOrders);
router.get('/', checkAuth, getAllOrders);
router.put('/:id/status', checkAuth, updateOrderStatus);

export default router;