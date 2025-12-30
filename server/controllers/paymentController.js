import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js'; // Asegúrate de que la ruta sea correcta

// --- CREAR PREFERENCIA ---
export const createPreference = async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const { items, shippingAddress } = req.body;

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
                postalCode: shippingAddress?.postalCode || '5000',
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
                    id: item._id,
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

// --- RECIBIR WEBHOOK (Lógica Unificada) ---
export const receiveWebhook = async (req, res) => {
    try {
        const paymentId = req.body?.data?.id || req.query?.id;
        const type = req.body?.type || req.query?.topic;

        // Si no es un pago, ignoramos pero respondemos OK
        if (!paymentId || (type !== 'payment' && type !== 'merchant_order')) {
            return res.sendStatus(200);
        }

        if (type === 'payment') {
            const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
            const payment = new Payment(client);

            // 1. Consultar estado a MP
            const paymentData = await payment.get({ id: paymentId });

            // 2. Si está aprobado...
            if (paymentData.status === 'approved') {
                const orderId = paymentData.external_reference;

                if (orderId) {
                    const order = await Order.findById(orderId);

                    // 3. Verificamos que la orden exista y NO esté pagada aún (Evitar duplicados)
                    if (order && !order.isPaid) {

                        // A. MARCAR COMO PAGADA
                        order.isPaid = true;
                        order.paidAt = new Date();
                        order.paymentResult = {
                            id: paymentData.id,
                            status: paymentData.status,
                            email: paymentData.payer.email
                        };
                        await order.save();
                        console.log(`✅ Orden ${orderId} pagada y guardada.`);

                        // B. ACTUALIZAR STOCK
                        console.log("🔄 Actualizando stock...");
                        for (const item of order.orderItems) {
                            const product = await Product.findById(item.product);
                            if (product) {
                                product.stock = Math.max(0, product.stock - item.qty); // Evitar negativos
                                await product.save();
                                console.log(`   🔻 ${product.name}: Stock bajó a ${product.stock}`);
                            }
                        }

                        // C. CREAR NOTIFICACIÓN ADMIN
                        // (Aquí estaba el error de totalPrice, usamos order.totalPrice)
                        await Notification.create({
                            user: null, // Para todos los admins
                            message: `💰 ¡Nueva venta! Orden #${order._id.toString().slice(-6)} pagada ($${order.totalPrice}).`,
                            type: 'order',
                            link: '/admin'
                        });
                        console.log("🔔 Notificación enviada a Admins");
                    }
                }
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("Webhook Error:", error.message);
        res.sendStatus(200); // Responder OK para que MP no reintente infinitamente si falla nuestro código
    }
};