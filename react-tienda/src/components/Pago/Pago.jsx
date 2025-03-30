import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import './Pago.css';

const Pago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Se espera que location.state contenga totalFinal y carrito
  const { totalFinal, carrito } = location.state;
  
  // Estados para los datos del formulario de pago
  const [titular, setTitular] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaCaducidad, setFechaCaducidad] = useState('');
  const [cvv, setCvv] = useState('');

  // Recupera el correo del usuario (guardado al iniciar sesión)
  const correo = localStorage.getItem('userEmail');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aquí podrías validar los datos de la tarjeta si lo deseas
    if (!titular || !numeroTarjeta || !fechaCaducidad || !cvv) {
      alert('Por favor, complete todos los datos de la tarjeta.');
      return;
    }

    // 1. Obtener el token CSRF
    try {
      const csrfResponse = await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include'
      });
      if (!csrfResponse.ok) {
        throw new Error('No se pudo obtener el token CSRF');
      }
    } catch (error) {
      console.error('Error al obtener CSRF token:', error);
      alert('Error al conectar con el servidor (CSRF)');
      return;
    }

    // 2. Preparar los datos del pedido
    const pedidoData = {
      correo,
      carrito, // Cada producto debe tener { id, cantidad, precio }
      total: totalFinal
    };

    // 3. Enviar la petición POST a /pedidos
    try {
      const response = await fetch('http://localhost:8000/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(pedidoData)
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate('/');
      } else {
        alert('Error al registrar el pedido: ' + (result.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="pago-container">
      <h1>Pasarela de Pago</h1>
      <div className="card-icons">
        <FaCcVisa size={40} title="Visa" />
        <FaCcMastercard size={40} title="MasterCard" />
        <FaCcAmex size={40} title="American Express" />
        <FaCcDiscover size={40} title="Discover" />
      </div>
      <form className="pago-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="monto">Cantidad a pagar:</label>
          <input
            type="text"
            id="monto"
            value={`${totalFinal.toFixed(2)}€`}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="titular">Titular de la tarjeta:</label>
          <input
            type="text"
            id="titular"
            value={titular}
            onChange={(e) => setTitular(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tarjeta">Número de tarjeta:</label>
          <input
            type="text"
            id="tarjeta"
            value={numeroTarjeta}
            onChange={(e) => setNumeroTarjeta(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fecha">Fecha de caducidad:</label>
          <input
            type="month"
            id="fecha"
            value={fechaCaducidad}
            onChange={(e) => setFechaCaducidad(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">Número secreto (CVV):</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Realizar Pedido</button>
      </form>
    </div>
  );
};

export default Pago;
