import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';

// 1. Crear nueva solicitud (Cliente)
const createAppointment = async (req, res) => {
    const { petName, petPhoto, contactPhone, notes } = req.body;

    try {
        const appointment = new Appointment({
            user: req.user._id, // Obtenido del token JWT
            petName,
            petPhoto,
            contactPhone,
            notes
        });

        const savedAppointment = await appointment.save();

        await Notification.create({
            user: null, // Para todos los admins
            message: `¡Nueva solicitud de turno!`,
            type: 'appointment',
            link: '/admin'
        });
        res.status(201).json(savedAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al solicitar el turno' });
    }
};

// 2. Obtener todos los turnos (Admin)
const getAllAppointments = async (req, res) => {
    try {
        // Traemos también nombre y email del usuario dueño
        const appointments = await Appointment.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener turnos' });
    }
};

// 3. Cambiar estado del turno (Admin)
const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status, confirmedDate } = req.body; // <--- Extraemos confirmedDate

    try {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ msg: 'Turno no encontrado' });
        }

        await Notification.create({
            user: null, // Para todos los admins
            message: `¡Turno ${appointment.status}!`,
            type: 'appointment',
            link: '/admin'
        });

        appointment.status = status;

        // Si nos envían una fecha confirmada, la guardamos
        if (confirmedDate) {
            appointment.confirmedDate = confirmedDate;
        }

        const updated = await appointment.save();
        res.json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar estado' });
    }
};

export {
    createAppointment,
    getAllAppointments,
    updateAppointmentStatus
};