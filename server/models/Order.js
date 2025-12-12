import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    // 1. ¿Quién compró? (Relación con User)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Debe coincidir con el nombre que pusiste en mongoose.model('User'...)
    },
    // 2. ¿Qué compró? (Lista de productos)
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true }, // Cantidad
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product' // Relación con Product
            }
        }
    ],
    // 3. Dirección de envío
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    // 4. Datos de pago
    paymentMethod: {
        type: String,
        required: true,
    },
    // 5. Montos (Es bueno guardarlos por separado para no recalcular siempre)
    taxPrice: { // Impuestos
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: { // Costo envío
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    // 6. Estados del pedido
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;