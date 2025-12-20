import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Package, Calendar, MapPin, Loader2, AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Profile = () => {
    const { auth, cargando } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Si no está logueado, patada al login
    useEffect(() => {
        if (!cargando && !auth._id) {
            navigate('/login');
        }
    }, [auth, cargando, navigate]);

    // Traer historial de órdenes
    useEffect(() => {
        const fetchOrders = async () => {
            if (!auth._id) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                };
                // NOTA: Asumimos que creamos esta ruta en el backend. 
                // Si falla, la crearemos en el siguiente paso.
                const { data } = await axios.get(`${API_URL}/api/order/myorders`, config);
                setOrders(data);
            } catch (error) {
                console.error("Error cargando órdenes:", error);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [auth]);

    if (cargando) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-10 w-10 text-yellow-600" /></div>;

    return (
        <>
            <Helmet><title>Mi Perfil - FIDO'S</title></Helmet>

            <div className="container mx-auto px-4 py-10 bg-gray-50/50 min-h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* TARJETA DE USUARIO */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-yellow-700">
                                {auth.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{auth.name}</h2>
                            <p className="text-gray-500 text-sm mb-6">{auth.email}</p>

                            <div className="text-left space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex items-center text-sm text-gray-600">
                                    <User className="w-4 h-4 mr-3 text-gray-400" />
                                    <span>Cliente Registrado</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                                    <span>Córdoba, Argentina</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* HISTORIAL DE PEDIDOS */}
                    <main className="lg:col-span-3">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Package className="text-yellow-600" /> Mis Pedidos Recientes
                        </h2>

                        {loadingOrders ? (
                            <div className="text-center py-10"><Loader2 className="animate-spin h-8 w-8 mx-auto text-gray-400" /></div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
                                <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Aún no tienes pedidos</h3>
                                <p className="text-gray-500 mb-6">¡Explora nuestra tienda y mima a tu mascota!</p>
                                <button onClick={() => navigate('/tienda')} className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-700 transition">
                                    Ir a la Tienda
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 pb-4 border-b border-gray-50">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Orden #{order._id.substring(0, 8)}</p>
                                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="mt-4 md:mt-0 flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {order.isPaid ? 'Pagado' : 'Pendiente de Pago'}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {order.isDelivered ? 'Enviado' : 'En Proceso'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {order.orderItems.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover bg-gray-50" />
                                                        <span className="text-gray-700 font-medium">
                                                            {item.name} <span className="text-gray-400">x{item.qty}</span>
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-600">${item.price * item.qty}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Total de la orden</span>
                                            <span className="text-xl font-bold text-gray-900">${order.totalPrice}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default Profile;