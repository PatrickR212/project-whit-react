'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

// Configuración de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function EditProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, token } = useAuth();
  const router = useRouter();
  const { id } = useParams();

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setFormData({
            name: res.data.product.name,
            description: res.data.product.description,
            price: res.data.product.price,
            stock: res.data.product.stock,
            category: res.data.product.category
          });
        } else {
          throw new Error(res.data.message || 'Producto no encontrado');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put(`/products/${id}`, formData);
      
      if (res.data.success) {
        setSuccess('Producto actualizado correctamente');
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        throw new Error(res.data.message || 'Error al actualizar');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="alert alert-danger">
        {error}
        <button 
          className="btn btn-link" 
          onClick={() => router.push('/admin')}
        >
          Volver al dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <style jsx>{`
        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 0.15rem 0.5rem rgba(0,0,0,0.05);
        }
        
        .form-label {
          font-weight: 600;
          color: #4e73df;
        }
        
        .form-control, .form-select {
          border-radius: 0.35rem;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d3e2;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #4e73df;
          box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
        }
        
        .btn-primary {
          background-color: #4e73df;
          border-color: #4e73df;
          padding: 0.5rem 1.5rem;
          border-radius: 0.35rem;
        }
        
        .btn-secondary {
          background-color: #858796;
          border-color: #858796;
          padding: 0.5rem 1.5rem;
          border-radius: 0.35rem;
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Editar Producto</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => router.push('/admin')}
        >
          <FiArrowLeft className="me-2" /> Volver
        </button>
      </div>

      {success && (
        <div className="alert alert-success mb-4">
          {success}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="price" className="form-label">Precio</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="stock" className="form-label">Stock</label>
              <input
                type="number"
                className="form-control"
                id="stock"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">Categoría</label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Actualizando...
                </>
              ) : (
                <>
                  <FiSave className="me-2" />
                  Actualizar Producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}