import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Loader2, CreditCard, Banknote } from 'lucide-react';
import axios from 'axios';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { API_URL } from '../lib/constants';

// CAMBIO 1: Ya no recibe props ({ isOpen, onClose })
const CartDrawer = () => {

    const navigate = useNavigate();
    // CAMBIO 2: Traemos isCartOpen y closeCart del contexto
    const { cart, removeFromCart, updateQuantity, total, clearCart, handlePayment, isCartOpen, closeCart } = useCart();
    const { auth } = useAuth();

    const [step, setStep] = useState('cart');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        address: '',
        city: 'Córdoba',
        postalCode: '',
        country: 'Argentina'
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleManualCheckoutClick = () => {
        if (!auth._id) {
            alert("Debes iniciar sesión para comprar");
            // Usamos closeCart del contexto
            closeCart();
            navigate('/login');
            return;
        }
        setStep('checkout');
    };

    const handleSubmitManualOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            orderItems: cart.map(item => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.quantity
            })),
            shippingAddress: formData,
            paymentMethod: 'Efectivo',
            itemsPrice: total,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: total
        };

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            const { data } = await axios.post(`${API_URL}/api/order`, orderData, config);

            alert(`¡Orden #${data._id} creada con éxito! Nos contactaremos para el envío.`);
            clearCart();
            setStep('cart');
            // Usamos closeCart del contexto
            closeCart();

        } catch (error) {
            console.error(error);
            alert("Error al procesar la orden: " + (error.response?.data?.msg || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {/* CAMBIO 3: Usamos isCartOpen del contexto */}
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart} // Usamos closeCart
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        <div className="flex items-center justify-between p-4 border-b bg-yellow-50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-yellow-700" />
                                {step === 'cart' ? 'Tu Carrito' : 'Datos de Envío'}
                            </h2>
                            <button onClick={closeCart} className="p-2 hover:bg-white rounded-full transition">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* ... El resto del contenido sigue igual ... */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {step === 'cart' && (
                                <>
                                    {cart.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                                            <ShoppingCart className="h-16 w-16 opacity-20" />
                                            <p>Tu carrito está vacío</p>
                                            <button onClick={closeCart} className="text-yellow-600 hover:underline">Ir a la tienda</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <div key={item._id} className="flex gap-4 border-b border-gray-100 pb-4">
                                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-50" />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                                                        <p className="text-yellow-700 font-bold">${item.price}</p>
                                                        <div className="flex items-center border rounded-md bg-white">
                                                            <button
                                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                className="px-2 py-1 hover:bg-gray-100 text-gray-600 disabled:opacity-30"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                className="px-2 py-1 hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                disabled={item.quantity >= item.stock}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <div className="text-xs text-gray-400 text-right mt-1 px-1">
                                                            (Disp: {item.stock})
                                                        </div>
                                                        <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 p-1">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {step === 'checkout' && (
                                <form id="manual-checkout-form" onSubmit={handleSubmitManualOrder} className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4 border border-blue-100">
                                        <p className="font-bold flex items-center gap-2"><Banknote className="w-4 h-4" /> Pago en Efectivo</p>
                                        Completá tus datos. Coordinaremos el pago al momento de la entrega.
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
                                        className="text-sm text-gray-500 hover:underline w-full text-center mt-4"
                                    >
                                        &larr; Volver a elegir método de pago
                                    </button>
                                </form>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-4 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                                <div className="flex justify-between items-center mb-4 text-xl font-bold text-gray-900">
                                    <span>Total:</span>
                                    <span>${total}</span>
                                </div>
                                {step === 'cart' ? (
                                    <div className="space-y-3">
                                        <button
                                            onClick={handlePayment}
                                            className="w-full bg-[#009EE3] hover:bg-[#008ED6] text-white py-3 rounded-lg font-bold text-lg transition-colors shadow-sm flex justify-center items-center gap-2"
                                        >
                                            <span>Pagar con MercadoPago</span>
                                            <CreditCard className="w-5 h-5" />
                                        </button>
                                        <div className="relative flex py-1 items-center">
                                            <div className="flex-grow border-t border-gray-200"></div>
                                            <span className="flex-shrink-0 mx-2 text-gray-400 text-xs">O</span>
                                            <div className="flex-grow border-t border-gray-200"></div>
                                        </div>
                                        <button
                                            onClick={handleManualCheckoutClick}
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2"
                                        >
                                            <span>Pago en Efectivo / A convenir</span>
                                            <Banknote className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        form="manual-checkout-form"
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