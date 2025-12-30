import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Mail, Lock } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { API_URL } from '../lib/constants';
import toast from 'react-hot-toast';

function Login() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alerta, setAlerta] = useState(null); // Para mostrar errores
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlerta(null);

        try {
            // 1. Petición al Backend que creamos
            const { data } = await axios.post(`${API_URL}/api/user/login`, {
                email,
                password
            });

            // 2. Si todo sale bien, guardamos el Token en el navegador
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data)); // Guardamos nombre/email
            setAuth(data);

            // 3. Redireccionamos (Por ahora al home, luego al perfil)
            console.log("Login Exitoso:", data);
            navigate('/');
            toast.success('Login Exitoso, Bienvenido ' + data.user.name);

        } catch (error) {
            // Manejo de errores del backend
            setAlerta(error.response?.data?.msg || 'Hubo un error al iniciar sesión');
            toast.error(error.response?.data?.msg || 'Hubo un error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8 space-y-8">

                {/* Encabezado */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bienvenido</h1>
                    <p className="text-gray-500 text-sm">Ingresa a tu cuenta para gestionar pedidos y turnos.</p>
                </div>

                {/* Alerta de Error */}
                {alerta && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-sm mb-4">
                        {alerta}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Input Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                disabled={loading} />
                        </div>
                    </div>

                    {/* Input Password */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">Contraseña</label>
                            <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                disabled={loading} />
                        </div>
                    </div>

                    {/* Botón Submit */}
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-11 px-8 w-full"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Ingresar'}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center text-sm">
                    <span className="text-gray-600">¿Nuevo aquí? </span>
                    <Link to="/registro" className="font-bold text-blue-600 hover:underline">Crea una cuenta</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;