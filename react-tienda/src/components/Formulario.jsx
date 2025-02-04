import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Formulario.css';

const Formulario = () => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [csrfError, setCsrfError] = useState(null); // Estado para manejar errores del token CSRF

  // Configuración del token CSRF
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
          withCredentials: true,  // Asegúrate de incluir las credenciales (cookies)
        });

        // Configurar el encabezado CSRF para futuras solicitudes
        const csrfToken = response.data;
        axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;

        console.log('CSRF Token obtenido correctamente');
      } catch (error) {
        console.error('Error al obtener el token CSRF', error);
        setCsrfError('⚠️ No se pudo obtener el token CSRF. Verifica la configuración de CORS.');
        alert('⚠️ No se pudo obtener el token CSRF. Verifica la configuración de CORS.');
      }
    };

    fetchCsrfToken();
  }, []);  // Solo ejecutar una vez al montar el componente

  // Manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      alert('⚠️ Las contraseñas no coinciden');
      return;
    }

    // Verificar si hay error en CSRF antes de proceder
    if (csrfError) {
      alert('⚠️ No se puede registrar sin un token CSRF válido.');
      return;
    }

    // Crear el objeto de datos con la confirmación de contraseña
    const formDataWithConfirmation = {
      ...formData,
      password_confirmation: formData.confirmPassword, // Laravel espera este campo
    };

    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/register', formDataWithConfirmation, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Necesario para enviar cookies
      });

      console.log('Formulario enviado exitosamente:', response.data);
      alert(`Usuario registrado: ${response.data.name}`);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('⚠️ Hubo un error al registrar el usuario.');
    } finally {
      setLoading(false);
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
          <label htmlFor="lastName">Apellidos:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
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
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      {/* Mostrar un mensaje de error si no se puede obtener el token CSRF */}
      {csrfError && <div className="error-message">{csrfError}</div>}
    </div>
  );
};

export default Formulario;
