import User from '../models/User.js';
import generarJWT from '../helpers/generarJWT.js';

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
        res.json({
            _id: usuarioAlmacenado._id,
            name: usuarioAlmacenado.name,
            email: usuarioAlmacenado.email,
            token: generarJWT(usuarioAlmacenado._id),
        });

    } catch (error) {
        console.log(error);
    }
};


const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // 1. Comprobar si el usuario existe
    const usuario = await User.findOne({ email });
    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    // 2. Comprobar su password
    // Usamos el método que definimos en el Modelo (comprobarPassword)
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            name: usuario.name,
            email: usuario.email,
            token: generarJWT(usuario._id),
        });
    } else {
        const error = new Error('El Password es incorrecto');
        return res.status(403).json({ msg: error.message });
    }
};

const perfil = (req, res) => {
    // Al pasar por el middleware, ya tenemos el usuario guardado en req.user
    const { user } = req;
    res.json(user);
};

export {
    registrarUsuario,
    autenticar,
    perfil
};