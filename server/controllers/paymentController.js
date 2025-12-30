import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';

// --- CREAR PREFERENCIA ---
export const createPreference = async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const { items, shippingAddress } = req.body; // Asegúrate de recibir shippingAddress

        const newOrder = new Order({
            user: req.user._id,
            orderItems: items.map(item => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.quantity
            })),
            shippingAddress: {
                address: shippingAddress?.address || 'Calle Falsa 123',
                city: shippingAddress?.city || 'Córdoba',
                postalCode: shippingAddress?.postalCode || '5000', // Valor por defecto para evitar error
                country: 'Argentina'
            },
            paymentMethod: 'MercadoPago',
            totalPrice: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
            isPaid: false
        });

        const savedOrder = await newOrder.save();

        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: items.map(item => ({
                    id: item._id, // Enviamos ID del producto a MP por si acaso
                    title: item.name,
                    quantity: Number(item.quantity),
                    unit_price: Number(item.price),
                    currency_id: 'ARS',
                })),
                back_urls: {
                    success: "https://pet-shop-project-nine.vercel.app/tienda",
                    failure: "https://pet-shop-project-nine.vercel.app/tienda",
                    pending: "https://pet-shop-project-nine.vercel.app/tienda",
                },
                auto_return: "approved",
                notification_url: "https://backend-fidos-petshop.onrender.com/api/payment/webhook",
                external_reference: savedOrder._id.toString()
            }
        });

        res.json({ id: result.id, url: result.init_point });

    } catch (error) {
        console.error("Error creando preferencia:", error);
        res.status(500).json({ error: "Error al procesar el pago" });
    }
};

// --- RECIBIR WEBHOOK (CON ACTUALIZACIÓN DE STOCK) ---
export const receiveWebhook = async (req, res) => {
    try {
        const paymentId = req.body?.data?.id || req.query?.id;
        const type = req.body?.type || req.query?.topic;

        if (!paymentId || (type !== 'payment' && type !== 'merchant_order')) {
            return res.sendStatus(200);
        }

        if (type === 'payment') {
            const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
            const payment = new Payment(client);

            const paymentData = await payment.get({ id: paymentId });

            if (paymentData.status === 'approved') {
                const orderId = paymentData.external_reference;

                if (orderId) {
                    const order = await Order.findById(orderId);

                    // Solo actualizamos si la orden NO estaba pagada previamente
                    // Esto evita descontar stock doble si MP manda el webhook 2 veces
                    if (order && !order.isPaid) {
                        order.isPaid = true;
                        order.paidAt = new Date();
                        order.paymentResult = {
                            id: paymentData.id,
                            status: paymentData.status,
                            email: paymentData.payer.email
                        };

                        await order.save();
                        console.log(`✅ Orden ${orderId} marcada como PAGADA.`);

                        // --- 2. MAGIA: ACTUALIZAR STOCK DE PRODUCTOS ---
                        console.log("🔄 Actualizando stock de productos...");

                        for (const item of order.orderItems) {
                            const product = await Product.findById(item.product);
                            if (product) {
                                product.stock = product.stock - item.qty;
                                await product.save();
                                console.log(`   🔻 ${product.name}: Stock bajó a ${product.stock}`);
                            }
                        }
                        console.log("✨ Stock actualizado correctamente.");

                        if (paymentData.status === 'approved') {
                            const orderId = paymentData.external_reference;

                            if (orderId) {
                                const order = await Order.findById(orderId);

                                if (order && !order.isPaid) {
                                    // ... (lógica existente de marcar isPaid y descontar stock) ...

                                    // 👇 2. AGREGAR ESTO AL FINAL DEL IF:
                                    // Crear Notificación para Admins
                                    await Notification.create({
                                        user: null, // null = Para todos los admins
                                        message: `💰 ¡Nueva venta! Orden #${order._id.toString().slice(-6)} pagada ($${totalPrice}).`,
                                        type: 'order',
                                        link: '/admin' // A dónde lleva el clic
                                    });
                                    console.log("🔔 Notificación de venta creada para admins");
                                }
                            }
                        }

                        // -----------------------------------------------
                    }
                }
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("Webhook Error:", error.message);
        res.sendStatus(200);
    }
};