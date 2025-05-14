import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: '',
    password_confirmation: ''
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  const token = params.get('token');
  const email = params.get('email');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    if (!form.password || !form.password_confirmation) {
      setMensaje({ texto: 'Completa todos los campos.', tipo: 'danger' });
      setLoading(false);
      return;
    }
    if (form.password.length < 8) {
      setMensaje({ texto: 'La contraseña debe tener al menos 8 caracteres.', tipo: 'danger' });
      setLoading(false);
      return;
    }
    if (form.password !== form.password_confirmation) {
      setMensaje({ texto: 'Las contraseñas no coinciden.', tipo: 'danger' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password: form.password,
          password_confirmation: form.password_confirmation
        })
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje({ texto: '✅ Contraseña cambiada correctamente. Redirigiendo...', tipo: 'success' });

        // Cerrar sesión local y backend (si había sesión)
        localStorage.removeItem('usuario');
        try {
          await fetch('http://localhost:8000/logout', {
            method: 'POST',
            credentials: 'include'
          });
        } catch (err) {
          // Ignorar error de logout (puede no estar logueado)
        }

        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setMensaje({ texto: data.message || 'Error al cambiar la contraseña.', tipo: 'danger' });
      }
    } catch (error) {
      setMensaje({ texto: 'Error de conexión con el servidor.', tipo: 'danger' });
    }
    setLoading(false);
  };

  if (!token || !email) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="row w-75 shadow-lg p-4 bg-white rounded">
          <div className="col-12 text-center">
            <div className="alert alert-danger p-4 rounded">
              El enlace no es válido o ha expirado.
            </div>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>
              Ir al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-75 shadow-lg p-4 bg-white rounded">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img src="public/img/logo/logo.png" alt="Logo" className="img-fluid rounded shadow" style={{ maxWidth: '80%' }} />
        </div>
        <div className="col-md-6">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold" style={{ color: '#000' }}>Restablecer Contraseña</h2>
          </div>
          {mensaje.texto && (
            <div className={`alert alert-${mensaje.tipo} text-center`} role="alert">
              {mensaje.texto}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Nueva contraseña</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                required
                placeholder="Escribe tu nueva contraseña"
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Confirmar contraseña</label>
              <input
                type="password"
                className="form-control"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                minLength={8}
                required
                placeholder="Repite tu nueva contraseña"
              />
            </div>
            <button
              type="submit"
              className="btn w-100"
              disabled={loading}
              style={{
                backgroundColor: '#6f42c1',   // Morado estilo Bootstrap
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                padding: '0.6rem',
                fontWeight: '500',
                fontSize: '1.1rem',
                transition: 'background-color 0.3s ease',
                textAlign: 'center',
                display: 'block'
              }}
            >
              <span className="w-100 d-block text-center">
                {loading ? 'Cambiando...' : 'Cambiar contraseña'}
              </span>
            </button>

          </form>
          <div className="text-center mt-3">
            <button
              className="btn btn-link"
              onClick={() => navigate('/login')}
              style={{ textDecoration: 'underline', fontSize: '1rem' }}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
