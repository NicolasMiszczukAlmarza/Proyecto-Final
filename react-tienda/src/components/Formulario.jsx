import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redireccionar
import 'bootstrap/dist/css/bootstrap.min.css';  // Asegúrate de que Bootstrap esté importado

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
  const [csrfError, setCsrfError] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' }); // Para manejar alertas
  const navigate = useNavigate(); // Hook de redirección

  // Obtener el token CSRF cuando se cargue el componente
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Solicita el token CSRF
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
          withCredentials: true,
        });

        // Configura el token CSRF en los encabezados de axios
        axios.defaults.headers.common['X-XSRF-TOKEN'] = document.cookie
          .split(';')
          .find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))?.split('=')[1];
      } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
        setCsrfError('Error al obtener el token CSRF');
      }
    };

    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificación de que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setAlert({ message: '⚠️ Las contraseñas no coinciden', type: 'danger' });
      return;
    }

    // Verificación de que el token CSRF esté disponible
    if (csrfError) {
      setAlert({ message: '⚠️ No se puede registrar sin un token CSRF válido.', type: 'danger' });
      return;
    }

    const formDataWithConfirmation = {
      ...formData,
      password_confirmation: formData.confirmPassword,  // Laravel necesita este campo
    };

    setLoading(true);  // Activamos el estado de carga

    try {
      const response = await axios.post('http://127.0.0.1:8000/register', formDataWithConfirmation, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,  // Necesario para enviar las cookies de sesión
      });

      setAlert({ message: `Usuario registrado con éxito: ${response.data.user.name}`, type: 'success' });
      setTimeout(() => {
        navigate('/');  // Redirige al login después de 2 segundos
      }, 2000);

      console.log('Formulario enviado exitosamente:', response.data);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      const errorMessage = error.response?.data?.message || '⚠️ Hubo un error al registrar el usuario.';
      setAlert({ message: errorMessage, type: 'danger' });
    } finally {
      setLoading(false);  // Desactivamos el estado de carga
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: 'white', minHeight: '100vh' }}> {/* Cambié el fondo gris a blanco */}
      {/* Mostrar alerta si existe */}
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      <div className="formulario-container mx-auto" style={{ maxWidth: '600px', backgroundColor: 'white' }}>
        <h2>Formulario de Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">Apellidos:</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-control"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Dirección:</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Repetir Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Formulario;
