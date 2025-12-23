import { MercadoPagoConfig, Preference } from 'mercadopago';

export const createPreference = async (req, res) => {
    try {
        // 1. VERIFICAR TOKEN
        const token = process.env.MP_ACCESS_TOKEN;
        console.log("👉 Token recibido:", token ? `Termina en ...${token.slice(-5)}` : "❌ NO HAY TOKEN");

        if (!token) {
            throw new Error("El MP_ACCESS_TOKEN no está configurado en las variables de entorno");
        }

        const client = new MercadoPagoConfig({ accessToken: token });
        const preference = new Preference(client);

        // 2. VERIFICAR DATOS DEL CARRITO
        const { items } = req.body;
        console.log("👉 Items recibidos:", items ? items.length : "Sin items");

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

        // 3. INTENTAR CREAR LA PREFERENCIA
        console.log("👉 Enviando solicitud a MercadoPago...");
        const result = await preference.create({ body });

        console.log("👉 Respuesta de MercadoPago:", result); // <--- ESTO ES LO QUE NECESITAMOS VER

        if (!result) {
            throw new Error("MercadoPago devolvió undefined. Revisa el Token o la versión de la librería.");
        }

        res.json({
            id: result.id,
            url: result.init_point // Si result es undefined, aquí explota
        });

    } catch (error) {
        console.error("❌ ERROR CRÍTICO EN PAYMENT CONTROLLER:");
        console.error(error);

        res.status(500).json({
            error: "Error al crear pago",
            details: error.message
        });
    }
};