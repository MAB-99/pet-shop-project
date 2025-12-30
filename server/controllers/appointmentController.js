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
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment) {
            const oldStatus = appointment.status;
            appointment.status = req.body.status || appointment.status;

            const updatedAppointment = await appointment.save();

            // 🔔 2. NOTIFICAR AL CLIENTE (Si el estado cambió)
            if (oldStatus !== updatedAppointment.status) {
                let emoji = 'ℹ️';
                let text = `Tu turno ha cambiado a: ${updatedAppointment.status}`;

                if (updatedAppointment.status === 'Confirmed') {
                    emoji = '✅';
                    text = `¡Buenas noticias! Tu turno para ${appointment.petName} fue CONFIRMADO.`;
                } else if (updatedAppointment.status === 'Cancelled') {
                    emoji = '❌';
                    text = `Lo sentimos, tu turno para ${appointment.petName} fue cancelado.`;
                }

                await Notification.create({
                    user: appointment.user, // ID del cliente
                    message: `${emoji} ${text}`,
                    type: 'appointment',
                    link: '/profile' // Para que vaya a ver sus turnos
                });
            }

            res.json(updatedAppointment);
        } else {
            res.status(404).json({ message: 'Turno no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar' });
    }
};

export {
    createAppointment,
    getAllAppointments,
    updateAppointment
};