import User from '../models/User.js';

const registrarUsuario = async (req, res) => {
    // req.body contiene los datos que envía el usuario (nombre, email, password)
    const { email } = req.body;

    // 1. Evitar duplicados: Preguntar a la DB si el usuario ya existe
    const existeUsuario = await User.findOne({ email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // 2. Crear una instancia del Modelo con los datos recibidos
        const usuario = new User(req.body);

        // 3. Guardar en la Base de Datos (Aquí actúa el Schema y crea el ID)
        const usuarioAlmacenado = await usuario.save();

        // 4. Responder al Frontend con los datos guardados
        res.json(usuarioAlmacenado);

    } catch (error) {
        console.log(error);
    }
};

export {
    registrarUsuario
};