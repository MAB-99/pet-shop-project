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

// 3. Obtener UN solo producto (Por ID)
const obtenerProducto = async (req, res) => {
    const { id } = req.params; // Viene de la URL: /api/product/12345

    try {
        const producto = await Product.findById(id);

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: 'ID no válido o producto no encontrado' });
    }
};

// 4. Actualizar un producto
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const producto = await Product.findById(id);

    if (!producto) {
        return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Actualizamos los campos (Si no envían nada, dejamos el valor viejo)
    producto.name = req.body.name || producto.name;
    producto.price = req.body.price || producto.price;
    producto.description = req.body.description || producto.description;
    producto.image = req.body.image || producto.image;
    producto.stock = req.body.stock || producto.stock;
    producto.category = req.body.category || producto.category;

    try {
        const productoActualizado = await producto.save();
        res.json(productoActualizado);
    } catch (error) {
        console.log(error);
    }
};

// 5. Eliminar un producto
const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Product.findById(id);

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        await producto.deleteOne();
        res.json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: 'Error al eliminar' });
    }
};

export {
    agregarProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
};