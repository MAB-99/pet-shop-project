import Notification from '../models/Notification.js';

// Obtener mis notificaciones
const getNotifications = async (req, res) => {
    try {
        let query;

        if (req.user.isAdmin) {
            // Si es admin, ve sus propias notificaciones Y las que son para "null" (generales de admin)
            query = { $or: [{ user: req.user._id }, { user: null }] };
        } else {
            // Si es cliente, solo ve las suyas
            query = { user: req.user._id };
        }

        // Traemos las no leídas primero y luego las más nuevas
        const notifications = await Notification.find(query)
            .sort({ isRead: 1, createdAt: -1 })
            .limit(20);

        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener notificaciones' });
    }
};

// Marcar como leída
const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findById(id);
        if (!notification) return res.status(404).json({ msg: 'No encontrado' });

        notification.isRead = true;
        await notification.save();
        res.json({ msg: 'Notificación leída' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar' });
    }
};

// Eliminar (Opcional, para limpiar)
const deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        await Notification.findByIdAndDelete(id);
        res.json({ msg: 'Notificación eliminada' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar' });
    }
};

export { getNotifications, markAsRead, deleteNotification };