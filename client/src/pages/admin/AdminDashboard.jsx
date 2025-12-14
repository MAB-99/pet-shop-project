import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import ProductTable from './ProductTable';
import ProductForm from '../../components/ProductForm';

// Componentes "Placeholder" (Los desarrollaremos uno por uno luego)
const OverviewTab = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen General</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-blue-600 text-sm font-semibold">Ventas Totales</p>
                <p className="text-2xl font-bold text-blue-900">$0.00</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-green-600 text-sm font-semibold">Órdenes Recientes</p>
                <p className="text-2xl font-bold text-green-900">0</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="text-yellow-600 text-sm font-semibold">Productos Activos</p>
                <p className="text-2xl font-bold text-yellow-900">0</p>
            </div>
        </div>
    </div>
);

const ProductsTab = () => {
    // Estado interno para saber si mostramos Tabla o Formulario
    const [view, setView] = useState('table'); // 'table' | 'form'
    const [editingProduct, setEditingProduct] = useState(null);

    // Acción al dar click en "Nuevo Producto"
    const handleNew = () => {
        setEditingProduct(null); // Limpiamos para crear uno nuevo
        setView('form');
    };

    // Acción al dar click en "Editar" (viene de la tabla)
    const handleEdit = (product) => {
        setEditingProduct(product);
        setView('form');
    };

    // Acción cuando el formulario termina (guardó exitoso)
    const handleSuccess = () => {
        setView('table');
        // Aquí idealmente recargaríamos la tabla, pero al volver a montarla se recarga sola por su useEffect
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    {view === 'table' ? 'Gestión de Productos' : (editingProduct ? 'Editar Producto' : 'Nuevo Producto')}
                </h2>

                {/* Si estamos en la tabla, mostramos botón Nuevo. Si estamos en formulario, botón Volver */}
                {view === 'table' && (
                    <button
                        onClick={handleNew}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 shadow-md"
                    >
                        <Plus className="w-4 h-4" /> Nuevo Producto
                    </button>
                )}
            </div>

            {/* RENDERIZADO CONDICIONAL */}
            {view === 'table' ? (
                // Pasamos handleEdit a la tabla para que sepa qué hacer al clickear el lápiz
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

const OrdersTab = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Gestión de Órdenes</h3>
        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Aquí cargaremos la lista de ventas...</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { auth, cargando } = useAuth();
    const navigate = useNavigate();

    // PROTECCIÓN DE RUTA (Frontend)
    useEffect(() => {
        if (!cargando) {
            if (!auth._id) {
                navigate('/login');
            } else if (!auth.isAdmin) {
                navigate('/'); // Si no es admin, lo mandamos al home
            }
        }
    }, [auth, cargando, navigate]);

    if (cargando) return <div className="p-10 text-center">Cargando panel...</div>;
    // Si no es admin, retornamos null mientras redirige para evitar flasheo
    if (!auth.isAdmin) return null;

    return (
        <>
            <Helmet><title>Admin Panel - FIDO'S</title></Helmet>

            <div className="min-h-screen bg-gray-100/50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* SIDEBAR DE NAVEGACIÓN */}
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

                        {/* CONTENIDO PRINCIPAL */}
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