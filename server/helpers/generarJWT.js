import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    // .sign crea el token
    // Primer dato: La información que guardamos dentro (el ID del usuario)
    // Segundo dato: La palabra secreta del .env
    // Tercer dato: Opciones (cuándo caduca)
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // El token dura 30 días
    });
};

export default generarJWT;