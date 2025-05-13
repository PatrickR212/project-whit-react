"use client";
import Link from 'next/link';
import React from 'react';
import styles from "@/styles/Navbar.module.css";
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

import "bootstrap-icons/font/bootstrap-icons.css";

export default function Navbar() {
  const { cartItems } = useCart();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <nav className={styles.navbar}>Cargando...</nav>;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href='/' className={styles.logoLink}>
          <img src="/assets/images/logo.png" alt="Logo" className={styles.logoImage} />
          <span className={styles.logoText}>Mi Tienda</span>
        </Link>
      </div>

      <div className={styles.navLinks}>
        <Link href='/'>Inicio</Link>
        <Link href='/products'>Productos</Link>
        {/* <Link href='/users'>Usuarios</Link> */}
        <Link href='/contact'>Contactos</Link>
        {/* <Link href='/pqrs'>PQRS</Link> */}
        {/* <Link href='/pasarelas' className={styles.pasarelaLink}>
          <i className="bi bi-credit-card"></i> Pasarelas
        </Link> */}
      </div>

      <div className={styles.authSection}>
        <div className={styles.cartContainer}>
          <Link href='/cart' className={styles.cartLink}>
            <i className="bi bi-cart-fill"></i>
            {cartItems.length > 0 && (
              <span className={styles.cartBadge}>{cartItems.length}</span>
            )}
          </Link>
        </div>

        {user ? (
          <>
            <Link href='/auth/profile' className={styles.profileLink}>
              <i className="bi bi-person-circle"></i> Perfil
            </Link>
            <button onClick={logout} className={styles.logoutButton}>
              <i className="bi bi-box-arrow-right"></i> Salir
            </button>
          </>
        ) : (
          <>
            <Link href='/auth/login' className={styles.authLink}>
              <i className="bi bi-box-arrow-in-right"></i> Ingresar
            </Link>
            <Link href='/auth/register' className={styles.authLink}>
              <i className="bi bi-person-plus"></i> Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}