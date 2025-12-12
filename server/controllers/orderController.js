import Order from '../models/Order.js';

// Crear nueva orden
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    // Validación básica: ¿Hay items en el carrito?
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No hay items en la orden');
        return; // El return aquí es vital, o el código sigue
    } else {
        // Creamos la orden en memoria
        const order = new Order({
            orderItems,
            user: req.user._id, // <-- ¡MAGIA! Sacamos el ID del usuario del Token (gracias al middleware)
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        // Guardamos en DB
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

export {
    addOrderItems
};