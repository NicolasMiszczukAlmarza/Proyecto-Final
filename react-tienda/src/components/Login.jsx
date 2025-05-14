import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // 1️⃣ Obtener token CSRF
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });

      // 2️⃣ Enviar solicitud de inicio de sesión
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setErrorMessage('Usuario no registrado y/o contraseña incorrecta');
        return;
      }

      const data = await response.json();
      const user = data.user;

      localStorage.setItem('usuario', JSON.stringify(user));

      // 🔀 Redirigir según el rol del usuario
      if (user.roles === 'admin') {
        navigate('/panel-administrador');
      } else {
        navigate('/carrito');
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage('Hubo un problema con el servidor');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-75 shadow-lg p-4 bg-white rounded">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img
            src="/img/logo/logo.PNG"
            alt="Logo"
            className="img-fluid rounded shadow"
            style={{ maxWidth: '80%', cursor: 'pointer' }}
            onClick={() => navigate("/")}
            onError={(e) => {
              e.target.src = "/img/logo/nico.PNG";
            }}
          />

        </div>
        <div className="col-md-6">
          <h2 className="text-center fw-bold mb-4">Iniciar Sesión</h2>

          {errorMessage && (
            <div className="alert alert-danger text-center fw-bold">
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
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: '#6f42c1', // Bootstrap's `$purple`
                color: '#fff',
                border: 'none'
              }}
            >
              <span className="w-100 text-center d-block">Iniciar Sesión</span>
            </button>


          </form>

          <div className="text-center mt-3">
            <p>¿No tienes cuenta? <Link to="/registro">¡Créala aquí!</Link></p>
            <p>
              <Link to="/forgot-password" className="text-decoration-underline" style={{ color: '#007bff' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
