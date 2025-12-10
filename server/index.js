import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routing
app.use('/api/user', userRoutes);

const conectarDB = async () => {
    try {
        // Volvemos a usar la variable de entorno
        const db = await mongoose.connect(process.env.MONGO_URI);

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`2. ✅ MongoDB conectado en: ${url}`);

        // Iniciamos el servidor SOLO si la DB conecta
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`3. 🚀 Servidor corriendo en puerto ${PORT}`);
        });

    } catch (error) {
        console.log(`2. ❌ Error conectando a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

console.log('1. ⏳ Iniciando servidor...');
conectarDB();