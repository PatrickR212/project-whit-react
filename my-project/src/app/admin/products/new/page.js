'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function NewProduct() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
    rating: 4.0,
    featured: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Error al crear el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Nuevo Producto</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">ID</label>
                  <input
                    type="number"
                    className="form-control"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="Vodka">Vodka</option>
                    <option value="Ron">Ron</option>
                    <option value="Tequila">Tequila</option>
                    <option value="Whisky">Whisky</option>
                    <option value="Aguardiente">Aguardiente</option>
                    <option value="Cerveza">Cerveza</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">URL de Imagen</label>
                  <input
                    type="text"
                    className="form-control"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <input
                    type="number"
                    className="form-control"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Producto Destacado</label>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    onClick={() => router.push('/admin')}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
