import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Importa el componente Link
import './Login.css';  // Importamos el archivo de estilos (si lo usas)

const Login = () => {
  // Estados para el formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Manejador para el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí agregarías la lógica para autenticar al usuario
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        <div className="input-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="login-btn">Iniciar Sesión</button>
      </form>
      {/* Enlace para redirigir a la página de registro */}
      <div className="register-link">
        <p>¿No tienes cuenta? <Link to="/registro">¡Créala aquí!</Link></p>
      </div>
    </div>
  );
};

export default Login;
