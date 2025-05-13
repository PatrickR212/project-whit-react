"use client";
import React from "react";
import "@/styles/Navbar.module.css";
import Navbar from "./components/navbar";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext'; // <-- ✅ Importa el AuthProvider

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body>
        <AuthProvider> {/* <-- ✅ Envuélvelo aquí */}
          <CartProvider>
            <header>
              <Navbar />
            </header>
            <main className="mainContent">{children}</main>
            <footer>
              <p>© 2025 - Todos los derechos reservados a Patrick</p>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
