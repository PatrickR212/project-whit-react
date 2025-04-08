"use client";

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

const products = [
    { id: 1, name: 'Ron Bacardi Limón', price: '$60,000', category: 'Ron', img: '/assets/images/bacardi.png' },
    { id: 2, name: 'Tequila Patrón', price: '$300,000', category: 'Tequila', img: '/assets/images/Patron.png' },
    { id: 3, name: 'Absolute Vodka', price: '$70,000', category: 'Vodka', img: '/assets/images/absolute.png' },
    { id: 4, name: 'Whisky Johnnie Walker Blue Label', price: '$1,100,000', category: 'Whisky', img: '/assets/images/Blue.png' },
    { id: 5, name: 'Tequila Don Julio', price: '$370,000', category: 'Tequila', img: '/assets/images/Julio.png' },
    { id: 6, name: 'Whisky Buchanans Special', price: '$350,000', category: 'Whisky', img: '/assets/images/Buchanan.png' },
    { id: 7, name: 'Ron Medellín', price: '$90,000', category: 'Ron', img: '/assets/images/Medellin.png' },
    { id: 8, name: 'Vodka Belvedere Pure', price: '$220,000', category: 'Vodka', img: '/assets/images/Beldevere.png' },
    { id: 9, name: 'Whisky Old Parr', price: '$220,000', category: 'Whisky', img: '/assets/images/Old.png' },
    { id: 10, name: 'Vodka Smirnoff Lulo', price: '$42,000', category: 'Vodka', img: '/assets/images/Smirnoff.png' },
    { id: 11, name: 'Tequila Gran Centenario', price: '$170,000', category: 'Tequila', img: '/assets/images/Centenario.png' },
    { id: 12, name: 'Ron Caldas', price: '$150,000', category: 'Ron', img: '/assets/images/Caldas.png' }
];

const categories = [
    { name: 'Vodka', img: '/assets/images/absolute.png' },
    { name: 'Ron', img: '/assets/images/Medellin.png' },
    { name: 'Tequila', img: '/assets/images/Julio.png' },
    { name: 'Whisky', img: '/assets/images/Buchanan.png' }
];

const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [cart, setCart] = useState([]);
    const { addToCart } = useCart(); // Añade esta línea

    const handleAddToCart = (product) => {
        setCart([...cart, product]);
        addToCart(product); // Esta línea es la que actualiza el contador
    };

    const filteredProducts = selectedCategory
        ? products.filter((p) => p.category === selectedCategory)
        : products;

    return (
        <div className="container py-4" style={{ backgroundColor: '#FFFFFF' }}>
            
            <Carousel 
    interval={3000}
    controls={false}
    indicators={true}
    pause={false}
    className="my-4"
    style={{ maxWidth: '85%', margin: '0 auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
>
    {['/assets/images/ban1.jpg', '/assets/images/bann2.jpg', '/assets/images/ban3.jpg'].map((src, index) => (
        <Carousel.Item key={index}>
            <motion.div
                className="position-relative"
                initial={{ opacity: 0, scale: 0.8, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                style={{ overflow: 'hidden', borderRadius: '15px' }}
            >
                <motion.img
                    className="d-block w-100"
                    src={src}
                    alt={`Banner ${index + 1}`}
                    style={{ objectFit: 'contain', maxHeight: '500px', width: '100%', filter: 'brightness(90%)' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
                
                <motion.div
                    className="position-absolute top-50 start-50 translate-middle text-center text-white"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ textShadow: '2px 2px 10px rgba(0, 0, 0, 0.8)' }}
                />
            </motion.div>
        </Carousel.Item>
    ))}
</Carousel>

<motion.section
    className="my-5 p-5 rounded shadow text-white position-relative overflow-hidden"
    style={{
        backgroundColor: '#004080',
        borderRadius: '20px',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
        padding: '3rem',
    }}
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1, ease: 'easeOut' }}
    whileHover={{ scale: 1.05 }}
>
    <h2
        className="display-4 text-center mb-4"
        style={{ position: 'relative', zIndex: 2, textShadow: '0px 4px 10px rgba(255,255,255,0.5)' }}
    >
        Bienvenidos a LaLicorera
    </h2>

    <p
        className="text-center"
        style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}
    >
        En LaLicorera, nos apasiona ofrecer una experiencia de compra excepcional, donde la calidad de nuestros productos
        y la satisfacción de nuestros clientes son nuestra máxima prioridad. Descubre nuestra amplia selección de
        bebidas premium, cuidadosamente seleccionadas para brindarte momentos inolvidables. Ya sea que estés
        buscando un regalo especial o simplemente quieras disfrutar de una buena bebida en compañía de amigos y
        familiares, estamos aquí para ayudarte. Explora nuestras categorías, encuentra tus productos favoritos y
        permite que te sorprendamos con promociones exclusivas y un servicio al cliente incomparable.
    </p>

    {/* Partículas brillantes animadas */}
    {[...Array(15)].map((_, index) => (
        <motion.div
            key={index}
            className="position-absolute rounded-circle"
            style={{
                width: '15px',
                height: '15px',
                background: 'radial-gradient(circle, white 0%, rgba(255, 255, 255, 0) 70%)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: 'blur(3px)',
                zIndex: 1,
            }}
            animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [1, 0.5, 1],
                scale: [1, 1.5, 1],
            }}
            transition={{
                duration: Math.random() * 4 + 2,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    ))}

    {/* Efecto de resplandor dinámico */}
    <motion.div
        className="position-absolute"
        style={{
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(0, 64, 128, 0) 80%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(60px)',
            zIndex: 0,
        }}
        animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 0.6, 0.8],
        }}
        transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
    />
