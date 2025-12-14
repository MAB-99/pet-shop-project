import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, X, ImageIcon, Loader2 } from 'lucide-react';

const ProductForm = ({ productToEdit, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: 'perro', // Valor por defecto
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState('');

    // Si recibimos un producto para editar, llenamos el formulario
    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                price: productToEdit.price,
                description: productToEdit.description || '',
                stock: productToEdit.stock,
                category: productToEdit.category,
                image: productToEdit.image
            });
            setPreview(productToEdit.image);
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Vista previa de imagen en tiempo real
        if (name === 'image') setPreview(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Configuración del Header con Token
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        };

        try {
            if (productToEdit) {
                // MODO EDICIÓN: PUT /api/product/:id
                await axios.put(`http://localhost:4000/api/product/${productToEdit._id}`, formData, config);
                alert('Producto actualizado correctamente');
            } else {
                // MODO CREACIÓN: POST /api/product
                await axios.post('http://localhost:4000/api/product', formData, config);
                alert('Producto creado correctamente');
            }
            onSuccess(); // Avisar al padre que recargue la tabla
        } catch (error) {
            console.error(error);
            alert('Error al guardar: ' + (error.response?.data?.msg || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-800">
                    {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* COLUMNA IZQUIERDA: Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text" name="name" required
                            value={formData.name} onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            placeholder="Ej: Royal Canin..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                            <input
                                type="number" name="price" required min="0"
                                value={formData.price} onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number" name="stock" required min="0"
                                value={formData.stock} onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            name="category"
                            value={formData.category} onChange={handleChange}
                            className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 outline-none"
                        >
                            <option value="perro">Perro</option>
                            <option value="gato">Gato</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="description" rows="3"
                            value={formData.description} onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            placeholder="Detalles del producto..."
                        />
                    </div>
                </div>

                {/* COLUMNA DERECHA: Imagen */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                        <div className="flex gap-2">
                            <input
                                type="text" name="image" required
                                value={formData.image} onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Recomendamos usar imágenes de Unsplash.</p>
                    </div>

                    {/* Previsualización */}
                    <div className="w-full aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative">
                        {preview ? (
                            <img src={preview} alt="Vista previa" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Error+URL'} />
                        ) : (
                            <div className="text-center text-gray-400">
                                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Vista Previa</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER BOTONES */}
                <div className="lg:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button" onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit" disabled={loading}
                        className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {productToEdit ? 'Actualizar Producto' : 'Guardar Producto'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;