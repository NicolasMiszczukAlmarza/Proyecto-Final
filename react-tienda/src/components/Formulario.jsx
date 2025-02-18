import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Formulario = () => {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });
      } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlert({ message: '⚠️ Las contraseñas no coinciden', type: 'danger' });
      return;
    }

    const dataToSend = { ...formData, password_confirmation: formData.confirmPassword };

    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/register', dataToSend, { withCredentials: true });
      setAlert({ message: '✅ Usuario registrado con éxito', type: 'success' });
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setAlert({ message: '⚠️ Hubo un error al registrar el usuario, puede que el correo este en uso.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-75 shadow-lg p-4 bg-white rounded">

        {/* TÍTULO CENTRADO */}
        <div className="col-12 text-center mb-4">
          <h2 className="fw-bold" style={{
            fontSize: '2.5rem',
            color: '#333',
            letterSpacing: '1px',
            borderBottom: '3px solid #007BFF',
            paddingBottom: '10px',
            boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)'
          }}>
            Formulario de Registro
          </h2>
        </div>

        {/* Columna de la imagen */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img src="/img/logo/logo.JPG" alt="Logo" className="img-fluid rounded shadow" style={{ maxWidth: '80%' }} />
        </div>

        {/* Columna del formulario */}
        <div className="col-md-6">
          {alert.message && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre:</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Apellido:</label>
              <input
                type="text"
                name="last_name"
                className="form-control"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección:</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Correo Electrónico:</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña:</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar Contraseña:</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Formulario;
