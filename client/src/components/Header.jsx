import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, LogOut, Shield, ChevronDown } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Nuevo estado para el dropdown manual

    const location = useLocation();
    const navigate = useNavigate();

    // Conectamos con nuestro AuthContext real
    const { auth, cerrarSesion } = useAuth();

    // Placeholder para el carrito (Aún no implementado)
    const cartCount = 0;

    const navItems = [
        { name: 'Inicio', path: '/' },
        { name: 'Tienda', path: '/tienda' },
        { name: 'Peluquería', path: '/peluqueria' },
        { name: 'Sobre Nosotros', path: '/nosotros' },
        { name: 'Contacto', path: '/contacto' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        cerrarSesion();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
            <nav className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <img
                            src="https://horizons-cdn.hostinger.com/90defc6c-541b-4baa-a0c2-2376f349dcb8/023ba1d1aeee998d08a0fd55b0ac5f96.png"
                            alt="FIDO'S Logo"
                            className="h-14 w-auto transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent hidden sm:block">
                            FIDO'S
                        </span>
                    </Link>

                    {/* DESKTOP NAVIGATION */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path}>
                                <button
                                    className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path)
                                            ? 'text-yellow-600 font-bold'
                                            : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                                        }`}
                                >
                                    {item.name}
                                    {isActive(item.path) && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </button>
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT SIDE ICONS */}
                    <div className="flex items-center space-x-4">

                        {/* CART ICON (Placeholder) */}
                        <button
                            className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => alert("El carrito estará disponible pronto")}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* USER AUTH SECTION */}
                        {auth._id ? (
                            <div className="relative">
                                {/* Botón del Usuario */}
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 p-1 pr-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold">
                                        {auth.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                </button>

                                {/* Dropdown Menu Manual */}
                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-1 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{auth.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{auth.email}</p>
                                            </div>

                                            <Link to="/perfil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                                                <User className="mr-2 h-4 w-4" /> Mi Perfil
                                            </Link>

                                            {auth.isAdmin && (
                                                <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                                                    <Shield className="mr-2 h-4 w-4" /> Panel Admin
                                                </Link>
                                            )}

                                            <div className="border-t border-gray-100 my-1"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* Si NO está logueado */
                            <Link to="/login">
                                <button className="hidden sm:flex bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                                    Ingresar
                                </button>
                                <button className="sm:hidden p-2 text-gray-700">
                                    <User className="h-5 w-5" />
                                </button>
                            </Link>
                        )}

                        {/* MOBILE MENU TOGGLE */}
                        <button
                            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pb-4 border-t pt-4 overflow-hidden"
                        >
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-md text-base font-medium mb-1 ${isActive(item.path) ? 'bg-yellow-50 text-yellow-600' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {!auth._id && (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                    <button className="w-full mt-4 bg-gray-900 text-white py-3 rounded-md font-bold">
                                        Ingresar / Registrarse
                                    </button>
                                </Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Header;