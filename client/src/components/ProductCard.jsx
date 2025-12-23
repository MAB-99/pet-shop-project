import { useState, useEffect } from 'react';
import { ShoppingCart, Package, AlertTriangle, Check } from 'lucide-react';
import useCart from '../hooks/useCart';

const ProductCard = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    // Traemos el carrito para saber cuántos de este producto ya tenemos
    const { addToCart, cart } = useCart();

    // Calculamos el stock real disponible para agregar
    const cartItem = cart.find(item => item._id === product._id);
    const inCartQuantity = cartItem ? cartItem.quantity : 0;
    const initialStock = product.stock || 0;
    const availableStock = initialStock - inCartQuantity;

    const isOutOfStock = availableStock <= 0;
    const isLowStock = availableStock > 0 && availableStock < 5;

    // Resetear cantidad a 1 si cambia el stock disponible
    useEffect(() => {
        if (quantity > availableStock && availableStock > 0) {
            setQuantity(availableStock);
        }
    }, [availableStock, quantity]);

    const handleIncrement = () => {
        if (quantity < availableStock) setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        // Intentamos agregar (el Provider validará de nuevo por seguridad)
        addToCart(product, quantity); // Pasamos el objeto y la cantidad

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        setQuantity(1); // Volvemos a 1 después de agregar
    };

    return (
        <div className="flex flex-col w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">

            {/* IMAGEN */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden group">
                <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                />

                {/* Badges */}
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-lg">
                            {initialStock === 0 ? 'AGOTADO' : 'MÁXIMO ALCANZADO'}
                        </span>
                    </div>
                )}
                {isLowStock && (
                    <div className="absolute top-2 right-2">
                        <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Quedan {availableStock}
                        </span>
                    </div>
                )}
            </div>

            {/* CONTENIDO */}
            <div className="p-4 flex-grow flex flex-col space-y-3">
                <div>
                    <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full uppercase tracking-wide">
                        {product.category || 'Mascotas'}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mt-2 min-h-[3.5rem] line-clamp-2">
                        {product.name}
                    </h3>
                </div>

                <div className="mt-auto space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                        <span className="text-2xl font-extrabold text-gray-900">${product.price}</span>
                        {inCartQuantity > 0 && (
                            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md">
                                {inCartQuantity} en carrito
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* FOOTER - CONTROLES */}
            <div className="p-4 pt-0 gap-3 flex">
                <div className="flex items-center border border-gray-200 rounded-md bg-white h-10 w-24">
                    <button
                        className="px-2 h-full hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors w-8"
                        onClick={handleDecrement}
                        disabled={isOutOfStock || quantity <= 1}
                    > - </button>
                    <span className="flex-1 text-center text-sm font-bold text-gray-800">{quantity}</span>
                    <button
                        className="px-2 h-full hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors w-8"
                        onClick={handleIncrement}
                        disabled={isOutOfStock || quantity >= availableStock}
                    > + </button>
                </div>

                <button
                    className={`flex-1 h-10 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-all ${isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : added
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                >
                    {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                    {added ? '¡Agregado!' : (isOutOfStock ? 'Sin Stock' : 'Agregar')}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;