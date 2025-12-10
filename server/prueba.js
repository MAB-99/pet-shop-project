import mongoose from 'mongoose';

const uri = 'mongodb://127.0.0.1:27017/test_db';

console.log('⏳ Intentando conectar a MongoDB...');

mongoose.connect(uri, { family: 4 })
    .then(() => {
        console.log('✅ ¡ÉXITO! MongoDB está funcionando y acepta conexiones.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ ERROR FATAL: No se pudo conectar.');
        console.error('Causa probable: El servicio de MongoDB está apagado o el puerto 27017 está bloqueado.');
        console.error(error);
        process.exit(1);
    });