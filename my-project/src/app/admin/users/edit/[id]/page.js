'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function UserEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUserData(res.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${id}`, userData);
      alert('Usuario actualizado correctamente');
      router.push('/admin');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar usuario');
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
      `}</style>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Rol:</label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={userData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Seleccione un Rol</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            <FiSave className="me-2" />
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
