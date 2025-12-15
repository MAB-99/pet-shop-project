import express from 'express';
import {
    createAppointment,
    getAllAppointments,
    updateAppointmentStatus
} from '../controllers/appointmentController.js';
import checkAuth from '../middleware/auth.Middleware.js';

const router = express.Router();

// Ruta pública (pero requiere login) para solicitar
router.post('/', checkAuth, createAppointment);

// Rutas Admin
router.get('/', checkAuth, getAllAppointments);
router.put('/:id/status', checkAuth, updateAppointmentStatus);

export default router;