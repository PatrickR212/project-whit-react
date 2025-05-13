'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    }
  };

  return (
    <div className="container-fluid px-0" style={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Efectos de partículas de fondo */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="position-absolute rounded-circle"
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            background: `radial-gradient(circle, hsla(${Math.random() * 60 + 200}, 80%, 70%, ${Math.random() * 0.2 + 0.1})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(10px)',
            zIndex: 0
          }}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
            opacity: [0.1, 0.3, 0],
            scale: [0.5, 1, 1.5]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatDelay: Math.random() * 10
          }}
        />
      ))}

      <div className="container py-5">
        <motion.div 
          className="row justify-content-center align-items-center"
          style={{ minHeight: '90vh' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="col-lg-6 col-md-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div 
              className="card border-0 shadow-lg overflow-hidden"
              style={{
                borderRadius: '25px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
              variants={item}
              whileHover={{ y: -5 }}
            >
              <div className="card-body p-5">
                <motion.div 
                  className="text-center mb-5"
                  variants={item}
                >
                  <motion.h2 
                    className="display-4 fw-bold mb-3"
                    style={{
                      background: 'linear-gradient(90deg, #00CEC9, #6C5CE7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: "'Montserrat', sans-serif"
                    }}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Únete a nosotros
                  </motion.h2>
                  <motion.p 
                    className="text-muted"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Crea una cuenta para empezar
                  </motion.p>
                </motion.div>

                {error && (
                  <motion.div 
                    className="alert alert-danger"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    {error}
                  </motion.div>
                )}

                <motion.form 
                  onSubmit={handleSubmit}
                  variants={container}
                >
                  <motion.div 
                    className="mb-4"
                    variants={item}
                  >
                    <label className="form-label fw-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Nombre</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <FiUser />
                      </span>
                      <motion.input
                        type="text"
                        name="name"
                        className="form-control border-start-0 py-3"
                        placeholder="Tu nombre completo"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        whileFocus={{
                          boxShadow: '0 0 0 2px rgba(0, 206, 201, 0.3)'
                        }}
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="mb-4"
                    variants={item}
                  >
                    <label className="form-label fw-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <FiMail />
                      </span>
                      <motion.input
                        type="email"
                        name="email"
                        className="form-control border-start-0 py-3"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        whileFocus={{
                          boxShadow: '0 0 0 2px rgba(0, 206, 201, 0.3)'
                        }}
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="mb-4"
                    variants={item}
                  >
                    <label className="form-label fw-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Contraseña</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <FiLock />
                      </span>
                      <motion.input
                        type="password"
                        name="password"
                        className="form-control border-start-0 py-3"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                        whileFocus={{
                          boxShadow: '0 0 0 2px rgba(0, 206, 201, 0.3)'
                        }}
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="mb-4"
                    variants={item}
                  >
                    <label className="form-label fw-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Confirmar Contraseña</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <FiLock />
                      </span>
                      <motion.input
                        type="password"
                        name="confirmPassword"
                        className="form-control border-start-0 py-3"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                        whileFocus={{
                          boxShadow: '0 0 0 2px rgba(0, 206, 201, 0.3)'
                        }}
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={item}>
                    <motion.button
                      type="submit"
                      className="btn w-100 py-3 fw-bold border-0"
                      disabled={loading}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 10px 20px rgba(0, 206, 201, 0.3)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: 'linear-gradient(90deg, #00CEC9, #6C5CE7)',
                        color: 'white',
                        borderRadius: '15px',
                        fontFamily: "'Montserrat', sans-serif"
                      }}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : (
                        <FiUser className="me-2" />
                      )}
                      Registrarse
                    </motion.button>
                  </motion.div>
                </motion.form>

                <motion.div 
                  className="text-center mt-4"
                  variants={item}
                >
                  <p className="text-muted mb-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    ¿Ya tienes cuenta?{' '}
                    <motion.button
                      onClick={() => router.push('/auth/login')}
                      className="btn btn-link p-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ 
                        color: '#00CEC9',
                        fontWeight: '600',
                        fontFamily: "'Montserrat', sans-serif",
                        textDecoration: 'none'
                      }}
                    >
                      Inicia sesión aquí
                      <FiLogIn className="ms-1" />
                    </motion.button>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}