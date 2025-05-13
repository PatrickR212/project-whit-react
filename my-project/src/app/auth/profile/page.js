'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FiLogOut, FiHome, FiSettings, FiUser, FiEdit2, FiX, FiUpload } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const savedAvatar = sessionStorage.getItem('selectedAvatar');
    return savedAvatar ? parseInt(savedAvatar) : 0;
  });
  const [avatarImages, setAvatarImages] = useState(() => {
    const savedImages = sessionStorage.getItem('avatarImages');
    return savedImages
      ? JSON.parse(savedImages)
      : [
          '/assets/images/avatar1.png',
          '/assets/images/avatar2.png',
          '/assets/images/avatar3.png',
          '/assets/images/avatar4.png',
          '/assets/images/avatar5.png'
        ];
  });
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Save selected avatar to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('selectedAvatar', selectedAvatar.toString());
  }, [selectedAvatar]);

  // Save avatarImages to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('avatarImages', JSON.stringify(avatarImages));
  }, [avatarImages]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Debug showAvatarOptions state
  useEffect(() => {
    console.log('showAvatarOptions:', showAvatarOptions);
  }, [showAvatarOptions]);

  // Handle ESC key to close dropdown
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowAvatarOptions(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Clear sessionStorage on logout
  const handleLogout = () => {
    sessionStorage.removeItem('selectedAvatar');
    sessionStorage.removeItem('avatarImages');
    logout();
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = e.target.result;
        setAvatarImages((prev) => [...prev, newImage]);
        setSelectedAvatar(avatarImages.length);
        setShowAvatarOptions(false);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  };

  // Handle drag start
  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - dropdownPosition.x,
      y: e.clientY - dropdownPosition.y
    };
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      // Constrain to viewport
      const maxX = window.innerWidth - 250; // Dropdown width
      const maxY = window.innerHeight - 300; // Approximate dropdown height
      setDropdownPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add global mouseup and mousemove listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

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
        type: 'spring',
        stiffness: 120,
        damping: 12
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0" style={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 1
    }}>
      <div className="container py-5" style={{ overflow: 'visible' }}>
        <motion.div 
          className="row justify-content-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ overflow: 'visible' }}
        >
          <motion.div 
            className="col-lg-8"
            variants={container}
            initial="hidden"
            animate="show"
            style={{ overflow: 'visible' }}
          >
            <motion.div 
              className="card border-0 shadow-lg mb-5"
              style={{
                borderRadius: '25px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                overflow: 'visible',
                position: 'relative',
                zIndex: 2
              }}
              variants={item}
            >
              <div className="card-body p-5">
                <div className="row align-items-center">
                  {/* Sección del avatar interactivo */}
                  <motion.div 
                    className="col-md-4 text-center mb-4 mb-md-0 position-relative"
                    variants={item}
                    style={{ overflow: 'visible', zIndex: 3 }}
                  >
                    <motion.div
                      className="mx-auto d-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(108, 92, 231, 0.3)',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      whileHover={{ scale: 1.05 }}
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: 'mirror'
                      }}
                      onClick={() => {
                        console.log('Avatar clicked, toggling dropdown');
                        setShowAvatarOptions(!showAvatarOptions);
                        // Reset position to center when opening
                        setDropdownPosition({ x: window.innerWidth / 2 - 125, y: window.innerHeight / 2 - 150 });
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          console.log('Avatar key pressed, toggling dropdown');
                          setShowAvatarOptions(!showAvatarOptions);
                          // Reset position to center when opening
                          setDropdownPosition({ x: window.innerWidth / 2 - 125, y: window.innerHeight / 2 - 150 });
                        }
                      }}
                    >
                      <img 
                        src={avatarImages[selectedAvatar]} 
                        alt={`User avatar ${selectedAvatar + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      
                      {/* Icono de editar */}
                      <motion.div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(108, 92, 231, 0.7)',
                          opacity: 0,
                          color: 'white'
                        }}
                        whileHover={{ opacity: 1 }}
                      >
                        <FiEdit2 size={24} />
                      </motion.div>
                    </motion.div>

                    {/* Selector de avatares */}
                    {showAvatarOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-3 shadow-sm"
                        style={{
                          position: 'fixed',
                          left: `${dropdownPosition.x}px`,
                          top: `${dropdownPosition.y}px`,
                          width: '250px',
                          zIndex: 10000,
                          background: 'white',
                          borderRadius: '15px',
                          overflow: 'visible',
                          userSelect: 'none'
                        }}
                      >
                        <div
                          className="d-flex justify-content-between align-items-center mb-3"
                          style={{
                            cursor: isDragging ? 'grabbing' : 'grab',
                            padding: '5px 0'
                          }}
                          onMouseDown={handleDragStart}
                        >
                          <h6 className="m-0 text-center flex-grow-1">Selecciona tu avatar</h6>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => setShowAvatarOptions(false)}
                          >
                            <FiX size={20} />
                          </motion.button>
                        </div>
                        <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                          {avatarImages.map((img, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.05, 1]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: 'mirror'
                              }}
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: selectedAvatar === index ? '3px solid #6C5CE7' : '1px solid #dee2e6'
                              }}
                              onClick={() => {
                                console.log(`Selected avatar ${index}`);
                                setSelectedAvatar(index);
                                setShowAvatarOptions(false);
                              }}
                            >
                              <img 
                                src={img} 
                                alt={`User avatar option ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </motion.div>
                          ))}
                        </div>
                        {/* Botón para subir imagen */}
                        <div className="d-flex justify-content-center">
                          <motion.label
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              background: 'linear-gradient(90deg, #6C5CE7, #00CEC9)',
                              color: 'white',
                              borderRadius: '10px',
                              padding: '8px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              fontFamily: "'Montserrat', sans-serif",
                              fontWeight: '600'
                            }}
                            aria-label="Subir una imagen personalizada para el avatar"
                          >
                            <FiUpload className="me-2" /> Subir Imagen
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={handleImageUpload}
                            />
                          </motion.label>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Información del usuario */}
                  <motion.div 
                    className="col-md-8"
                    variants={item}
                  >
                    <motion.h2 
                      className="display-5 fw-bold mb-3"
                      style={{
                        background: 'linear-gradient(90deg, #6C5CE7, #00CEC9)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: "'Montserrat', sans-serif"
                      }}
                    >
                      Mi Perfil
                    </motion.h2>

                    <motion.div 
                      className="mb-4"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <p className="mb-2">
                        <strong className="me-2" style={{ color: '#6C5CE7' }}>Nombre:</strong>
                        <span>{user.name}</span>
                      </p>
                      <p className="mb-2">
                        <strong className="me-2" style={{ color: '#6C5CE7' }}>Email:</strong>
                        <span>{user.email}</span>
                      </p>
                      <p className="mb-0">
                        <strong className="me-2" style={{ color: '#6C5CE7' }}>Rol:</strong>
                        <span className="badge rounded-pill px-3 py-2" style={{ 
                          background: user.role === 'admin' 
                            ? 'linear-gradient(90deg, #FF4E50, #F9D423)' 
                            : 'linear-gradient(90deg, #00CEC9, #6C5CE7)',
                          color: 'white'
                        }} >
                          {user.role}
                        </span>
                      </p>
                    </motion.div>

                    {/* Botón de cerrar sesión */}
                    <motion.button
                      onClick={handleLogout}
                      className="btn d-flex align-items-center py-3 px-4"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 10px 20px rgba(255, 78, 80, 0.2)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: 'linear-gradient(90deg, #FF4E50, #F9D423)',
                        color: 'white',
                        borderRadius: '15px',
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: '600'
                      }}
                      variants={item}
                    >
                      <FiLogOut className="me-2" /> Cerrar Sesión
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Opciones de administrador */}
            {user.role === 'admin' && (
              <motion.div 
                className="card border-0 shadow-lg mb-5"
                style={{
                  borderRadius: '25px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  overflow: 'visible',
                  zIndex: 2
                }}
                variants={item}
              >
                <div className="card-body p-5">
                  <motion.h3 
                    className="fw-bold mb-4"
                    style={{
                      background: 'linear-gradient(90deg, #FF4E50, #F9D423)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: "'Montserrat', sans-serif"
                    }}
                  >
                    Opciones de Administrador
                  </motion.h3>
                  
                  <motion.div 
                    className="d-flex flex-wrap gap-3"
                    variants={container}
                  >
                    <motion.button
                      onClick={() => router.push('/admin')}
                      className="btn d-flex align-items-center py-3 px-4"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 10px 20px rgba(255, 78, 80, 0.2)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: 'linear-gradient(90deg, #FF4E50, #F9D423)',
                        color: 'white',
                        borderRadius: '15px',
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: '600'
                      }}
                      variants={item}
                    >
                      <FiSettings className="me-2" /> Panel de Administración
                    </motion.button>

                    <motion.button
                      onClick={() => router.push('/admin/users')}
                      className="btn d-flex align-items-center py-3 px-4"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 10px 20px rgba(108, 92, 231, 0.2)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: 'linear-gradient(90deg, #6C5CE7, #00CEC9)',
                        color: 'white',
                        borderRadius: '15px',
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: '600'
                      }}
                      variants={item}
                    >
                      <FiUser className="me-2" /> Gestionar Usuarios
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}