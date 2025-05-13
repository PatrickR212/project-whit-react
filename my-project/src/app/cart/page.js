'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingBag, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      const price = typeof item.price === 'number'
        ? item.price
        : parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
      return sum + price * item.quantity;
    }, 0);
    return total.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    });
  };

  const handleProceedToPayment = () => {
    if (loading) return; // Evita acciones mientras se verifica la autenticación
    if (user) {
      router.push('/pasarelas'); // Redirige a pasarelas si está autenticado
    } else {
      setShowLoginMessage(true); // Muestra mensaje si no está autenticado
      setTimeout(() => setShowLoginMessage(false), 5000); // Oculta el mensaje después de 5 segundos
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 12,
        mass: 0.5,
      },
    },
    exit: {
      y: -30,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, type: 'spring', stiffness: 100 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div
      className="container py-5"
      style={{
        backgroundColor: '#FFFFFF',
        minHeight: 'calc(100vh - 80px)',
        maxWidth: '1200px',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-5"
      >
        <div className="d-flex align-items-center mb-4">
          <Link href="/" className="me-3">
            <motion.div
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="text-dark position-relative"
            >
              <FaArrowLeft size={24} />
              <motion.span
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background: 'radial-gradient(circle, rgba(0,64,128,0.2) 0%, rgba(0,64,128,0) 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.5 }}
              />
            </motion.div>
          </Link>
          <motion.h1
            className="h2 mb-0 text-dark"
            style={{ fontWeight: '700' }}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Tu Carrito de Compras
          </motion.h1>
        </div>

        {/* Mensaje de "Debes iniciar sesión" */}
        <AnimatePresence>
          {showLoginMessage && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="alert alert-warning d-flex align-items-center mb-4"
              role="alert"
              style={{ borderRadius: '12px', backgroundColor: '#fff3cd', color: '#856404' }}
            >
              <FaExclamationCircle className="me-2" size={24} />
              <div>
                Debes iniciar sesión para proceder al pago.
                <Link
                  href="/auth/login"
                  className="btn btn-sm ms-3"
                  style={{
                    backgroundColor: '#004080',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '5px 15px',
                  }}
                >
                  Iniciar Sesión
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {cartItems.length === 0 ? (
          <motion.div
            className="text-center py-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.3,
              type: 'spring',
              stiffness: 100,
              damping: 10,
            }}
          >
            <motion.div
              initial={{ rotate: -10, y: 20 }}
              animate={{ rotate: 0, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 10,
                delay: 0.5,
              }}
            >
              <motion.div
                className="mb-4"
                style={{ fontSize: '5rem', color: '#e9ecef' }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <FaShoppingBag />
              </motion.div>
              <p className="h4 text-muted mb-4" style={{ color: '#6c757d' }}>
                Tu carrito está vacío
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/products"
                  className="btn btn-lg position-relative overflow-hidden"
                  style={{
                    backgroundColor: '#004080',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '12px 35px',
                    fontWeight: '600',
                    border: 'none',
                  }}
                >
                  <span className="position-relative z-index-1">Explorar Productos</span>
                  <motion.div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                      transform: 'translateX(-100%)',
                    }}
                    animate={{
                      translateX: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="row">
            <div className="col-lg-8">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layout
                    exit="exit"
                    className="card mb-3 position-relative overflow-hidden"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '15px',
                      border: 'none',
                      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                    }}
                    whileHover={{
                      boxShadow: '0 10px 25px rgba(0, 64, 128, 0.15)',
                      y: -3,
                    }}
                  >
                    <motion.div
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: 'linear-gradient(45deg, #004080, #009688)',
                        zIndex: -1,
                        opacity: 0,
                        borderRadius: '15px',
                        padding: '2px',
                      }}
                      whileHover={{
                        opacity: 1,
                      }}
                    />
                    <div className="card-body p-4 d-flex align-items-center position-relative">
                      <motion.div
                        className="flex-shrink-0 me-4 position-relative"
                        whileHover={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.6 }}
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="rounded"
                          style={{
                            width: '90px',
                            height: '90px',
                            objectFit: 'contain',
                            border: '1px solid #f1f1f1',
                            zIndex: 1,
                          }}
                        />
                        <motion.div
                          className="position-absolute top-0 start-0 w-100 h-100"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                            borderRadius: '8px',
                            opacity: 0,
                          }}
                          whileHover={{
                            opacity: 0.3,
                          }}
                        />
                      </motion.div>
                      <div className="flex-grow-1">
                        <h5
                          className="mb-1"
                          style={{
                            color: '#004080',
                            fontWeight: '600',
                            textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          }}
                        >
                          {item.name}
                        </h5>
                        <p
                          className="mb-2"
                          style={{
                            color: '#009688',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                          }}
                        >
                          {item.price.toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                          })}
                        </p>
                        <div className="d-flex align-items-center">
                          <motion.button
                            className="btn btn-sm me-2 d-flex align-items-center justify-content-center position-relative overflow-hidden"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #dee2e6',
                              color: '#004080',
                            }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{
                              backgroundColor: '#e9ecef',
                              color: '#004080',
                            }}
                          >
                            <FaMinus size={12} />
                            <motion.div
                              className="position-absolute top-0 start-0 w-100 h-100"
                              style={{
                                background: 'radial-gradient(circle, rgba(0,64,128,0.1) 0%, rgba(0,64,128,0) 70%)',
                                borderRadius: '50%',
                                opacity: 0,
                              }}
                              whileHover={{ opacity: 1 }}
                            />
                          </motion.button>
                          <motion.span
                            className="mx-2"
                            style={{
                              minWidth: '30px',
                              textAlign: 'center',
                              fontWeight: '600',
                              fontSize: '1.1rem',
                              color: '#004080',
                            }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            className="btn btn-sm ms-2 d-flex align-items-center justify-content-center position-relative overflow-hidden"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #dee2e6',
                              color: '#004080',
                            }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{
                              backgroundColor: '#e9ecef',
                              color: '#004080',
                            }}
                          >
                            <FaPlus size={12} />
                            <motion.div
                              className="position-absolute top-0 start-0 w-100 h-100"
                              style={{
                                background: 'radial-gradient(circle, rgba(0,64,128,0.1) 0%, rgba(0,64,128,0) 70%)',
                                borderRadius: '50%',
                                opacity: 0,
                              }}
                              whileHover={{ opacity: 1 }}
                            />
                          </motion.button>
                        </div>
                      </div>
                      <motion.button
                        className="btn btn-link ms-auto position-relative"
                        onClick={() => removeFromCart(item.id)}
                        whileHover={{
                          scale: 1.2,
                          color: '#dc3545',
                        }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          color: '#6c757d',
                          width: '42px',
                          height: '42px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                        }}
                      >
                        <FaTrash size={20} />
                        <motion.div
                          className="position-absolute top-0 start-0 w-100 h-100"
                          style={{
                            background: 'radial-gradient(circle, rgba(220,53,69,0.15) 0%, rgba(220,53,69,0) 70%)',
                            borderRadius: '50%',
                            opacity: 0,
                          }}
                          whileHover={{
                            opacity: 1,
                            scale: 1.1,
                          }}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="col-lg-4 mt-4 mt-lg-0">
              <motion.div
                className="card shadow-sm border-0 sticky-top overflow-hidden"
                style={{
                  top: '100px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '15px',
                  border: 'none',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                <motion.div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: 'linear-gradient(45deg, #004080, #009688)',
                    zIndex: -1,
                    opacity: 0.1,
                    borderRadius: '15px',
                    padding: '2px',
                  }}
                  animate={{
                    background: [
                      'linear-gradient(45deg, #004080, #009688)',
                      'linear-gradient(45deg, #009688, #004080)',
                      'linear-gradient(45deg, #004080, #009688)',
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <div className="card-body p-4 position-relative">
                  <h5
                    className="card-title mb-4"
                    style={{
                      color: '#004080',
                      fontWeight: '600',
                      fontSize: '1.5rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    Resumen de Compra
                  </h5>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ color: '#6c757d' }}>Subtotal:</span>
                    <span style={{ fontWeight: 'bold', color: '#004080' }}>{calculateTotal()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ color: '#6c757d' }}>Envío:</span>
                    <span style={{ fontWeight: 'bold', color: '#28a745' }}>Gratis</span>
                  </div>
                  <motion.hr
                    className="my-4"
                    style={{ borderColor: '#e9ecef' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6 }}
                  />
                  <div className="d-flex justify-content-between mb-4">
                    <h6
                      style={{
                        color: '#004080',
                        fontWeight: '600',
                        fontSize: '1.2rem',
                      }}
                    >
                      Total:
                    </h6>
                    <h5
                      style={{
                        color: '#009688',
                        fontWeight: 'bold',
                        fontSize: '1.4rem',
                      }}
                    >
                      {calculateTotal()}
                    </h5>
                  </div>
                  <motion.button
                    className="btn w-100 py-3 position-relative overflow-hidden"
                    style={{
                      backgroundColor: '#004080',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      border: 'none',
                      zIndex: 1,
                    }}
                    onClick={handleProceedToPayment}
                    disabled={loading || cartItems.length === 0}
                    whileHover={{
                      backgroundColor: '#002C60',
                      scale: 1.02,
                      boxShadow: '0 5px 20px rgba(0, 64, 128, 0.3)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="position-relative z-index-1">Proceder al Pago</span>
                    <motion.div
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                        transform: 'translateX(-100%)',
                        opacity: 0.6,
                      }}
                      animate={{
                        translateX: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <motion.div
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                        opacity: 0,
                      }}
                      whileHover={{ opacity: 0.3 }}
                    />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage;