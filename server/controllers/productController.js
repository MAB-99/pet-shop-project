import Product from '../models/Product.js';

// 1. Agregar un nuevo producto (Solo Admins deberían poder, pero por ahora todos)
const agregarProducto = async (req, res) => {
    const producto = new Product(req.body);

    try {
        const productoGuardado = await producto.save();
        res.json(productoGuardado);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Hubo un error al guardar el producto' });
    }
};

// 2. Obtener todos los productos (Para el catálogo del Frontend)
const obtenerProductos = async (req, res) => {
    const productos = await Product.find(); // .find() sin filtro trae TODO
    res.json(productos);
};

export {
    agregarProducto,
    obtenerProductos
};