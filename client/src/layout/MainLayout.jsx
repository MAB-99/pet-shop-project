import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 1. Header Fijo arriba */}
            <Header />

            {/* 2. Contenido Variable (Outlet) */}
            <main className="flex-1">
                {/* Aquí React Router renderizará el Login, el Home, etc. */}
                <Outlet />
            </main>

            {/* 3. Footer al final */}
            <Footer />
        </div>
    );
};

export default MainLayout;