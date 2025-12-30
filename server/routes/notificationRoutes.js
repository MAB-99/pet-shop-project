import express from 'express';
import { getNotifications, markAsRead, deleteNotification } from '../controllers/notificationController.js';
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

router.get('/', checkAuth, getNotifications);
router.put('/:id/read', checkAuth, markAsRead);
router.delete('/:id', checkAuth, deleteNotification);

export default router;