import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    }
}, {
    timestamps: true
});

// El Hook de Encriptación
userSchema.pre('save', async function (next) {
    // Si la contraseña no se modificó (ej: el usuario solo cambió su nombre), no la vuelvas a hashear
    if (!this.isModified('password')) {
        return next();
    }

    // Generar la "sal" (código aleatorio para hacer el hash único)
    const salt = await bcrypt.genSalt(10);
    // Reemplazar la contraseña plana por la encriptada
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comprobar password (lo usaremos en el Login)
userSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;