import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  // Estados para el formulario y el mensaje de error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Manejador para el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulario enviado');

    // Limpiar mensaje de error antes de intentar nuevamente
    setErrorMessage('');

    try {
      // 1️⃣ Obtener el token CSRF antes de hacer login
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });

      // 2️⃣ Enviar la solicitud de login
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      console.log('Respuesta del servidor:', response);

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);

        // Guardamos el correo en localStorage y redirigimos
        localStorage.setItem('userEmail', email);
        navigate('/carrito');
      } else {
        // Si la respuesta no es exitosa, mostrar mensaje de error
        setErrorMessage('Usuario no registrado y/o contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setErrorMessage('Hubo un problema con el servidor');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-75 shadow-lg p-4 bg-white rounded">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img src="/img/logo/logo.JPG" alt="Logo" className="img-fluid rounded shadow" style={{ maxWidth: '80%' }} />
        </div>
        <div className="col-md-6">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold" style={{ color: '#000' }}>Iniciar Sesión</h2>
          </div>

          {/* 🔴 Mostrar mensaje de error en rojo si existe */}
          {errorMessage && (
            <div className="alert alert-danger text-center fw-bold" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