</motion.section>

<h2 className="h2 mb-4 text-dark">Productos Destacados</h2>
<div className="row">
    {products.slice(0, 12).map((product) => (
        <motion.div
            key={product.id}
            className="col-md-3 mb-4"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: 'spring', stiffness: 150, damping: 10 }}
        >
            <motion.div
                className="card h-100 shadow border-0 position-relative overflow-hidden"
                style={{
                    backgroundColor: '#FFFFFF',
                    color: '#004080',
                    borderRadius: '20px',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
                    translateY: '-5px',
                }}
            >
                <div
                    className="position-relative"
                    style={{
                        overflow: 'hidden',
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                    }}
                >
                    <motion.img
                        src={product.img}
                        className="card-img-top"
                        alt={product.name}
                        style={{
                            objectFit: 'contain',
                            maxHeight: '250px',
                            width: '100%',
                            transition: 'transform 0.5s',
                        }}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <div className="card-body d-flex flex-column p-4 position-relative">
                    <h5 className="card-title mb-2">{product.name}</h5>
                    <p
                        className="card-text mb-3"
                        style={{
                            fontWeight: 'bold',
                            color: '#009688',
                            fontSize: '1.2rem',
                        }}
                    >
                        {product.price}
                    </p>
                    <motion.button
                        className="btn w-100 mt-auto position-relative overflow-hidden"
                        style={{
                            backgroundColor: '#004080',
                            color: '#FFFFFF',
                            borderRadius: '15px',
                            padding: '10px 15px',
                            fontSize: '1rem',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                        }}
                        onClick={() => handleAddToCart(product)}
                        whileHover={{
                            backgroundColor: '#002C60',
                            scale: 1.1,
                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Añadir al carrito 🛒
                        <motion.div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                background: 'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                                opacity: 0.6,
                                transform: 'translateX(-100%)',
                                pointerEvents: 'none',
                            }}
                            animate={{
                                translateX: ['-100%', '100%'],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: 'loop',
                                ease: 'linear',
                            }}
                        />
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    ))}
</div>


            <div className="my-4 text-center">
            <h2 className="h2 mb-3 text-dark">Categorías</h2>
<div className="d-flex justify-content-center flex-wrap">
    {categories.map((category) => (
        <motion.div
            key={category.name}
            className="card m-3 position-relative overflow-hidden"
            style={{
                width: '200px',
                height: '150px',
                borderRadius: '20px',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                backgroundColor: '#004080',
                color: '#FFFFFF',
                overflow: 'hidden',
            }}
            whileHover={{
                scale: 1.05,
                rotate: [0, 2, -2, 0],
                transition: { duration: 0.6, ease: 'easeInOut' },
            }}
            onClick={() => setSelectedCategory(category.name)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <motion.img
                src={category.img}
                alt={category.name}
                className="w-100 h-100"
                style={{ 
                    objectFit: 'cover',
                    filter: 'brightness(60%)',
                    transition: 'transform 0.5s',
                }}
                whileHover={{ scale: 1.2, filter: 'brightness(80%)' }}
            />
            <motion.div
                className="position-absolute top-50 start-50 translate-middle text-center"
                style={{
                    zIndex: 2,
                    color: 'white',
                    textShadow: '2px 2px 10px rgba(0, 0, 0, 0.8)',
                }}
                initial={{ opacity: 0, y: 50 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <motion.h4
                    className="fw-bold mb-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1.2 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ transition: 'color 0.3s', color: '#FFD700' }}
                >
                    {category.name}
                </motion.h4>
                <motion.button
                    className="btn btn-light fw-bold position-relative overflow-hidden"
                    style={{
                        borderRadius: '30px',
                        padding: '10px 20px',
                        fontSize: '1rem',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    }}
                    whileHover={{
                        scale: 1.1,
                        backgroundColor: '#004080',
                        color: '#FFFFFF',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    Comprar
                    <motion.div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 10%, rgba(255,255,255,0) 60%)',
                            opacity: 0.6,
                            pointerEvents: 'none',
                            borderRadius: '30px',
                        }}
                        animate={{
                            translateX: ['-150%', '150%'],
                            translateY: ['-150%', '150%'],
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: 'loop',
                            ease: 'linear',
                        }}
                    />
                </motion.button>
            </motion.div>

            <motion.div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                    zIndex: 1,
                }}
            />

            {/* Efecto de partículas brillantes alrededor de la carta */}
            <motion.div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    zIndex: 3,
                    pointerEvents: 'none',
                }}
                animate={{
                    boxShadow: [
                        '0 0 5px rgba(255,255,255,0.2)',
                        '0 0 15px rgba(255,255,255,0.4)',
                        '0 0 5px rgba(255,255,255,0.2)',
                    ],
                    filter: ['blur(2px)', 'blur(0px)', 'blur(2px)'],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                }}
            />
        </motion.div>
    ))}
