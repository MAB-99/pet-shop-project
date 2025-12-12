import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthProvider';
import useAuth from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  )
}

function Home() {
  const { auth } = useAuth();

  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">
        {auth._id ? `Hola de nuevo, ${auth.name} 👋` : 'Bienvenido a la Tienda 🐶'}
      </h1>

      {!auth._id && (
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ir a Iniciar Sesión
        </Link>
      )}
    </div>
  );
}

export default App;