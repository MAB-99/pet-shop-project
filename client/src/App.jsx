import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';

// Componente Home temporal
const Home = () => <div className="h-screen flex items-center justify-center text-3xl">Página de Inicio</div>;

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Rutas Públicas envueltas en el MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          {/* Aquí agregaremos /tienda, /producto/:id, etc. */}
        </Route>

      </Routes>
    </AuthProvider>
  )
}

export default App;