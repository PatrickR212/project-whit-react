"use client";
import React, { useState, useEffect,useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiStar, FiSearch, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';

const categories = [
  { name: 'Todos', icon: '🍷', color: '#0EDBCB', bg: 'linear-gradient(135deg,#0EDBCB 0%, #DB6D56 100%)' },
  { name: 'Vodka', icon: '🍸', color: '#1E90FF', bg: 'linear-gradient(135deg, #1E90FF 0%, #4682B4 100%)' },
  { name: 'Ron', icon: '🥃', color: '#FFD700', bg: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)' },
  { name: 'Tequila', icon: '🍹', color: '#32CD32', bg: 'linear-gradient(135deg, #32CD32 0%, #228B22 100%)' },
  { name: 'Whisky', icon: '🥂', color: '#DB2DC9', bg: 'linear-gradient(135deg, #DB2DC9 0%, #800080 100%)' },
  { name: 'Aguardiente', icon: '🍺', color: '#DB0D2F', bg: 'linear-gradient(135deg, #DB0D2F 0%, #FF6347 100%)' },
  { name: 'Cerveza', icon: '🍻', color: '#DB570C', bg: 'linear-gradient(135deg, #DB570C 0%, #CD5C5C 100%)' },
  { name: 'Productos Premium', icon: '💎', color: '#8A2BE2', bg: 'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)' }
];

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovering, setIsHovering] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [productsData, setProductsData] = useState({
    products: [],
    totalPages: 1,
    totalProducts: 0,
    loading: true,
    error: null,
    resetting: false 
  });
  const productsPerPage = 12;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const fetchProducts = useCallback(async () => {
    try {
      setProductsData(prev => ({ 
        ...prev, 
        loading: true, 
        error: null,
        products: prev.resetting ? [] : prev.products 
      }));
      
      const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);
      url.searchParams.append('page', currentPage);
      url.searchParams.append('limit', productsPerPage);
      
      if (selectedCategory !== 'Todos') {
        if (selectedCategory === 'Productos Premium') {
          url.searchParams.append('featured', 'true');
        } else {
          url.searchParams.append('category', selectedCategory);
        }
      }
      
      if (searchQuery.trim()) {
        url.searchParams.append('search', searchQuery.trim());
      }
  
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al cargar productos');
      }
      
      const data = await response.json();
      
      const formattedProducts = data.products.map(product => ({
        ...product,
        formattedPrice: formatPrice(product.price),
        img: product.imageUrl?.startsWith('http') 
          ? product.imageUrl 
          : `/assets/images/${product.imageUrl || 'default-product.png'}`,
        category: product.category || 'Sin categoría'
      }));
      
      setProductsData({
        products: formattedProducts,
        totalPages: data.totalPages,
        totalProducts: data.totalProducts,
        loading: false,
        error: null,
        resetting: false 
      });
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductsData({
        products: [],
        totalPages: 1,
        totalProducts: 0,
        loading: false,
        error: error.message,
        resetting: false
      });
    }
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [fetchProducts]);
  
  useEffect(() => {
    setCurrentPage(1);
    setProductsData(prev => ({ ...prev, resetting: true }));
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = async (product) => {
    setIsAdding(true);
    await addToCart({
      ...product,
      price: typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^0-9.-]+/g, '')) 
        : product.price
    });
    
    const button = document.getElementById(`add-to-cart-${product.id}`);
    if (button) {
      button.innerHTML = `
        <span class="d-flex align-items-center justify-content-center">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
            className="me-2"
          >
            ✓
          </motion.span>
          <span>Añadido</span>
        </span>
      `;
      
      setTimeout(() => {
        button.innerHTML = `
          <span class="d-flex align-items-center justify-content-center">
            <FiShoppingCart className="me-2" />
            <span>Añadir</span>
          </span>
        `;
        setIsAdding(false);
      }, 1500);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, rotateX: 90 },
    show: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        mass: 0.5
      }
    }
  };

  const Particle = ({ color, size, position }) => {
    return (
      <motion.div
        className="position-absolute rounded-circle"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: color,
          left: `${position.x}%`,
          top: `${position.y}%`,
          filter: 'blur(2px)',
          zIndex: 0
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [0.8, 0.4, 0.8],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: Math.random() * 4 + 3,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: "easeInOut"
        }}
      />
    );
  };

  if (productsData.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (productsData.error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">
          Error al cargar los productos: {productsData.error}
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={fetchProducts}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0" style={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Efectos de partículas de fondo */}
      {[...Array(20)].map((_, i) => (
        <Particle 
          key={i}
          color={`hsla(${Math.random() * 60 + 200}, 80%, 70%, ${Math.random() * 0.2 + 0.1})`}
          size={Math.random() * 150 + 50}
          position={{
            x: Math.random() * 100,
            y: Math.random() * 100
          }}
        />
      ))}

      {/* Hero Section con efecto de vidrio */}
      <motion.section
        className="hero-section position-relative overflow-hidden"
        style={{
          height: '80vh',
          minHeight: '700px',
          background: 'linear-gradient(135deg, #2d3436 0%, #1e272e 100%)',
          marginBottom: '5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1000px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="position-absolute w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            zIndex: 1
          }}
        />

        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="position-absolute rounded-circle"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `radial-gradient(circle, hsla(${Math.random() * 60 + 200}, 80%, 70%, ${Math.random() * 0.1 + 0.05})`,
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

        <div className="container position-relative z-index-2">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <motion.h1 
                className="display-2 fw-bold mb-4 text-white"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.2,
                  type: "spring"
                }}
                style={{ 
                  textShadow: '0 5px 15px rgba(0,0,0,0.3)',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #ffffff, #d4d4d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Descubre Nuestra <span style={{ background: 'linear-gradient(90deg, #f9d423, #ff4e50)', WebkitBackgroundClip: 'text' }}>Colección</span>
              </motion.h1>
              
              <motion.p
                className="lead text-white mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                style={{
                  fontSize: '1.6rem',
                  textShadow: '0 2px 5px rgba(0,0,0,0.3)',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300
                }}
              >
                Licores premium seleccionados para los paladares más exigentes
              </motion.p>

              <motion.div
                className="search-container mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
                style={{ 
                  maxWidth: '700px',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                <motion.div
                  className="input-group input-group-lg shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    borderRadius: '50px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <input
                    type="text"
                    className="form-control border-0 py-3 px-4"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                      background: 'transparent',
                      fontSize: '1.1rem',
                      boxShadow: 'none',
                      color: '#333',
                      fontWeight: '500',
                      letterSpacing: '0.5px',
                      border: 'none',
                      outline: 'none',
                      fontFamily: "'Montserrat', sans-serif"
                    }}
                  />
                  <motion.button 
                    className="btn px-4 border-0 d-flex align-items-center"
                    style={{ 
                      fontWeight: '600',
                      background: 'linear-gradient(90deg, #f9d423, #ff4e50)',
                      color: 'white',
                      border: 'none',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiSearch className="me-2" size={18} /> Buscar
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Filtros de Categoría con Efecto 3D */}
      <motion.div 
        className="container my-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="text-center mb-5"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <h2 className="display-4 fw-bold mb-3 text-dark" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            <span className="position-relative d-inline-block">
              <span className="position-relative z-index-2">Explora Nuestras</span>
              <motion.span 
                className="position-absolute bottom-0 start-0 w-100 h-3 z-index-1" 
                style={{ 
                  opacity: 0.2, 
                  bottom: '5px',
                  background: 'linear-gradient(90deg, #6C5CE7, #00CEC9, #FDCB6E, #E84393)'
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%']
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </span>
            <br />
            <span className="text-gradient" style={{ 
              background: 'linear-gradient(90deg, #6C5CE7, #00CEC9, #FDCB6E, #E84393)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800
            }}>
              Categorías Exclusivas
            </span>
          </h2>
          <p className="lead text-muted" style={{ fontFamily: "'Montserrat', sans-serif" }}>Selecciona tu categoría favorita</p>
        </motion.div>
        
        <div className="row justify-content-center g-4">
          {categories.map((category) => (
            <div className="col-auto" key={category.name}>
              <motion.div
                className="position-relative"
                whileHover="hover"
                onHoverStart={() => setIsHovering(category.name)}
                onHoverEnd={() => setIsHovering(null)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.2 + categories.indexOf(category) * 0.1,
                  type: "spring"
                }}
              >
                <motion.div
                  className="category-card position-relative overflow-hidden"
                  style={{
                    width: '220px',
                    height: '220px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    background: selectedCategory === category.name ? category.bg : '#FFFFFF',
                    color: selectedCategory === category.name ? 'white' : category.color,
                    boxShadow: selectedCategory === category.name 
                      ? `0 20px 40px ${category.color}40` 
                      : '0 15px 35px rgba(0, 0, 0, 0.1)',
                    border: `3px solid ${selectedCategory === category.name ? category.color : 'rgba(0, 64, 128, 0.1)'}`,
                    transformStyle: 'preserve-3d',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedCategory(category.name)}
                  variants={{
                    hover: {
                      y: -15,
                      boxShadow: `0 25px 50px ${category.color}60`,
                      transition: { 
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300
                      }
                    }
                  }}
                >
                  <div className="position-relative z-index-2 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <motion.span 
                      className="display-3 mb-3"
                      animate={{
                        scale: isHovering === category.name ? [1, 1.3, 1] : 1,
                        y: isHovering === category.name ? [0, -15, 0] : 0,
                        rotate: isHovering === category.name ? [0, 10, -10, 0] : 0
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {category.icon}
                    </motion.span>
                    <motion.h3 
                      className="h4 fw-bold mb-0 text-center"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      animate={{
                        scale: isHovering === category.name ? [1, 1.1, 1] : 1
                      }}
                    >
                      {category.name}
                    </motion.h3>
                  </div>
                  
                  {selectedCategory === category.name && (
                    <motion.div 
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: `radial-gradient(circle, ${category.color}40 0%, transparent 70%)`,
                        mixBlendMode: 'overlay',
                        zIndex: 1
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
                
                <motion.div
                  className="position-absolute bottom-0 start-50 translate-middle-x"
                  style={{
                    width: '70%',
                    height: '20px',
                    background: category.color,
                    borderRadius: '50%',
                    filter: 'blur(15px)',
                    zIndex: -1,
                    opacity: 0.3
                  }}
                  variants={{
                    hover: {
                      scale: 1.3,
                      opacity: 0.6,
                      transition: { 
                        duration: 0.3,
                        type: "spring"
                      }
                    }
                  }}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Listado de Productos */}
      <motion.div 
        className="container my-5 py-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
          <motion.h2 
            className="display-4 fw-bold text-dark mb-4 mb-md-0"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
          >
            {selectedCategory === 'Todos' ? (
              <span>Nuestra <span style={{ color: '#6C5CE7' }}>Colección</span></span>
            ) : (
              <span>Selección{' '}
                <span style={{ color: categories.find(c => c.name === selectedCategory)?.color || '#000' }}>
                  {selectedCategory}
                </span>
              </span>
            )}
          </motion.h2>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
          >
            <motion.div
              className="badge rounded-pill px-3 py-2"
              whileHover={{ scale: 1.05 }}
              style={{ 
                background: 'linear-gradient(90deg, #6C5CE7, #00CEC9, #FDCB6E, #E84393)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }}
            >
              {productsData.totalProducts} productos
            </motion.div>
          </motion.div>
        </div>

        {searchQuery && productsData.products.length === 0 ? (
          <motion.div
            className="text-center py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="display-1 mb-3"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'mirror'
              }}
            >
              🔍
            </motion.div>
            <h3 className="h3 text-muted mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>Producto no encontrado</h3>
            <p className="lead mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>No encontramos resultados para "{searchQuery}"</p>
            <motion.button
              className="btn btn-primary rounded-pill px-4 py-3"
              onClick={() => setSearchQuery('')}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 5px 15px rgba(0, 64, 128, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                background: 'linear-gradient(90deg, #6C5CE7, #00CEC9)',
                border: 'none',
                fontWeight: 600
              }}
            >
              Ver todos los productos
            </motion.button>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${searchQuery}-${currentPage}`}
                variants={container}
                initial="hidden"
                animate="show"
                className="row g-4"
                exit={{ opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                {productsData.products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="col-md-6 col-lg-4 col-xl-3"
                    variants={item}
                    layout
                  >
                    <motion.div
                      className="product-card h-100 position-relative overflow-hidden"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '25px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        transformStyle: 'preserve-3d'
                      }}
                      whileHover={{
                        y: -15,
                        boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                      }}
                    >
                      {/* Ribbon premium */}
                      {product.featured && (
                        <motion.div 
                          className="position-absolute top-0 end-0 px-4 py-2 text-white fw-bold"
                          style={{
                            transform: 'rotate(45deg) translateX(30%) translateY(100%)',
                            transformOrigin: 'top left',
                            zIndex: 2,
                            width: '200px',
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            background: 'linear-gradient(90deg, #f9d423, #ff4e50)',
                            boxShadow: '0 2px 15px rgba(0,0,0,0.3)',
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 700
                          }}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          PREMIUM SELECTION
                        </motion.div>
                      )}
                      
                      <div 
                        className="position-relative" 
                        style={{ 
                          height: '280px', 
                          overflow: 'hidden',
                          background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '25px 25px 0 0'
                        }}
                      >
                        <motion.img
                          src={product.img}
                          alt={product.name}
                          className="img-fluid"
                          style={{
                            maxHeight: '85%',
                            maxWidth: '85%',
                            objectFit: 'contain',
                            transition: 'transform 0.5s ease',
                            zIndex: 2,
                            filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.2))'
                          }}
                          whileHover={{ 
                            scale: 1.1
                          }}
                        />
                        
                        <motion.div
                          className="position-absolute"
                          style={{
                            width: '100%',
                            height: '100%',
                            background: `radial-gradient(circle, ${categories.find(c => c.name === product.category)?.color || '#6C5CE7'}30 0%, transparent 70%)`,
                            zIndex: 1
                          }}
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            backgroundPosition: ['0% 0%', '100% 100%']
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>

                      <div className="card-body d-flex flex-column p-4 position-relative z-index-2">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="card-title fw-bold mb-0" style={{ 
                            fontSize: '1.2rem',
                            minHeight: '60px',
                            fontFamily: "'Montserrat', sans-serif"
                          }}>
                            {product.name}
                          </h5>
                          <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span 
                              className="badge rounded-pill px-3 py-2 d-flex align-items-center"
                              style={{
                                background: 'rgba(0, 64, 128, 0.1)',
                                color: categories.find(c => c.name === product.category)?.color || '#6C5CE7',
                                fontSize: '0.9rem',
                                border: `1px solid ${categories.find(c => c.name === product.category)?.color || '#6C5CE7'}`,
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                fontFamily: "'Montserrat', sans-serif"
                              }}
                            >
                              <FiStar className="me-1" /> {product.rating}
                            </span>
                          </motion.div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <motion.p 
                            className="fw-bold mb-0" 
                            style={{ 
                              color: categories.find(c => c.name === product.category)?.color || '#00CEC9',
                              fontSize: '1.5rem',
                              fontFamily: "'Montserrat', sans-serif"
                            }}
                            whileHover={{ scale: 1.03 }}
                          >
                            {product.formattedPrice}
                          </motion.p>
                          
                          <motion.button
                            id={`add-to-cart-${product.id}`}
                            className="btn position-relative overflow-hidden py-2 px-4 d-flex align-items-center"
                            style={{
                              background: `linear-gradient(135deg, ${categories.find(c => c.name === product.category)?.color || '#6C5CE7'}, ${categories.find(c => c.name === product.category)?.color || '#4A3FCF'})`,
                              color: '#FFFFFF',
                              borderRadius: '15px',
                              fontSize: '1rem',
                              fontWeight: '600',
                              boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
                              border: 'none',
                              fontFamily: "'Montserrat', sans-serif"
                            }}
                            onClick={() => handleAddToCart(product)}
                            whileHover={{
                              background: `linear-gradient(135deg, ${categories.find(c => c.name === product.category)?.color || '#4A3FCF'}, ${categories.find(c => c.name === product.category)?.color || '#6C5CE7'})`,
                              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                            }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isAdding}
                          >
                            <FiShoppingCart className="me-2" /> Añadir
                            <motion.span 
                              className="position-absolute top-0 start-0 w-100 h-100"
                              style={{
                                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                                transform: 'translateX(-100%)'
                              }}
                              animate={{
                                transform: ['translateX(-100%)', 'translateX(100%)']
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1
                              }}
                            />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {productsData.totalPages > 1 && (
              <motion.div 
                className="d-flex justify-content-center mt-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, type: "spring" }}
              >
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <motion.button
                        className="page-link rounded-start-pill px-4 py-2 d-flex align-items-center"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        whileHover={{ 
                          scale: 1.1,
                          backgroundColor: 'rgba(0, 64, 128, 0.1)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        disabled={currentPage === 1}
                        style={{
                          minWidth: '50px',
                          height: '50px',
                          fontFamily: "'Montserrat', sans-serif"
                        }}
                      >
                        <FiChevronLeft />
                      </motion.button>
                    </li>
                    
                    {Array.from({ length: Math.min(5, productsData.totalPages) }, (_, i) => {
                      let pageNum;
                      if (productsData.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= productsData.totalPages - 2) {
                        pageNum = productsData.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <motion.button
                            className="page-link px-4 py-2"
                            onClick={() => setCurrentPage(pageNum)}
                            whileHover={{ 
                              scale: currentPage === pageNum ? 1 : 1.1,
                              backgroundColor: currentPage === pageNum ? '#6C5CE7' : 'rgba(0, 64, 128, 0.1)'
                            }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              backgroundColor: currentPage === pageNum ? '#6C5CE7' : 'transparent',
                              color: currentPage === pageNum ? 'white' : '#6C5CE7',
                              border: `1px solid ${currentPage === pageNum ? '#6C5CE7' : '#dee2e6'}`,
                              minWidth: '50px',
                              height: '50px',
                              fontWeight: currentPage === pageNum ? 'bold' : 'normal',
                              fontFamily: "'Montserrat', sans-serif"
                            }}
                          >
                            {pageNum}
                          </motion.button>
                        </li>
                      );
                    })}
                    
                    <li className={`page-item ${currentPage === productsData.totalPages ? 'disabled' : ''}`}>
                      <motion.button
                        className="page-link rounded-end-pill px-4 py-2 d-flex align-items-center"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, productsData.totalPages))}
                        whileHover={{ 
                          scale: 1.1,
                          backgroundColor: 'rgba(0, 64, 128, 0.1)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        disabled={currentPage === productsData.totalPages}
                        style={{
                          minWidth: '50px',
                          height: '50px',
                          fontFamily: "'Montserrat', sans-serif"
                        }}
                      >
                        <FiChevronRight />
                      </motion.button>
                    </li>
                  </ul>
                </nav>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ProductsPage;