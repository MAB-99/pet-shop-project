import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import Order from '../models/Order.js'; // <--- 1. IMPORTANTE: Importa tu modelo


// --- CREAR PREFERENCIA (CON EL PUENTE) ---
export const createPreference = async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const { items } = req.body;

        // A. PRIMERO: Creamos la orden en "Pendiente" en nuestra BD
        // Nota: Asumimos que req.user existe (necesitas el middleware de auth)
        // Si no tienes address aquí, puedes poner valores por defecto o pedirla antes.
        const newOrder = new Order({
            user: req.user._id, // Usuario autenticado
            orderItems: items.map(item => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.quantity
            })),
            shippingAddress: { address: 'A coordinar', city: 'Cba', country: 'Arg', postalCode: '5000' }, // Placeholder si no la pides antes
            paymentMethod: 'MercadoPago',
            totalPrice: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
            isPaid: false
        });

        const savedOrder = await newOrder.save(); // ¡Guardamos la orden!

        // B. SEGUNDO: Creamos la preferencia en MP pasándole el ID de la orden
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: items.map(item => ({
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

                // --- EL PUENTE MÁGICO ---
                external_reference: savedOrder._id.toString() // <--- ¡AQUÍ ESTÁ LA CLAVE!
            }
        });

        res.json({ id: result.id, url: result.init_point });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al crear pago" });
    }
};

// --- RECIBIR WEBHOOK (LA FUNCIÓN QUE PEDISTE) ---
export const receiveWebhook = async (req, res) => {
    try {
        // 1. CAMBIO IMPORTANTE: Leemos del BODY, no del Query
        const paymentId = req.body?.data?.id || req.query?.id;
        const type = req.body?.type || req.query?.topic;

        // Log para depurar qué está llegando
        console.log("📩 Webhook recibido. ID:", paymentId, "Tipo:", type);

        // Si no hay ID, respondemos OK para que MP deje de insistir, pero no hacemos nada.
        if (!paymentId || (type !== 'payment' && type !== 'merchant_order')) {
            return res.sendStatus(200);
        }

        if (type === 'payment') {
            const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
            const payment = new Payment(client);

            // Consultamos a MP
            const paymentData = await payment.get({ id: paymentId });

            if (paymentData.status === 'approved') {
                const orderId = paymentData.external_reference;

                // Si por alguna razón external_reference viene vacío, evitamos el crash
                if (orderId) {
                    const order = await Order.findById(orderId);
                    if (order) {
                        order.isPaid = true;
                        order.paidAt = new Date();
                        order.paymentResult = {
                            id: paymentData.id,
                            status: paymentData.status,
                            email: paymentData.payer.email
                        };
                        await order.save();
                        console.log(`✅ Orden ${orderId} pagada exitosamente`);
                    }
                }
            }
        }
        // Siempre responder 200 OK
        res.sendStatus(200);

    } catch (error) {
        console.error("Webhook Error:", error.message);
        // Respondemos 200 aunque falle nuestra lógica interna para que MP no reintente infinitamente
        res.sendStatus(200);
    }
};