import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,      // Es obligatorio
        trim: true           // Elimina espacios al inicio y final "  Juan " -> "Juan"
    },
    email: {
        type: String,
        required: true,
        unique: true,        // No puede haber dos usuarios con el mismo email
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false       // Por defecto, nadie es administrador
    },
    token: {                 // Para confirmar cuenta o recuperar contraseña (opcional por ahora)
        type: String
    }
}, {
    timestamps: true         // Crea automáticamente campos: createdAt y updatedAt
});

const User = mongoose.model('User', userSchema);

export default User;