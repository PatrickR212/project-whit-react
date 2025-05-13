'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiUsers, FiPackage, FiSettings, FiPlusCircle, FiEdit, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

// Configuración de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function AdminDashboard() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Configurar interceptor para el token
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  // Redirigir si no es admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Cargar datos cuando cambia la pestaña
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  // Función para cargar datos
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (activeTab === 'products') {
        const res = await api.get('/products?limit=1000');
        setProducts(res.data.products || res.data.docs || []);
        setSearchResult(null);
      } else {
        const res = await api.get('/users');
        setUsers(res.data.users || res.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para buscar producto por ID
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResult(null);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const res = await api.get(`/products/${searchTerm.trim()}`);
      if (res.data.product) {
        setSearchResult(res.data.product);
      } else {
        setSearchResult(null);
        setError('No se encontró ningún producto con ese ID');
      }
    } catch (error) {
      console.error('Error searching product:', error);
      setSearchResult(null);
      setError('Error al buscar producto. Verifica el ID e intenta nuevamente.');
    } finally {
      setIsSearching(false);
    }
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResult(null);
    setError(null);
    fetchData();
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    if (!id) {
      alert('ID de producto no válido');
      return;
    }

    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await api.delete(`/products/${id}`);
        
        if (response.status === 200 || response.status === 204) {
          setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
          setSearchTerm('');
          setSearchResult(null);
          await fetchData();
          alert('Producto eliminado con éxito');
        } else {
          throw new Error(`Error inesperado: ${response.status}`);
        }
      } catch (error) {
        console.error('Error eliminando producto:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
          error: error.message
        });
        alert(`Error al eliminar: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Eliminar usuario
  const deleteUser = async (_id) => {
    if (user?._id === _id) {
      alert('No puedes eliminarte a ti mismo');
      return;
    }

    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const response = await api.delete(`/users/${_id}`);
        
        if (response.status === 200 || response.status === 204) {
          setUsers(prev => prev.filter(u => u._id !== _id));
          alert('Usuario eliminado con éxito');
        } else {
          throw new Error(`Error inesperado: ${response.status}`);
        }
      } catch (error) {
        console.error('Error eliminando usuario:', {
          error: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        let errorMessage = 'Error al eliminar usuario';
        if (error.response) {
          errorMessage = error.response.data?.message || 
                       `Error ${error.response.status}: ${error.response.statusText}`;
        }
        
        alert(errorMessage);
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid admin-dashboard">
      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background-color: #f8f9fc;
        }
        
        .sidebar {
          background: linear-gradient(180deg, #4e73df 0%, #224abe 100%);
          min-height: 100vh;
          box-shadow: 4px 0 10px rgba(0,0,0,0.1);
        }
        
        .nav-link {
          color: rgba(255,255,255,0.8);
          padding: 1rem 1.5rem;
          margin: 0.2rem 0;
          border-radius: 0.35rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        
        .nav-link:hover, .nav-link.active {
          color: white;
          background-color: rgba(255,255,255,0.1);
        }
        
        .search-container {
          max-width: 600px;
          margin: 0 auto 30px;
        }
        
        .search-input-group {
          box-shadow: 0 0.15rem 0.5rem rgba(0,0,0,0.1);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .search-btn {
          background-color: #4e73df;
          color: white;
          border: none;
        }
        
        .clear-btn {
          background-color: #e74a3b;
          color: white;
          border: none;
        }
        
        .product-table, .user-table {
          background-color: white;
          box-shadow: 0 0.15rem 0.5rem rgba(0,0,0,0.05);
          border-radius: 0.5rem;
        }
        
        .table th {
          background-color: #4e73df;
          color: white;
        }
        
        .action-btn {
          padding: 0.4rem 0.8rem;
          border-radius: 0.35rem;
        }
        
        .edit-btn {
          background-color: rgba(78, 115, 223, 0.1);
          color: #4e73df;
          border: 1px solid rgba(78, 115, 223, 0.3);
        }
        
        .delete-btn {
          background-color: rgba(231, 74, 59, 0.1);
          color: #e74a3b;
          border: 1px solid rgba(231, 74, 59, 0.3);
        }
        
        .error-message {
          color: #e74a3b;
          margin: 1rem 0;
          text-align: center;
        }
      `}</style>

      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 sidebar p-0">
          <div className="p-4">
            <h4 className="text-center text-white mb-4">Panel Admin</h4>
            <div className="nav flex-column">
              <button
                onClick={() => { setActiveTab('products'); clearSearch(); }}
                className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
              >
                <FiPackage className="me-2" /> Productos
              </button>
              <button
                onClick={() => { setActiveTab('users'); clearSearch(); }}
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              >
                <FiUsers className="me-2" /> Usuarios
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
              >
                <FiSettings className="me-2" /> Configuración
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'products' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2>Gestión de Productos</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => router.push('/admin/products/new')}
                  >
                    <FiPlusCircle className="me-2" /> Nuevo Producto
                  </button>
                </div>

                {/* Buscador por ID */}
                <div className="search-container">
                  <div className="input-group search-input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar producto por ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                      className="btn search-btn" 
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearching || !searchTerm.trim()}
                    >
                      {isSearching ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                      ) : (
                        <FiSearch />
                      )}
                    </button>
                    {searchTerm && (
                      <button 
                        className="btn clear-btn" 
                        type="button"
                        onClick={clearSearch}
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading || isSearching ? (
                  <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive product-table">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Categoría</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResult ? (
                          <tr key={searchResult.id}>
                            <td style={{ fontFamily: 'monospace' }}>{searchResult.id}</td>
                            <td>{searchResult.name}</td>
                            <td>${searchResult.price.toFixed(2)}</td>
                            <td>{searchResult.stock}</td>
                            <td>{searchResult.category}</td>
                            <td>
                              <button 
                                className="btn btn-sm action-btn edit-btn me-2"
                                onClick={() => router.push(`/admin/products/edit/${searchResult.id}`)}
                              >
                                <FiEdit />
                              </button>
                              <button 
                                className="btn btn-sm action-btn delete-btn"
                                onClick={() => deleteProduct(searchResult.id)}
                              >
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ) : products.length > 0 ? (
                          products.map((product) => (
                            <tr key={product.id}>
                              <td style={{ fontFamily: 'monospace' }}>{product.id}</td>
                              <td>{product.name}</td>
                              <td>${product.price.toFixed(2)}</td>
                              <td>{product.stock}</td>
                              <td>{product.category}</td>
                              <td>
                                <button 
                                  className="btn btn-sm action-btn edit-btn me-2"
                                  onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                                >
                                  <FiEdit />
                                </button>
                                <button 
                                  className="btn btn-sm action-btn delete-btn"
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  <FiTrash2 />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              No hay productos disponibles
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="mb-4">Gestión de Usuarios</h2>
                
                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                  <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive user-table">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Rol</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((userItem) => (
                            <tr key={userItem._id}>
                              <td>{userItem.name}</td>
                              <td>{userItem.email}</td>
                              <td>
                                <span className={`badge ${userItem.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                  {userItem.role}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn btn-sm action-btn edit-btn me-2"
                                  onClick={() => router.push(`/admin/users/edit/${userItem._id}`)}
                                >
                                  <FiEdit />
                                </button>
                                {userItem._id !== user?._id && (
                                  <button 
                                    className="btn btn-sm action-btn delete-btn"
                                    onClick={() => deleteUser(userItem._id)}
                                  >
                                    <FiTrash2 />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center py-4">
                              No hay usuarios registrados
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="mb-4">Configuración</h2>
                <div className="card">
                  <div className="card-body">
                    <div className="alert alert-info mb-0">
                      Panel de configuración en desarrollo
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}