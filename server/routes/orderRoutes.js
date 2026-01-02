import express from 'express';
import {
    addOrderItems,
    getMyOrders,
    getAllOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderStatus,
    getDashboardStats
} from '../controllers/orderController.js';
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

router.post('/', checkAuth, addOrderItems);
router.get('/myorders', checkAuth, getMyOrders);
router.get('/stats', checkAuth, getDashboardStats);
router.get('/', checkAuth, getAllOrders);
router.put('/:id/status', checkAuth, updateOrderStatus);
router.put('/:id/paid', checkAuth, updateOrderToPaid);
router.put('/:id/delivered', checkAuth, updateOrderToDelivered);
export default router;