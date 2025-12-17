import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import uploadImage from '../lib/uploadImage';
import { API_URL } from '../lib/constants';


const Services = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        petName: '',
        petPhoto: '', // Por ahora URL
        contactPhone: '',
        notes: ''
    });
    const [mensaje, setMensaje] = useState(null);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth._id) {
            alert("Debes iniciar sesión para pedir un turno");
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMensaje("¡Solicitud enviada con éxito! Te contactaremos por WhatsApp.");
                setFormData({ petName: '', petPhoto: '', contactPhone: '', notes: '' });
            } else {
                setMensaje("Error al enviar la solicitud.");
            }
        } catch (error) {
            console.error(error);
            setMensaje("Error de conexión.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🐶 Peluquería Canina</h2>
                <p className="text-gray-500 text-center mb-8">
                    Completa el formulario y nos pondremos en contacto contigo para coordinar el turno.
                </p>

                {mensaje && (
                    <div className={`p-4 mb-6 rounded-lg text-center ${mensaje.includes('éxito') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {mensaje}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Nombre de la Mascota</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-500"
                            placeholder="Ej: Firulais"
                            value={formData.petName}
                            onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Foto de la Mascota</label>

                        <div className="flex items-start gap-4">
                            {formData.petPhoto && (
                                <img src={formData.petPhoto} alt="Mascota" className="w-20 h-20 object-cover rounded-lg border shadow-sm" />
                            )}

                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setUploading(true);
                                            const url = await uploadImage(file);
                                            setUploading(false);
                                            if (url) setFormData({ ...formData, petPhoto: url });
                                        }
                                    }}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                                    disabled={uploading}
                                />
                                {uploading && <p className="text-xs text-blue-500 mt-1">Subiendo imagen...</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Teléfono de Contacto (WhatsApp)</label>
                        <input
                            type="tel"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-500"
                            placeholder="Ej: 3511234567"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Notas Adicionales (Opcional)</label>
                        <textarea
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-500 h-24"
                            placeholder="Es alérgico, muerde, etc."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
                    >
                        Solicitar Turno
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Services;