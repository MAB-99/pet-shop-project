import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../lib/constants';

const CartContext = createContext();

const CartProvider = ({ children }) => {
    // 1. Estado del Carrito (Productos)
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [total, setTotal] = useState(0);
    const [itemsCount, setItemsCount] = useState(0);

    // 2. Estado de Visibilidad (Abrir/Cerrar Drawer)
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Efecto para calcular totales
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        const nuevoTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(nuevoTotal);
        const nuevoCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        setItemsCount(nuevoCount);
    }, [cart]);

    // --- FUNCIONES ---

    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const itemExists = prevCart.find(item => item._id === product._id);
            if (itemExists) {
                return prevCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity }];
            }
        });
        // Opcional: Abrir el carrito automáticamente al agregar
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item._id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    // Funciones para manejar la visibilidad
    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeCart = () => setIsCartOpen(false);
    const openCart = () => setIsCartOpen(true);

    // Función para iniciar el pago con MercadoPago
    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Debes iniciar sesión para pagar");
                return;
            }

            // 1. Pedimos la preferencia al Backend
            const response = await fetch(`${API_URL}/api/payment/create-preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: cart }) // Enviamos el carrito actual
            });

            const data = await response.json();

            if (data.url) {
                // 2. Si todo sale bien, redirigimos a MercadoPago
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
            total,
            itemsCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            toggleCart,
            closeCart,
            openCart,
            handlePayment
        }}>
            {children}
        </CartContext.Provider>
    );
};

export { CartProvider };
export default CartContext;