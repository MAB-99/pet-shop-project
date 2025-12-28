import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import ProductTable from './ProductTable';
import ProductForm from '../../components/ProductForm';
import { Calendar } from 'lucide-react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { API_URL } from '../../lib/constants';


const AppointmentsTab = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para Modales
    const [selectedImage, setSelectedImage] = useState(null); // Para el Zoom de foto
    const [confirmingId, setConfirmingId] = useState(null);   // ID del turno que estamos por confirmar
    const [selectedDate, setSelectedDate] = useState('');     // Fecha que elige el admin

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/appointment`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAppointments(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, []);

    // Acción principal de cambio de estado
    const handleStatusChange = (id, newStatus) => {
        if (newStatus === 'Confirmado') {
            // Si elige confirmado, NO guardamos todavía. Abrimos el modal de fecha.
            setConfirmingId(id);
        } else {
            // Si es otro estado (Cancelado, Finalizado), guardamos directo.
            saveStatus(id, newStatus);
        }
    };

    // Guardar cambios en Backend
    const saveStatus = async (id, newStatus, date = null) => {
        try {
            const token = localStorage.getItem('token');
            const body = { status: newStatus };
            if (date) body.confirmedDate = date;

            const response = await fetch(`${API_URL}/api/appointment/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                fetchAppointments(); // Recargar lista
                setConfirmingId(null); // Cerrar modal si estaba abierto
                setSelectedDate('');
            }
        } catch (error) {
            console.error(error);
            alert("Error al actualizar");
        }
    };

    // Helper: Filtrar turnos ya confirmados para mostrar en la agenda
    const getBusySlots = () => {
        return appointments
            .filter(a => a.status === 'Confirmado' && a.confirmedDate)
            .sort((a, b) => new Date(a.confirmedDate) - new Date(b.confirmedDate));
    };

    if (loading) return <div className="p-8 text-center">Cargando turnos...</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Gestión de Peluquería</h3>

            {/* --- MODAL DE ZOOM DE IMAGEN --- */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-5 right-5 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700">
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Zoom mascota"
                        className="max-h-[90vh] max-w-full rounded-lg shadow-2xl border-4 border-white"
                        onClick={(e) => e.stopPropagation()} // Para que no se cierre si clickeas la foto
                    />
                </div>
            )}

            {/* --- MODAL DE CONFIRMACIÓN DE AGENDA --- */}
            {confirmingId && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <CalendarIcon className="text-yellow-500" /> Agendar Turno
                            </h4>
                            <button onClick={() => setConfirmingId(null)}><X className="text-gray-400 hover:text-gray-600" /></button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona Fecha y Hora:</label>
                            <input
                                type="datetime-local"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 outline-none"
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        {/* Lista visual de ocupados */}
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">📅 Turnos ya confirmados:</p>
                            {getBusySlots().length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No hay turnos confirmados futuros.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {getBusySlots().map(appt => (
                                        <li key={appt._id} className="text-sm flex items-center gap-2 text-gray-700">
                                            <Clock size={14} className="text-blue-500" />
                                            <span className="font-mono font-bold">
                                                {new Date(appt.confirmedDate).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}hs
                                            </span>
                                            - {appt.petName} ({appt.user?.name})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setConfirmingId(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    if (!selectedDate) return alert("Por favor selecciona una fecha");
                                    saveStatus(confirmingId, 'Confirmado', selectedDate);
                                }}
                                className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 shadow-md"
                            >
                                Confirmar Turno
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- LISTA DE TARJETAS (IGUAL QUE ANTES CON CAMBIOS MENORES) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appt) => (
                    <div key={appt._id} className={`border rounded-lg p-4 flex flex-col justify-between transition-all ${appt.status === 'Confirmado' ? 'bg-white border-green-200 shadow-md ring-1 ring-green-100' : 'bg-gray-50 border-gray-200'}`}>
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800">{appt.petName}</h4>
                                    <p className="text-sm text-gray-500">{appt.user?.name}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full border font-bold ${appt.status === 'Confirmado' ? 'bg-green-100 text-green-700 border-green-200' :
                                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    }`}>
                                    {appt.status}
                                </span>
                            </div>

                            {/* IMAGEN CON ZOOM AL CLICK */}
                            <div
                                className="w-full h-48 bg-gray-200 rounded-md mb-4 overflow-hidden cursor-zoom-in group relative"
                                onClick={() => setSelectedImage(appt.petPhoto)}
                            >
                                <img src={appt.petPhoto} alt={appt.petName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 text-white font-bold drop-shadow-md">Ver Foto</span>
                                </div>
                            </div>

                            {/* DATOS DEL TURNO */}
                            {appt.status === 'Confirmado' && appt.confirmedDate && (
                                <div className="bg-green-50 p-2 rounded mb-3 border border-green-100">
                                    <p className="text-xs text-green-800 font-bold flex items-center gap-1">
                                        <CalendarIcon size={12} />
                                        {new Date(appt.confirmedDate).toLocaleDateString()}
                                        <Clock size={12} className="ml-1" />
                                        {new Date(appt.confirmedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}hs
                                    </p>
                                </div>
                            )}

                            <p className="text-sm text-gray-600 mb-2"><strong>Nota:</strong> {appt.notes || '-'}</p>
                        </div>

                        <div className="space-y-3 mt-2 pt-3 border-t border-gray-100">
                            <a
                                href={`https://wa.me/${appt.contactPhone}?text=Hola, te contacto por el turno de ${appt.petName}.`}
                                target="_blank" rel="noreferrer"
                                className="block w-full text-center bg-green-500 text-white py-2 rounded hover:bg-green-600 transition font-medium flex items-center justify-center gap-2"
                            >
                                <span>💬 WhatsApp</span>
                            </a>

                            <select
                                className="block w-full border border-gray-300 rounded p-2 text-sm bg-white"
                                value={appt.status}
                                onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Confirmado">Confirmado (Agendar)</option>
                                <option value="Finalizado">Finalizado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OverviewTab = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0 });
    const { auth } = useAuth(); // Para obtener el token si usas context

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/order/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error cargando estadísticas:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen General</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Tarjeta de Ventas */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-blue-600 text-sm font-semibold">Ventas Totales</p>
                    <p className="text-2xl font-bold text-blue-900">
                        ${stats.totalSales.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Tarjeta de Órdenes */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-green-600 text-sm font-semibold">Órdenes Activas</p>
                    <p className="text-2xl font-bold text-green-900">
                        {stats.totalOrders}
                    </p>
                </div>

                {/* Tarjeta de Productos */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <p className="text-yellow-600 text-sm font-semibold">Productos en Catálogo</p>
                    <p className="text-2xl font-bold text-yellow-900">
                        {stats.totalProducts}
                    </p>
                </div>

            </div>
        </div>
    );
};

const ProductsTab = () => {
    const [view, setView] = useState('table');
    const [editingProduct, setEditingProduct] = useState(null);

    const handleNew = () => {
        setEditingProduct(null);
        setView('form');
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setView('form');
    };

    const handleSuccess = () => {
        setView('table');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    {view === 'table' ? 'Gestión de Productos' : (editingProduct ? 'Editar Producto' : 'Nuevo Producto')}
                </h2>

                {view === 'table' && (
                    <button
                        onClick={handleNew}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 shadow-md"
                    >
                        <Plus className="w-4 h-4" /> Nuevo Producto
                    </button>
                )}
            </div>

            {view === 'table' ? (
                <ProductTable onEdit={handleEdit} />
            ) : (
                <ProductForm
                    productToEdit={editingProduct}
                    onSuccess={handleSuccess}
                    onCancel={() => setView('table')}
                />
            )}
        </div>
    );
};

const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth(); // Necesitamos el token si lo guardas en context o localStorage

    // Función para obtener órdenes
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token'); // O auth.token, depende donde lo guardes
            if (!token) return;

            const response = await fetch(`${API_URL}/api/order`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setLoading(false);
        }
    };

    // Función para cambiar estado
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/order/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Actualizar UI localmente
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("No se pudo actualizar el estado");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Función helper para el color del badge
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Enviado': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Entregado': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center p-10">Cargando órdenes...</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Gestión de Órdenes</h3>

            {orders.length === 0 ? (
                <div className="text-center text-gray-500 py-10">No hay órdenes registradas.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                <th className="p-4 font-semibold">ID Orden</th>
                                <th className="p-4 font-semibold">Cliente</th>
                                <th className="p-4 font-semibold">Fecha</th>
                                <th className="p-4 font-semibold">Estado Pago</th>
                                <th className="p-4 font-semibold">Total</th>
                                <th className="p-4 font-semibold">Estado</th>
                                <th className="p-4 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-xs font-mono text-gray-500">
                                        {order._id.substring(20, 24)}... {/* Mostramos solo el final del ID */}
                                    </td>
                                    <td className="p-4 text-sm font-medium text-gray-800">
                                        {order.user?.name || "Usuario Eliminado"}
                                        <div className="text-xs text-gray-400">{order.user?.email}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isPaid
                                                ? 'bg-green-100 text-green-800' // Verde si está pagado
                                                : 'bg-yellow-100 text-yellow-800' // Amarillo si está pendiente
                                            }`}>
                                            {order.isPaid ? 'Aprobado' : 'Pendiente'}
                                        </span>
                                        {/* Opcional: Mostrar el método de pago debajo en pequeño */}
                                        <div className="text-xs text-gray-400 mt-1">
                                            {order.paymentMethod === 'MercadoPago' ? 'Mercado Pago' : 'Efectivo'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm font-bold text-gray-800">
                                        ${order.totalPrice}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                            {order.status || (order.isDelivered ? 'Entregado' : 'Pendiente')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={order.status || 'Pendiente'}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="block w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Enviado">Enviado</option>
                                            <option value="Entregado">Entregado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { auth, cargando } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!cargando) {
            if (!auth._id) {
                navigate('/login');
            } else if (!auth.isAdmin) {
                navigate('/');
            }
        }
    }, [auth, cargando, navigate]);

    if (cargando) return <div className="p-10 text-center">Cargando panel...</div>;
    if (!auth.isAdmin) return null;

    return (
        <>
            <Helmet><title>Admin Panel - FIDO'S</title></Helmet>

            <div className="min-h-screen bg-gray-100/50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">

                        <aside className="w-full md:w-64 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                                <div className="p-6 border-b border-gray-50 bg-gray-900 text-white">
                                    <h2 className="text-lg font-bold">Panel Admin</h2>
                                    <p className="text-xs text-gray-400">Bienvenido, {auth.name}</p>
                                </div>
                                <nav className="p-2 space-y-1">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <LayoutDashboard className="w-5 h-5" /> Resumen
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('products')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'products' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <Package className="w-5 h-5" /> Productos
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <ShoppingBag className="w-5 h-5" /> Órdenes
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('appointments')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'appointments' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <Calendar className="w-5 h-5" /> Peluquería
                                    </button>
                                </nav>
                            </div>
                        </aside>

                        <main className="flex-1">
                            {activeTab === 'overview' && <OverviewTab />}
                            {activeTab === 'products' && <ProductsTab />}
                            {activeTab === 'orders' && <OrdersTab />}
                            {activeTab === 'appointments' && <AppointmentsTab />}
                        </main>

                    </div>
                </div>
            </div>
        </>
    );
};



export default AdminDashboard;