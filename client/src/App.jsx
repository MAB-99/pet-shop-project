import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import MainLayout from './layout/MainLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import { Toaster } from 'react-hot-toast';

// PÁGINAS
import Login from './pages/Login';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <CartDrawer />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="tienda" element={<Shop />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="servicios" element={<Services />} />
            <Route path="nosotros" element={<About />} />
            <Route path="contacto" element={<Contact />} />
            <Route path="registro" element={<Register />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;