</div>
{selectedCategory && (
    <div className="mt-5">
        <h3 className="h3 text-dark">Productos de {selectedCategory}</h3>
        <div className="row">
            {filteredProducts.map((product) => (
                <motion.div
                    key={product.id}
                    className="col-md-3 mb-4"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 10 }}
                >
                    <motion.div
                        className="card h-100 shadow border-0 position-relative overflow-hidden"
                        style={{
                            backgroundColor: '#FFFFFF',
                            color: '#004080',
                            borderRadius: '20px',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                        }}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
                            translateY: '-5px',
                        }}
                    >
                        <div
                            className="position-relative"
                            style={{
                                overflow: 'hidden',
                                borderTopLeftRadius: '20px',
                                borderTopRightRadius: '20px',
                            }}
                        >
                            <motion.img
                                src={product.img}
                                className="card-img-top"
                                alt={product.name}
                                style={{
                                    objectFit: 'contain',
                                    maxHeight: '250px',
                                    width: '100%',
                                    transition: 'transform 0.5s',
                                }}
                                whileHover={{ scale: 1.1, rotate: 2 }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        <div className="card-body d-flex flex-column p-4 position-relative">
                            <h5 className="card-title mb-2">{product.name}</h5>
                            <p
                                className="card-text mb-3"
                                style={{
                                    fontWeight: 'bold',
                                    color: '#009688',
                                    fontSize: '1.2rem',
                                }}
                            >
                                {product.price}
                            </p>
                            <motion.button
                                className="btn w-100 mt-auto position-relative overflow-hidden"
                                style={{
                                    backgroundColor: '#004080',
                                    color: '#FFFFFF',
                                    borderRadius: '15px',
                                    padding: '10px 15px',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                    position: 'relative',
                                }}
                                onClick={() => handleAddToCart(product)}  
                                whileHover={{
                                    backgroundColor: '#002C60',
                                    scale: 1.1,
                                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Añadir al carrito
                                <motion.div
                                    className="position-absolute top-0 start-0 w-100 h-100"
                                    style={{
                                        background: 'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                                        opacity: 0.6,
                                        transform: 'translateX(-100%)',
                                        pointerEvents: 'none',
                                    }}
                                    animate={{
                                        translateX: ['-100%', '100%'],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: 'loop',
                                        ease: 'linear',
                                    }}
                                />
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            ))}
        </div>
    </div>
)}

</div>

            <footer className="bg-dark text-white py-5 mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h5>Acerca de nosotros</h5>
                            <p>Conoce más sobre nuestra historia y misión.</p>
                            <p><a href="#" className="text-white">Blog</a></p>
                        </div>
                        <div className="col-md-4">
                            <h5>Datos de contacto</h5>
                            <p><FaMapMarkerAlt className="me-2" /> Cra. 47 # 104 - 45</p>
                            <p><FaPhone className="me-2" /> 300 203 5430</p>
                            <p><FaEnvelope className="me-2" /> contacto@lalicorera.com</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <h5>Síguenos</h5>
                            <div className="d-flex justify-content-center mt-3">
                                <a href="#" className="text-white mx-2"><FaFacebook size={30} /></a>
                                <a href="#" className="text-white mx-2"><FaInstagram size={30} /></a>
                                <a href="#" className="text-white mx-2"><FaYoutube size={30} /></a>
                                <a href="#" className="text-white mx-2"><FaTwitter size={30} /></a>
                                <a href="#" className="text-white mx-2"><FaLinkedin size={30} /></a>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <p className="mb-0">© {new Date().getFullYear()} LaLicorera. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;