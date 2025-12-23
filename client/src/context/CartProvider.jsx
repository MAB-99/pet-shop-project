import { createContext, useState, useEffect } from 'react';
import { API_URL } from '../lib/constants';

const CartContext = createContext();

const CartProvider = ({ children }) => {
    // Inicializar carrito desde localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [total, setTotal] = useState(0);

    // Guardar en localStorage cada vez que cambie el carrito
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        const newTotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
        setTotal(newTotal);
    }, [cart]);

    // --- FUNCIÓN AGREGAR CON VALIDACIÓN DE STOCK ---
    const addToCart = (product) => {
        // 1. Validar si hay stock inicial
        if (product.stock <= 0) {
            alert("Lo sentimos, este producto está agotado.");
            return;
        }

        const existingItem = cart.find(item => item._id === product._id);

        if (existingItem) {
            // 2. Validar si al sumar 1 superamos el stock
            if (existingItem.quantity + 1 > product.stock) {
                alert(`¡Máximo stock alcanzado! Solo quedan ${product.stock} unidades de ${product.name}.`);
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
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item._id !== id));
    };

    // --- FUNCIÓN ACTUALIZAR CANTIDAD CON VALIDACIÓN ---
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;

        // Buscamos el item para chequear su stock máximo
        const item = cart.find(i => i._id === id);

        if (item && newQuantity > item.stock) {
            alert(`No puedes agregar más. Stock máximo disponible: ${item.stock}`);
            return; // No actualizamos si se pasa
        }

        setCart(cart.map(item =>
            item._id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Función para iniciar el pago con MercadoPago
    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Debes iniciar sesión para pagar");
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
                alert("Error al generar el pago");
            }

        } catch (error) {
            console.error("Error en pago:", error);
            alert("Hubo un error al conectar con MercadoPago");
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
            handlePayment
        }}>
            {children}
        </CartContext.Provider>
    );
};

export { CartProvider };
export default CartContext;