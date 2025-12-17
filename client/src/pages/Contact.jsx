import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Instagram } from 'lucide-react';
import { CONTACT_INFO } from '../lib/constants';


const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [status, setStatus] = useState(null); // Para mostrar mensaje de éxito/error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setStatus({ type: 'error', text: 'Por favor completa todos los campos obligatorios.' });
            return;
        }

        // Lógica de WhatsApp
        const whatsappMessage = `Hola! Me contacto desde el formulario web de FIDO'S PET SHOP:\n\nNombre: ${formData.name}\nEmail: ${formData.email}\n${formData.message}`;

        window.open(`${CONTACT_INFO.WHATSAPP_URL || 'https://wa.me/5493510000000'}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');

        setStatus({ type: 'success', text: '¡Mensaje listo para enviar por WhatsApp!' });
        setFormData({ name: '', email: '', phone: '', message: '' });

        // Borrar mensaje después de 5 segundos
        setTimeout(() => setStatus(null), 5000);
    };

    return (
        <>
            <Helmet>
                <title>Contacto - FIDO'S PET SHOP | Pet Shop en Córdoba</title>
                <meta name="description" content={`Contacta con nosotros. Estamos en ${CONTACT_INFO.ADDRESS || 'Córdoba'}.`} />
            </Helmet>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-yellow-50/70 min-h-screen"
            >
                <section className="py-16">
                    <div className="container mx-auto px-4">

                        {/* Encabezado */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Contactanos</h1>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Estamos aquí para ayudarte. Comunicate con nosotros por cualquier consulta.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

                            {/* Formulario */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un Mensaje</h2>

                                    {status && (
                                        <div className={`mb-4 p-3 rounded text-sm font-medium text-center ${status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {status.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                            <input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Tu nombre"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="tu@email.com"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                            <input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+54 351 ..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="¿En qué podemos ayudarte?"
                                                rows={5}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md"
                                        >
                                            <Send className="h-5 w-5" />
                                            Enviar Mensaje
                                        </button>
                                    </form>
                                </div>
                            </motion.div>

                            {/* Información de Contacto */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                {[
                                    { icon: MapPin, title: 'Ubicación', lines: [CONTACT_INFO.ADDRESS, (CONTACT_INFO.CITY || 'Córdoba') + ', Argentina'] },
                                    { icon: Phone, title: 'Teléfono', lines: [CONTACT_INFO.PHONE], note: 'WhatsApp disponible' },
                                    { icon: Mail, title: 'Email', lines: [CONTACT_INFO.EMAIL || 'contacto@fidos.com'], note: 'Respondemos en 24hs' },
                                    { icon: Instagram, title: 'Instagram', lines: [CONTACT_INFO.INSTAGRAM || '@fidos'], link: CONTACT_INFO.INSTAGRAM_URL, note: 'Síguenos para novedades' },
                                    { icon: Clock, title: 'Horarios', lines: ['Lunes a Viernes: 9:00 - 19:00', 'Sábados: 9:00 - 14:00'] }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                                                {item.link ? (
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-yellow-600 font-medium transition-colors block">
                                                        {item.lines[0]}
                                                    </a>
                                                ) : (
                                                    item.lines.map((line, i) => <p key={i} className="text-gray-600">{line}</p>)
                                                )}
                                                {item.note && <p className="text-sm text-yellow-600 mt-1 font-medium">{item.note}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Mapa */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 p-6 border-b bg-gray-50">Cómo Llegar</h2>
                            <div className="h-[400px] bg-gray-200">
                                {/* Usamos un mapa por defecto si no hay constante definida */}
                                <iframe
                                    src={CONTACT_INFO.MAP_URL || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113575.6177579893!2d-64.2974996963236!3d-31.39908460673321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432985f478f5b69%3A0xb0a24f9a5366b092!2zQ8OzcmRvYmE!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar"}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Mapa de ubicación"
                                />
                            </div>
                        </motion.div>

                    </div>
                </section>
            </motion.div>
        </>
    );
};

export default Contact;