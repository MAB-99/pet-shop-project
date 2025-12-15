import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Referencia al dueño (Usuario logueado)
    },
    petName: {
        type: String,
        required: true,
        trim: true
    },
    petPhoto: {
        type: String,
        required: true,
        // Por ahora seguiremos usando URL de imagen (luego podemos poner subida de archivos real)
    },
    contactPhone: {
        type: String,
        required: true,
        // Importante para el WhatsApp
    },
    dateRequested: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Pendiente',
        enum: ['Pendiente', 'Confirmado', 'Finalizado', 'Cancelado']
    },
    confirmedDate: {
        type: Date, // Aquí guardaremos la fecha final del turno
    },
    notes: {
        type: String // Alguna observación extra del cliente
    }
}, {
    timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;