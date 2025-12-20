import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { API_URL } from '../lib/constants'

const CartDrawer = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, total, clearCart, handlePayment } = useCart()
    const { auth } = useAuth();

    // Estados para el flujo de compra
    const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
    const [loading, setLoading] = useState(false);

    // Formulario de Envío (Coincide con tu Schema de Mongoose)
    const [formData, setFormData] = useState({
        address: '',
        city: 'Córdoba',
        postalCode: '',
        country: 'Argentina'
    });

    // 1. Manejar cambios en el formulario
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Iniciar Proceso de Pago
    const handleCheckoutClick = () => {
        if (!auth._id) {
            alert("Debes iniciar sesión para realizar una compra");
            onClose();
            navigate('/login');
            return;
        }
        setStep('checkout');
    };

    // 3. Enviar Orden al Backend
    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Preparamos los datos tal cual los pide tu Backend (OrderController)
        const orderData = {
            orderItems: cart.map(item => ({
                product: item._id, // ID del producto
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.quantity
            })),
            shippingAddress: formData,
            paymentMethod: 'Efectivo', // Hardcodeado por ahora, luego puedes agregar selector
            itemsPrice: total,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: total
        };

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}` // Token JWT
            }
        };

        try {
            const { data } = await axios.post(`${API_URL}/api/order`, orderData, config);
            console.log("Orden Creada:", data);

            alert(`¡Gracias ${auth.name}! Tu orden #${data._id} fue recibida.`);
            clearCart();
            setStep('cart');
            onClose();
            // navigate('/perfil'); // Futuro: Redirigir al historial
        } catch (error) {
            console.error(error);
            alert("Error al procesar la orden: " + (error.response?.data?.msg || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Oscuro */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Drawer (Panel Lateral) */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between p-4 border-b bg-yellow-50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-yellow-700" />
                                {step === 'cart' ? 'Tu Carrito' : 'Finalizar Compra'}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="flex-1 overflow-y-auto p-4">

                            {/* VISTA 1: LISTA DE PRODUCTOS */}
                            {step === 'cart' && (
                                <>
                                    {cart.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                                            <ShoppingCart className="h-16 w-16 opacity-20" />
                                            <p>Tu carrito está vacío</p>
                                            <button onClick={onClose} className="text-yellow-600 hover:underline">Ir a la tienda</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <div key={item._id} className="flex gap-4 border-b border-gray-100 pb-4">
                                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-50" />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                                                        <p className="text-yellow-700 font-bold">${item.price}</p>

                                                        {/* Controles Cantidad */}
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="flex items-center border rounded-md">
                                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100 text-gray-600">-</button>
                                                                <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100 text-gray-600">+</button>
                                                            </div>
                                                            <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* VISTA 2: FORMULARIO CHECKOUT */}
                            {step === 'checkout' && (
                                <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
                                        Vas a comprar <strong>{cart.length} productos</strong> por un total de <strong>${total}</strong>.
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Dirección de Entrega</label>
                                        <input
                                            required name="address"
                                            value={formData.address} onChange={handleInputChange}
                                            placeholder="Ej: Av. Colón 5000"
                                            className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                                            <input
                                                required name="city"
                                                value={formData.city} onChange={handleInputChange}
                                                className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cód. Postal</label>
                                            <input
                                                required name="postalCode"
                                                value={formData.postalCode} onChange={handleInputChange}
                                                className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStep('cart')}
                                        className="text-sm text-gray-500 hover:underline"
                                    >
                                        &larr; Volver al carrito
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* FOOTER */}
                        {cart.length > 0 && (
                            <div className="p-4 border-t bg-gray-50">
                                <div className="flex justify-between items-center mb-4 text-lg font-bold text-gray-900">
                                    <span>Total:</span>
                                    <span>${total}</span>
                                </div>

                                {step === 'cart' ? (
                                    <button
                                        onClick={handlePayment} // <--- AQUÍ LA CONEXIÓN
                                        className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-yellow-600 transition-colors shadow-md mt-4 flex justify-center items-center gap-2"
                                    >
                                        <span>Pagar con MercadoPago</span>
                                        {/* Icono opcional */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        form="checkout-form"
                                        disabled={loading}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirmar Pedido'}
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;