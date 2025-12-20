import { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, AlertTriangle, Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { API_URL } from '../../lib/constants';

const ProductsTable = ({ onEdit }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth(); // Necesitamos el token del admin

    // 1. Cargar productos al iniciar
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/product`);
            setProducts(data);
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 2. Función para ELIMINAR producto
    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            // OJO: Usamos singular /api/product/:id
            await axios.delete(`${API_URL}/api/product/${id}`, config);

            // Actualizamos la lista visualmente filtrando el que borramos
            setProducts(products.filter(p => p._id !== id));
            alert('Producto eliminado correctamente');
        } catch (error) {
            console.error(error);
            alert('Error al eliminar: ' + (error.response?.data?.msg || error.message));
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-yellow-600" /></div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header de la Tabla */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800">Inventario ({products.length})</h3>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-xs">
                        <tr>
                            <th className="p-4">Producto</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-medium text-gray-900 line-clamp-1 max-w-[200px]" title={product.name}>
                                            {product.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold uppercase">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-4 font-bold text-gray-900">
                                    ${product.price}
                                </td>
                                <td className="p-4">
                                    {product.stock <= 5 ? (
                                        <span className="flex items-center text-red-600 font-bold text-xs">
                                            <AlertTriangle className="w-3 h-3 mr-1" /> {product.stock} (Bajo)
                                        </span>
                                    ) : (
                                        <span className="text-green-600 font-bold text-xs">{product.stock} Unid.</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        No hay productos registrados.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsTable;