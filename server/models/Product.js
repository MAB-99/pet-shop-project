import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://via.placeholder.com/150" // Imagen por defecto si no suben una
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['perro', 'gato', 'otros'] // <--- ¡Ojo a esto! Solo permite estas 3 palabras
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;