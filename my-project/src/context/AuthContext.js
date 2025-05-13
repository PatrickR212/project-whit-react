import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Añade estado para el token
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Interceptor modificado
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      error => {
        // No manejar 401 para rutas de autenticación
        if (error.response?.status === 401) {
          const isAuthRoute = ['/auth/login', '/auth/register'].some(route => 
            error.config.url.includes(route)
          );
          
          if (!isAuthRoute) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    loadUser();

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setToken(token); // Guarda el token en el estado
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Error al cargar usuario:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null); // Limpia el token
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/login', credentials);
      
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      
      router.push('/dashboard');
      return res.data;
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.response?.data?.message || "Credenciales inválidas");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const registerRes = await api.post('/auth/register', userData);
      
      const loginRes = await api.post('/auth/login', {
        email: userData.email,
        password: userData.password
      });

      localStorage.setItem('token', loginRes.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.token}`;
      setUser(loginRes.data.user);
      
      router.push('/');
      return loginRes.data;
    } catch (err) {
      console.error("Error en registro:", err);
      setError(err.response?.data?.message || "Error en el registro");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, token, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};