import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    setLoading(true);

    if (!email) {
      setMensaje({ texto: 'Por favor ingresa tu correo electrónico.', tipo: 'danger' });
      setLoading(false);
      return;
    }

    try {
      // 1. CSRF token
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });

      // 2. Enviar petición de recuperación
      const res = await fetch('http://localhost:8000/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ texto: data.message || 'Revisa tu correo para el enlace de recuperación.', tipo: 'success' });
        setTimeout(() => navigate('/login'), 5000); // Redirige después de 5 seg
      } else {
        setMensaje({ texto: data.message || 'No se pudo enviar el correo.', tipo: 'danger' });
      }
    } catch (err) {
      setMensaje({ texto: 'Error al conectar con el servidor.', tipo: 'danger' });
    }

    setLoading(false);
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-75 shadow-lg p-4 bg-white rounded">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
        <img
    src="/img/logo/logo.PNG"
    alt="Logo"
    className="img-fluid rounded shadow"
    style={{
      maxWidth: '90%',
      maxHeight: '300px',
      objectFit: 'contain',
      cursor: 'pointer'
    }}
    onClick={() => navigate("/")}
    onError={(e) => {
      e.target.src = "/img/logo/nico.PNG";
    }}
  />
        </div>
        <div className="col-md-6">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold">Recuperar Contraseña</h2>
          </div>
          {mensaje.texto && (
            <div className={`alert alert-${mensaje.tipo} text-center`} role="alert">
              {mensaje.texto}
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
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="ejemplo@correo.com"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
          <div className="text-center mt-3">
            <Link to="/login" className="btn btn-link" style={{ textDecoration: 'underline', fontSize: '1rem' }}>
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
