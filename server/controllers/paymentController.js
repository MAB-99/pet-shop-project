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
        const { type, data } = req.query;

        if (type === 'payment') {
            const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
            const payment = new Payment(client);

            // 1. Consultamos a MP el estado actual del pago
            const paymentData = await payment.get({ id: data.id });

            // 2. Verificamos si está aprobado
            if (paymentData.status === 'approved') {

                // 3. Recuperamos el ID de nuestra orden desde "external_reference"
                const orderId = paymentData.external_reference;

                console.log(`💰 Pago aprobado para la Orden: ${orderId}`);

                // 4. Buscamos y actualizamos en MongoDB
                const order = await Order.findById(orderId);

                if (order) {
                    order.isPaid = true;
                    order.paidAt = new Date();
                    order.paymentResult = { // Guardamos evidencia del pago
                        id: paymentData.id,
                        status: paymentData.status,
                        email: paymentData.payer.email
                    };

                    await order.save();
                    console.log("✅ Orden actualizada a PAGADO en DB");
                } else {
                    console.error("❌ Orden no encontrada en DB");
                }
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("Webhook Error:", error);
        res.sendStatus(500);
    }
};