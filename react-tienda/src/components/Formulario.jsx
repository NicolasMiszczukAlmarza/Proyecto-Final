import React, { useState } from 'react';
import './Formulario.css';

const Formulario = () => {
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Manejador del formulario de registro
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de contraseñas
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
    } else {
      console.log('Formulario enviado');
      // Aquí puedes agregar la lógica para enviar los datos al backend o API
      console.log({ name, lastName, address, email, password });
    }
  };

  return (
    <div className="formulario-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="formulario-form">
        {/* Campo de Nombre */}
        <div className="input-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Campo de Apellidos */}
        <div className="input-group">
          <label htmlFor="lastName">Apellidos</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* Campo de Dirección */}
        <div className="input-group">
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Campo de Correo Electrónico */}
        <div className="input-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Campo de Repetir Contraseña */}
        <div className="input-group">
          <label htmlFor="confirmPassword">Repetir Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Botón de Enviar */}
        <button type="submit" className="submit-btn">Registrarse</button>
      </form>
    </div>
  );
};

export default Formulario;
