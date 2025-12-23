// server/controllers/paymentController.js (Versión Final Limpia)
import { MercadoPagoConfig, Preference } from 'mercadopago';

export const createPreference = async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const preference = new Preference(client);

        const { items } = req.body;

        const body = {
            items: items.map(item => ({
                title: item.title,
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
        };

        const result = await preference.create({ body });

        res.json({
            id: result.id,
            url: result.init_point
        });

    } catch (error) {
        console.error("Error creando preferencia:", error);
        res.status(500).json({ error: "Error al procesar el pago" });
    }
};