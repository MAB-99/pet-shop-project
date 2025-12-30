import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, X, ImageIcon, Loader2 } from 'lucide-react';
import uploadImage from '../lib/uploadImage';
import { Upload } from 'lucide-react';
import { API_URL } from '../lib/constants';
import toast from 'react-hot-toast';

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
    const [uploading, setUploading] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            const url = await uploadImage(file);
            setUploading(false);

            if (url) {
                // Actualizamos el form con la URL que nos dio Cloudinary
                setFormData({ ...formData, image: url });
            }
        }
    };

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
                await axios.put(`${API_URL}/api/product/${productToEdit._id}`, formData, config);
                toast.success('Producto actualizado correctamente');
            } else {
                // MODO CREACIÓN: POST /api/product
                await axios.post(`${API_URL}/api/product`, formData, config);
                toast.success('Producto creado correctamente');
            }
            onSuccess(); // Avisar al padre que recargue la tabla
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar: ' + (error.response?.data?.msg || error.message));
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
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Imagen del Producto</label>

                    <div className="flex items-center gap-4">
                        {/* Previsualización */}
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 relative">
                            {uploading ? (
                                <span className="text-xs text-blue-500 font-bold animate-pulse">Subiendo...</span>
                            ) : formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="text-gray-400" />
                            )}
                        </div>

                        {/* Input de archivo oculto + Botón personalizado */}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-yellow-50 file:text-yellow-700
                  hover:file:bg-yellow-100
                  cursor-pointer"
                                disabled={uploading}
                            />
                            <p className="text-xs text-gray-400 mt-1">O pega la URL manual abajo si prefieres:</p>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full border-b border-gray-300 text-xs py-1 focus:outline-none focus:border-yellow-500 mt-1"
                                placeholder="https://..."
                            />
                        </div>
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