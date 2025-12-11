import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkAuth = async (req, res, next) => {
    let token;

    // 1. Verificamos si la petición trae un "Header" de autorización y si empieza con "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Obtenemos el token (quitamos la palabra "Bearer " del inicio)
            token = req.headers.authorization.split(' ')[1];

            // 3. Verificamos la firma usando tu palabra secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Buscamos al usuario por el ID que venía en el token
            // .select('-password') sirve para NO traer la contraseña, por seguridad
            req.user = await User.findById(decoded.id).select('-password -token -confirmado');

            // 5. ¡Todo bien! Pasamos al siguiente eslabón (el Controller)
            return next();

        } catch (error) {
            // Si el token expiró o es falso, cae aquí
            return res.status(404).json({ msg: 'Hubo un error con el token' });
        }
    }

    // Si no había token en absoluto
    if (!token) {
        const error = new Error('Token no válido o inexistente');
        return res.status(401).json({ msg: error.message });
    }
};

export default checkAuth;