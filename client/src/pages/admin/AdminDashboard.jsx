import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import ProductTable from './ProductTable';
import ProductForm from '../../components/ProductForm';

const OverviewTab = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0 });
    const { auth } = useAuth(); // Para obtener el token si usas context

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:4000/api/order/stats', {
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

            const response = await fetch('http://localhost:4000/api/order', {
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
            const response = await fetch(`http://localhost:4000/api/order/${orderId}/status`, {
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
                                </nav>
                            </div>
                        </aside>

                        <main className="flex-1">
                            {activeTab === 'overview' && <OverviewTab />}
                            {activeTab === 'products' && <ProductsTab />}
                            {activeTab === 'orders' && <OrdersTab />}
                        </main>

                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;