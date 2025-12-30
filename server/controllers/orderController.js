import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';

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

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No hay items en la orden');
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();

        await Notification.create({
            user: null, // Para todos los admins
            message: `¡Nueva orden!`,
            type: 'order',
            link: '/admin'
        });
        res.status(201).json(createdOrder);
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las órdenes' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las órdenes' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (order) {
            order.status = status;

            if (status === 'Entregado') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ msg: 'Orden no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar la orden' });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        // 1. Ventas Totales y Cantidad de Órdenes
        // Filtramos para no sumar órdenes canceladas
        const orders = await Order.find({ status: { $ne: 'Cancelado' } });

        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const totalOrders = orders.length;

        // 2. Cantidad de Productos en catálogo
        const totalProducts = await Product.countDocuments();

        res.json({
            totalSales,
            totalOrders,
            totalProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener estadísticas' });
    }
};

const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        // Si es manual, paymentResult puede ser genérico
        order.paymentResult = {
            id: 'manual',
            status: 'approved',
            update_time: Date.now(),
            email_address: 'admin@manual.com'
        };

        const updatedOrder = await order.save();

        // 🔔 2. NOTIFICAR AL CLIENTE (Pago Aprobado)
        await Notification.create({
            user: order.user,
            message: `💵 ¡Pago recibido! Tu orden #${order._id.toString().slice(-6)} ya figura como pagada.`,
            type: 'order',
            link: `/order/${order._id}`
        });

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Orden no encontrada');
    }
};

const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        // 🔔 3. NOTIFICAR AL CLIENTE (Pedido Enviado/Entregado)
        await Notification.create({
            user: order.user,
            message: `🚚 ¡Tu pedido está en camino! La orden #${order._id.toString().slice(-6)} ha sido marcada como enviada/entregada.`,
            type: 'order',
            link: `/order/${order._id}`
        });

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Orden no encontrada');
    }
};

export {
    addOrderItems,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    updateOrderToPaid,
    updateOrderToDelivered,
    getDashboardStats
};