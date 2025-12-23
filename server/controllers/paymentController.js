import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configuración del Cliente con tu Token
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export const createPreference = async (req, res) => {
    try {
        const { items } = req.body;

        // 2. Mapeamos los productos al formato que pide MercadoPago
        // El frontend nos enviará [{title, price, quantity}]
        const body = {
            items: items.map(item => ({
                title: item.title,
                unit_price: Number(item.price),
                currency_id: 'ARS', // Cambia a 'MXN', 'USD', etc. según tu país
                quantity: Number(item.quantity),
            })),
            back_urls: {
                success: "https://pet-shop-project-nine.vercel.app/", // A dónde vuelve si sale bien
                failure: "https://pet-shop-project-nine.vercel.app/",
                pending: "https://pet-shop-project-nine.vercel.app/",
            },
            auto_return: "approved",
        };

        // 3. Crear la preferencia
        const preference = new Preference(client);
        const result = await preference.create({ body });

        // 4. Devolver el ID de la preferencia al Frontend
        res.json({
            id: result.id,
            url: result.body.init_point
        });

    } catch (error) {
        // --- AGREGA ESTOS LOGS PARA VER EL ERROR EN RENDER ---
        console.error("❌ ERROR MERCADOPAGO DETALLADO:");
        console.error(error);
        console.error("Mensaje:", error.message);
        if (error.cause) console.error("Causa:", error.cause);
        // -----------------------------------------------------

        // Devolvemos el error real al frontend para que tú lo veas en la alerta (solo para desarrollo)
        res.status(500).json({
            error: "Error al crear pago",
            details: error.message
        });
    }
};