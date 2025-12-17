import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../lib/constants'; // Usamos la URL centralizada

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validación simple
        if ([name, email, password].includes('')) {
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }

        try {
            // Petición al Backend
            const response = await fetch(`${API_URL}/api/user`, { // Asumimos que POST /api/user crea el usuario
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Registro exitoso
                alert("¡Cuenta creada correctamente! Ahora puedes iniciar sesión.");
                navigate('/login');
            } else {
                // Error del backend (ej: "Usuario ya existe")
                setError(data.msg || data.message || 'Error al registrarse');
            }
        } catch (error) {
            console.error(error);
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Crear Cuenta</h1>
                <p className="text-gray-500 text-center mb-8">Únete a nuestra comunidad</p>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
                        <input
                            type="text"
                            placeholder="Ej: Juan Pérez"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
                        <input
                            type="password"
                            placeholder="******"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Registrarme'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 border-t pt-6">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="text-yellow-600 font-bold hover:underline">
                        Inicia Sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;