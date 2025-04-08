// components/Navbar.js
"use client";
import Link from 'next/link';
import React from 'react';
import styles from "@/styles/Navbar.module.css";
import { useCart } from '@/context/CartContext';
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Navbar() {
  const { cartItems } = useCart();

  return (
    <nav className={styles.navbar}>
      <ul>
        <li><Link href='/'>Inicio</Link></li>
        <li><Link href='/products'>Productos</Link></li>
        <li><Link href='/users'>Usuarios</Link></li>
        <li><Link href='/contact'>Contactos</Link></li>
        <li><Link href='/pqrs'>PQRS</Link></li>

        <li className={styles.cartContainer}>
          <Link href='/cart' className={styles.cartLink}>
            <i className="bi bi-cart-fill"></i>
            {cartItems.length > 0 && (
              <span className={styles.cartBadge}>{cartItems.length}</span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}