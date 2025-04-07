import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import './Pago.css';

const Pago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalFinal, carrito } = location.state;

  const [titular, setTitular] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaCaducidad, setFechaCaducidad] = useState('');
  const [cvv, setCvv] = useState('');

  // Obtener el correo del almacenamiento local
  const correo = localStorage.getItem('userEmail');

  // Validación del correo
  if (!correo) {
    toast.error('No se encontró el correo del usuario. Inicie sesión nuevamente.', {
      position: 'top-center',
      autoClose: 3000,
      theme: 'colored',
    });
    navigate('/login');
    return null;
  }

  // Calcular el precio total teniendo en cuenta el descuento
  const calcularPrecioTotal = () => {
    const subtotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    const descuento = subtotal >= 1500 ? subtotal * 0.10 : 0;
    return subtotal - descuento;
  };

  const precioTotal = calcularPrecioTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titular || !numeroTarjeta || !fechaCaducidad || !cvv) {
      toast.error('Por favor, complete todos los datos de la tarjeta.', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored',
      });
      return;
    }

    try {
      const csrfResponse = await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });
      if (!csrfResponse.ok) {
        throw new Error('No se pudo obtener el token CSRF');
      }

      const pedidoData = {
        correo,
        carrito,
        total: precioTotal,  // Enviamos el precio total calculado
      };

      const response = await fetch('http://localhost:8000/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(pedidoData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Pedido realizado con éxito', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        });
        setTimeout(() => {
          navigate('/factura', { state: { correo, carrito, total: precioTotal } });
        }, 3500);
      } else {
        toast.error(`Error al registrar el pedido: ${result.message || 'Error desconocido'}`, {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        });
      }
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      toast.error('Error al conectar con el servidor', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored',
      });
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
          <input type="text" id="monto" value={`${precioTotal.toFixed(2)}€`} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="titular">Titular de la tarjeta:</label>
          <input type="text" id="titular" value={titular} onChange={(e) => setTitular(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="tarjeta">Número de tarjeta:</label>
          <input type="text" id="tarjeta" value={numeroTarjeta} onChange={(e) => setNumeroTarjeta(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="fecha">Fecha de caducidad:</label>
          <input type="month" id="fecha" value={fechaCaducidad} onChange={(e) => setFechaCaducidad(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">Número secreto (CVV):</label>
          <input type="text" id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
        </div>
        <button type="submit" className="btn-submit">Realizar Pedido</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Pago;
