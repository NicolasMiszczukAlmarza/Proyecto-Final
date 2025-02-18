import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  // Estados para el formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();  // Inicializamos useNavigate para navegar entre rutas

  // Manejador para el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
    navigate('/carrito'); // Redirige al carrito después del login
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-75 shadow-lg p-4 bg-white rounded">
        {/* Columna de la imagen - Mover a la izquierda */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          {/* Cambia la ruta de la imagen a una URL estática desde la carpeta public */}
          <img src="/img/logo/logo.JPG" alt="Logo" className="img-fluid rounded shadow" style={{ maxWidth: '80%' }} />
        </div>

        {/* Columna del formulario - Mover a la derecha */}
        <div className="col-md-6">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold" style={{ color: '#000' }}>
              Iniciar Sesión
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Usuario</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
          </form>

          <div className="text-center mt-3">
            <p>¿No tienes cuenta? <Link to="/registro">¡Créala aquí!</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
