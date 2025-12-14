import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import MainLayout from './layout/MainLayout';

// PÁGINAS
import Login from './pages/Login';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="tienda" element={<Shop />} />
            <Route path="perfil" element={<Profile />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;