'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Pasarelas() {
  const [isClient, setIsClient] = useState(false);
  const [showPayPal, setShowPaypal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('50.00');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (showPayPal && typeof window !== 'undefined' && window.paypal) {
      window.paypal
        .Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                  description: 'Compra en Licores Premium',
                },
              ],
              application_context: {
                shipping_preference: 'NO_SHIPPING',
              },
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              const message = `¡Pago aprobado! Gracias ${details.payer.name.given_name} por su compra de $${amount}.`;
              document.getElementById('result-message').innerText = message;
              const resultElement = document.getElementById('result-message');
              resultElement.classList.add('animate__animated', 'animate__bounceIn');
              setTimeout(() => {
                resultElement.classList.remove('animate__bounceIn');
              }, 1000);
            });
          },
          onError: function (err) {
            console.error('Error en PayPal:', err);
            const resultElement = document.getElementById('result-message');
            resultElement.innerText = 'Error en el proceso de pago con PayPal';
            resultElement.classList.add('text-red-500');
          },
        })
        .render('#paypal-button-container');
    }
  }, [showPayPal, amount]);

  if (!isClient || loading || !user) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: '3rem', height: '3rem' }}
          role="status"
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      logo: '/assets/images/Paypal-logo.png',
      color: '#003087',
      bg: 'linear-gradient(135deg, #003087 0%, #009cde 100%)',
      action: () => setShowPaypal(true),
    },
    {
      id: 'payu',
      name: 'PayU',
      logo: '/assets/images/PayU-logo.png',
      color: '#FF6600',
      bg: 'linear-gradient(135deg, #FF6600 0%, #FF9900 100%)',
      action: () => (window.location.href = '/api/payments/payu-redirect'),
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 12,
      },
    },
  };

  return (
    <div
      className="container-fluid px-0"
      style={{
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
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
            zIndex: 0,
          }}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
            opacity: [0.1, 0.3, 0],
            scale: [0.5, 1, 1.5],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatDelay: Math.random() * 10,
          }}
        />
      ))}

      <Script
        src="https://www.paypal.com/sdk/js?client-id=test&buyer-country=US&currency=USD&components=buttons&enable-funding=venmo,paylater,card"
        strategy="afterInteractive"
      />

      <div className="container py-5">
        <motion.div
          className="row justify-content-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div className="col-lg-8" variants={container} initial="hidden" animate="show">
            <motion.div
              className="card border-0 shadow-lg overflow-hidden mb-5"
              style={{
                borderRadius: '25px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
              variants={item}
            >
              <div className="card-body p-5">
                <motion.div className="text-center mb-5">
                  <motion.h1
                    className="display-4 fw-bold mb-3"
                    style={{
                      background: 'linear-gradient(90deg, #6C5CE7, #00CEC9)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Pasarelas de Pago
                  </motion.h1>
                  <motion.p
                    className="text-muted"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Selecciona tu método de pago preferido
                  </motion.p>
                </motion.div>

                {!selectedMethod ? (
                  <>
                    <motion.div className="mb-5" variants={item}>
                      <label
                        className="form-label fw-bold d-flex align-items-center"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <FiDollarSign className="me-2" /> Monto a pagar
                      </label>
                      <motion.div className="input-group">
                        <span className="input-group-text bg-transparent border-end-0">$</span>
                        <motion.input
                          type="text"
                          className="form-control border-start-0 py-3"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          whileFocus={{
                            boxShadow: '0 0 0 2px rgba(108, 92, 231, 0.3)',
                          }}
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                          }}
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div className="row g-4" variants={container}>
                      {paymentMethods.map((method) => (
                        <motion.div key={method.id} className="col-md-6" variants={item}>
                          <motion.div
                            className="payment-method-card position-relative overflow-hidden h-100"
                            style={{
                              borderRadius: '20px',
                              cursor: 'pointer',
                              background: method.bg,
                              color: 'white',
                              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                              border: `3px solid ${method.color}`,
                              transformStyle: 'preserve-3d',
                              transition: 'all 0.3s ease',
                            }}
                            onClick={() => {
                              setSelectedMethod(method);
                              method.action();
                            }}
                            whileHover={{
                              y: -10,
                              boxShadow: `0 25px 50px ${method.color}60`,
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="position-relative z-index-2 h-100 d-flex flex-column align-items-center justify-content-center p-4">
                              <motion.div
                                className="mb-4 p-3 bg-white rounded-circle"
                                style={{ width: '100px', height: '100px' }}
                                whileHover={{ rotate: 5 }}
                              >
                                <img
                                  src={method.logo}
                                  alt={method.name}
                                  className="img-fluid h-100"
                                  style={{ objectFit: 'contain' }}
                                />
                              </motion.div>
                              <motion.h3
                                className="h4 fw-bold mb-0 text-center"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                              >
                                Pagar con {method.name}
                              </motion.h3>
                            </div>
                            <motion.div
                              className="position-absolute top-0 start-0 w-100 h-100"
                              style={{
                                background: `radial-gradient(circle, ${method.color}40 0%, transparent 70%)`,
                                mixBlendMode: 'overlay',
                                zIndex: 1,
                              }}
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.6, 0],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          </motion.div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.button
                      onClick={() => {
                        setSelectedMethod(null);
                        setShowPaypal(false);
                      }}
                      className="btn mb-4 d-flex align-items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: 'rgba(108, 92, 231, 0.1)',
                        color: '#6C5CE7',
                        borderRadius: '15px',
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      <FiArrowLeft className="me-2" /> Volver a métodos de pago
                    </motion.button>

                    <div className="text-center">
                      <motion.div
                        className="mb-4"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <img
                          src={selectedMethod.logo}
                          alt={selectedMethod.name}
                          style={{ height: '80px', objectFit: 'contain' }}
                        />
                      </motion.div>

                      <motion.h3
                        className="mb-4"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          color: selectedMethod.color,
                        }}
                      >
                        Estás pagando: <span className="fw-bold">${amount}</span>
                      </motion.h3>

                      {selectedMethod.id === 'paypal' && (
                        <motion.div
                          className="mt-5"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div
                            id="paypal-button-container"
                            className="mx-auto"
                            style={{ maxWidth: '500px' }}
                          />
                          <motion.p
                            id="result-message"
                            className="mt-4 fw-bold"
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                              minHeight: '24px',
                            }}
                          />
                        </motion.div>
                      )}

                      {selectedMethod.id === 'payu' && (
                        <motion.div
                          className="mt-5"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <motion.button
                            onClick={selectedMethod.action}
                            className="btn py-3 px-5 fw-bold border-0 d-flex align-items-center mx-auto"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: `0 10px 20px ${selectedMethod.color}30`,
                            }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              background: selectedMethod.bg,
                              color: 'white',
                              borderRadius: '15px',
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            <FiCreditCard className="me-2" /> Proceder con PayU
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="card border-0 shadow-lg overflow-hidden"
              style={{
                borderRadius: '25px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
              variants={item}
            >
              <div className="card-body p-4 text-center">
                <motion.p
                  className="mb-0 text-muted"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <FiCreditCard className="me-2" /> Tus datos de pago están protegidos con
                  encriptación SSL
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}