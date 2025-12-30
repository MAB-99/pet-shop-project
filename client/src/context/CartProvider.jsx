import { createContext, useState, useEffect } from 'react';
import { API_URL } from '../lib/constants';
import toast from 'react-hot-toast';

const CartContext = createContext();

const CartProvider = ({ children }) => {
    // Inicializar carrito desde localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [total, setTotal] = useState(0);

    // --- 1. NUEVO: Estado para abrir/cerrar el carrito ---
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Guardar en localStorage cada vez que cambie el carrito
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        const newTotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
        setTotal(newTotal);
    }, [cart]);

    // --- 2. NUEVO: Calcular cantidad total de items (para el numerito rojo del Header) ---
    const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // --- 3. NUEVO: Funciones para controlar el menú ---
    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeCart = () => setIsCartOpen(false);
    const openCart = () => setIsCartOpen(true);

    // --- FUNCIÓN AGREGAR CON VALIDACIÓN DE STOCK ---
    const addToCart = (product) => {
        if (product.stock <= 0) {
            toast.error("Lo sentimos, este producto está agotado.");
            return;
        }

        const existingItem = cart.find(item => item._id === product._id);

        if (existingItem) {
            if (existingItem.quantity + 1 > product.stock) {
                toast.error(`¡Máximo stock alcanzado! Solo quedan ${product.stock} unidades de ${product.name}.`);
                return;
            }
            setCart(cart.map(item =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        // Opcional: Abrir el carrito automáticamente al agregar
        openCart();
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item._id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        const item = cart.find(i => i._id === id);
        if (item && newQuantity > item.stock) {
            toast.error(`No puedes agregar más. Stock máximo disponible: ${item.stock}`);
            return;
        }
        setCart(cart.map(item =>
            item._id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Debes iniciar sesión para pagar");
                return;
            }
            const response = await fetch(`${API_URL}/api/payment/create-preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: cart })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("No se recibió la URL de pago", data);
                toast.error("Error al generar el pago");
            }
        } catch (error) {
            console.error("Error en pago:", error);
            toast.error("Hubo un error al conectar con MercadoPago");
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            total,
            handlePayment,
            // --- 4. EXPORTAMOS LO NUEVO ---
            isCartOpen,
            toggleCart,
            closeCart,
            openCart,
            itemsCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export { CartProvider };
export default CartContext;