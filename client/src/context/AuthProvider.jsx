import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../lib/constants';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    // 1. Efecto: Al cargar la página, comprobar si hay token en localStorage
    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setCargando(false);
                return;
            }

            // Si hay token, preguntamos al backend si es válido y quién es el dueño
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            try {
                // NOTA: Ruta en SINGULAR como pediste
                const { data } = await axios.get(`${API_URL}/api/user/perfil`, config);
                setAuth(data); // Guardamos al usuario en el estado global
                // Si estamos en login, redirigir al home (opcional)
            } catch (error) {
                console.log(error);
                setAuth({});
                localStorage.removeItem('token'); // Si el token venció, lo borramos
            } finally {
                setCargando(false);
            }
        };

        autenticarUsuario();
    }, []);

    // 2. Función para Cerrar Sesión
    const cerrarSesion = () => {
        setAuth({});
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export {
    AuthProvider
};

export default AuthContext;