import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, FilterX, SlidersHorizontal, Package, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../lib/constants';

const Shop = () => {
    // 1. Estados
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortOption, setSortOption] = useState('newest');

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // 2. Fetch de Productos Reales
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/product`);
                setProducts(data);
            } catch (error) {
                console.error("Error cargando productos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // 3. Lógica de Filtrado (Client Side)
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Filtro Texto
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

            // Filtro Categoría (Debe coincidir con los valores de tu DB: perro, gato, otros)
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

            // Filtro Precio
            const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
            const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        }).sort((a, b) => {
            // Ordenamiento
            if (sortOption === 'price-asc') return a.price - b.price;
            if (sortOption === 'price-desc') return b.price - a.price;
            if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
            // Default: newest (usamos createdAt si existe, o id)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }, [products, searchTerm, categoryFilter, priceRange, sortOption]);

    // 4. Componente de Filtros (Reutilizable)
    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Buscador */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Categorías */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white"
                >
                    <option value="all">Todas</option>
                    <option value="perro">Perros</option>
                    <option value="gato">Gatos</option>
                    <option value="otros">Otros</option>
                </select>
            </div>

            {/* Precio */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Mín"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                    />
                    <input
                        type="number"
                        placeholder="Máx"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                    />
                </div>
            </div>

            {/* Botón Reset */}
            <button
                onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setPriceRange({ min: '', max: '' });
                    setSortOption('newest');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
                <FilterX className="w-4 h-4" /> Limpiar Filtros
            </button>
        </div>
    );

    return (
        <>
            <Helmet><title>Tienda - FIDO'S PET SHOP</title></Helmet>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Nuestra Tienda</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Escritorio */}
                    <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm self-start sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Filtros</h2>
                        <FilterSidebar />
                    </aside>

                    {/* Contenido Principal */}
                    <main className="lg:col-span-3">

                        {/* Barra Superior Móvil y Ordenamiento */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

                            {/* Botón Filtros Móvil */}
                            <button
                                className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white"
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                            >
                                <SlidersHorizontal className="w-4 h-4" /> Filtros
                            </button>

                            {/* Menú Filtros Móvil (Desplegable simple) */}
                            {isMobileFilterOpen && (
                                <div className="lg:hidden w-full bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                                    <FilterSidebar />
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto ml-auto">
                                <p className="text-gray-600 whitespace-nowrap text-sm">
                                    {filteredProducts.length} productos encontrados
                                </p>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-yellow-500 outline-none cursor-pointer"
                                >
                                    <option value="newest">Más nuevos</option>
                                    <option value="price-asc">Precio: Menor a Mayor</option>
                                    <option value="price-desc">Precio: Mayor a Menor</option>
                                    <option value="name-asc">Nombre: A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid de Productos */}
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-yellow-600" />
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-600">No encontramos productos</h3>
                                <p className="text-gray-500">Prueba ajustando los filtros de búsqueda.</p>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </>
    );
};

export default Shop;