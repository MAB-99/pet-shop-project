import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import useCart from '../hooks/useCart';

const MainLayout = () => {
    // Obtenemos el estado de visibilidad del contexto
    const { isCartOpen, closeCart } = useCart();

    return (
        <div className="flex flex-col min-h-screen relative"> {/* relative es importante */}
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />

            {/* EL CARRITO VIVE AQUÍ, FLOTANDO SOBRE TODO */}
            <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
        </div>
    );
};

export default MainLayout;