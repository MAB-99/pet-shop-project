import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';
import { CONTACT_INFO } from '../lib/constants';

const Footer = () => {
    return (
        <footer className="bg-yellow-50/50 border-t border-yellow-100">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Columna 1: Logo y Descripción */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <img
                                src="https://horizons-cdn.hostinger.com/90defc6c-541b-4baa-a0c2-2376f349dcb8/023ba1d1aeee998d08a0fd55b0ac5f96.png"
                                alt="FIDO'S PET SHOP Logo"
                                className="h-12 w-auto"
                            />
                            <div>
                                <span className="text-xl font-bold text-yellow-700">FIDO'S PET SHOP</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Tu tienda de confianza para el cuidado y bienestar de tus mascotas en Córdoba.
                        </p>
                        {/* Social Media Icons */}
                        <div className="flex space-x-4">
                            <a
                                href={CONTACT_INFO.INSTAGRAM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white rounded-full shadow-sm text-pink-600 hover:text-pink-700 hover:shadow-md transition-all"
                                title="Síguenos en Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Enlaces */}
                    <div>
                        <span className="font-semibold text-gray-800 mb-4 block">Enlaces Rápidos</span>
                        <div className="space-y-2">
                            <Link to="/" className="block text-gray-600 hover:text-yellow-600 transition-colors text-sm">
                                Inicio
                            </Link>
                            <Link to="/tienda" className="block text-gray-600 hover:text-yellow-600 transition-colors text-sm">
                                Tienda
                            </Link>
                            <Link to="/servicios" className="block text-gray-600 hover:text-yellow-600 transition-colors text-sm">
                                Peluquería
                            </Link>
                            <Link to="/nosotros" className="block text-gray-600 hover:text-yellow-600 transition-colors text-sm">
                                Sobre Nosotros
                            </Link>
                            <Link to="/contacto" className="block text-gray-600 hover:text-yellow-600 transition-colors text-sm">
                                Contacto
                            </Link>
                        </div>
                    </div>

                    {/* Columna 3: Contacto */}
                    <div>
                        <span className="font-semibold text-gray-800 mb-4 block">Contacto</span>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-2 text-sm">
                                <MapPin className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{CONTACT_INFO.FULL_ADDRESS}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Phone className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                                <span className="text-gray-600">{CONTACT_INFO.PHONE}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Mail className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                                <span className="text-gray-600">{CONTACT_INFO.EMAIL}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Instagram className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                                <a href={CONTACT_INFO.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-yellow-600 transition-colors">
                                    {CONTACT_INFO.INSTAGRAM}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Columna 4: Horarios */}
                    <div>
                        <span className="font-semibold text-gray-800 mb-4 block">Horarios</span>
                        <div className="space-y-2">
                            <div className="flex items-start space-x-2 text-sm">
                                <Clock className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-600">
                                    <p className="font-medium">Lunes a Viernes</p>
                                    <p>9:00 - 19:00</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-2 text-sm">
                                <Clock className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-600">
                                    <p className="font-medium">Sábados</p>
                                    <p>9:00 - 14:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-yellow-200 mt-8 pt-6 text-center">
                    <p className="text-sm text-gray-600">
                        © 2025 FIDO'S PET SHOP. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;