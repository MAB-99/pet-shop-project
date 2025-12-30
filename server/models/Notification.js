import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    // Si user es null, significa que es una notificación para TODOS los Admins
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['order', 'appointment', 'system'],
        default: 'system'
    },
    link: { // Para redirigir al hacer clic (ej: /admin/orders)
        type: String,
        default: ''
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;