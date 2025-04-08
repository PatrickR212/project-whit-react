"use client"; 

import React, { useState } from 'react';
import '@/styles/contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formulario enviado');
  };

  return (
    <div className="contact-container">
      <h2 className="contact-title">Contáctanos</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div>
          <label htmlFor="name" className="contact-label">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="contact-input"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="contact-label">Correo:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="contact-input"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="contact-label">Mensaje:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="contact-textarea"
            required
          />
        </div>
        <button type="submit" className="contact-button">
          Enviar
        </button>
      </form>
    </div>
  );
}
