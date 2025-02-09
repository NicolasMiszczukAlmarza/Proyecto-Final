import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Formulario.css';  // Asegúrate de tener estilos apropiados

const Formulario = () => {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',  // Cambié 'lastName' a 'last_name' aquí
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [csrfError, setCsrfError] = useState(null);

  // Obtener el token CSRF cuando se cargue el componente
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Solicita el token CSRF
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
          withCredentials: true, // Asegúrate de enviar las cookies de sesión
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
      alert('⚠️ Las contraseñas no coinciden');
      return;
    }

    // Verificación de que el token CSRF esté disponible
    if (csrfError) {
      alert('⚠️ No se puede registrar sin un token CSRF válido.');
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

      console.log('Formulario enviado exitosamente:', response.data);
      alert(`Usuario registrado: ${response.data.user.name}`);
      // Opcional: Redirigir al usuario a otra página después del registro
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      const errorMessage = error.response?.data?.message || '⚠️ Hubo un error al registrar el usuario.';
      alert(errorMessage);  // Mostrar mensaje de error
    } finally {
      setLoading(false);  // Desactivamos el estado de carga
    }
  };

  return (
    <div className="formulario-container">
      <h2>Formulario de Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Apellidos:</label> {/* Comentario removido correctamente */}
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Repetir Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      {csrfError && <div className="error-message">{csrfError}</div>}
    </div>
  );
};

export default Formulario;
