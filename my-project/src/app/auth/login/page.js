'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FiLogIn, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login({ email, password });
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
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
                      background: 'linear-gradient(90deg, #6C5CE7, #00CEC9)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: "'Montserrat', sans-serif"
                    }}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Bienvenido de vuelta
                  </motion.h2>
                  <motion.p 
                    className="text-muted"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Inicia sesión para acceder a tu cuenta
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
                    <label className="form-label fw-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <FiMail />
                      </span>
                      <motion.input
                        type="email"
                        className="form-control border-start-0 py-3"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        whileFocus={{
                          boxShadow: '0 0 0 2px rgba(108, 92, 231, 0.3)'
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
                        className="form-control border-start-0 py-3"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        whileFocus={{
                          boxShadow: '0 0 0 2px rgba(108, 92, 231, 0.3)'
                        }}
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="d-flex justify-content-between align-items-center mb-4"
                    variants={item}
                  >
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="rememberMe" 
                        style={{ cursor: 'pointer' }}
                      />
                      <label 
                        className="form-check-label" 
                        htmlFor="rememberMe"
                        style={{ fontFamily: "'Montserrat', sans-serif", cursor: 'pointer' }}
                      >
                        Recuérdame
                      </label>
                    </div>
                    <motion.button
                      type="button"
                      className="btn btn-link p-0"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ 
                        color: '#6C5CE7',
                        fontFamily: "'Montserrat', sans-serif",
                        textDecoration: 'none'
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </motion.button>
                  </motion.div>

                  <motion.div variants={item}>
                    <motion.button
                      type="submit"
                      className="btn w-100 py-3 fw-bold border-0"
                      disabled={loading}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 10px 20px rgba(108, 92, 231, 0.3)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: 'linear-gradient(90deg, #6C5CE7, #00CEC9)',
                        color: 'white',
                        borderRadius: '15px',
                        fontFamily: "'Montserrat', sans-serif"
                      }}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : (
                        <FiLogIn className="me-2" />
                      )}
                      Iniciar Sesión
                    </motion.button>
                  </motion.div>
                </motion.form>

                <motion.div 
                  className="text-center mt-4"
                  variants={item}
                >
                  <p className="text-muted mb-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    ¿No tienes cuenta?{' '}
                    <motion.button
                      onClick={() => router.push('/auth/register')}
                      className="btn btn-link p-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ 
                        color: '#6C5CE7',
                        fontWeight: '600',
                        fontFamily: "'Montserrat', sans-serif",
                        textDecoration: 'none'
                      }}
                    >
                      Regístrate aquí
                      <FiUserPlus className="ms-1" />
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