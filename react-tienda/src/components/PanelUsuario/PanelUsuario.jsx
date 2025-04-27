import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelUsuario.css';

const PanelUsuario = () => {
  const [seleccion, setSeleccion] = useState('Perfil');
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({ name: '', last_name: '', address: '' });
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const navigate = useNavigate();

  // Carga el usuario al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsuario(user);
      setFormData({
        name: user.name,
        last_name: user.last_name,
        address: user.address || '',
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleClick = (opcion) => {
    if (opcion === 'Ir al carrito') return navigate('/carrito');
    if (opcion === 'Cerrar sesión') {
      localStorage.removeItem('usuario');
      navigate('/login');
    } else {
      setSeleccion(opcion);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagenChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleActualizar = async () => {
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      });

      const xsrfToken = decodeURIComponent(
        document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1] || ''
      );

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('address', formData.address);
      if (imagen) formDataToSend.append('profile_image', imagen);

      const response = await fetch('http://localhost:8000/actualizar-usuario', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': xsrfToken
        },
        body: formDataToSend,
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (response.status === 401) {
        setMensaje({ texto: '⚠️ Tu sesión ha expirado. Por favor inicia sesión nuevamente.', tipo: 'danger' });
        localStorage.removeItem('usuario');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorMsg = isJson ? (await response.json()).message : 'Error desconocido';
        setMensaje({ texto: `❌ Error al actualizar: ${errorMsg}`, tipo: 'danger' });
        return;
      }

      const data = isJson ? await response.json() : {};
      const updatedUser = { ...usuario, ...formData };
      if (data.profile_image) updatedUser.profile_image = data.profile_image;

      localStorage.setItem('usuario', JSON.stringify(updatedUser));
      setUsuario(updatedUser);
      setMensaje({ texto: '✅ Datos actualizados correctamente.', tipo: 'success' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (err) {
      setMensaje({ texto: '❌ Error al conectar con el servidor.', tipo: 'danger' });
    }
  };

  // --- NUEVO: formulario de recuperación de contraseña ---
  const handleEnviarRecuperacion = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      });

      const xsrfToken = decodeURIComponent(
        document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1] || ''
      );

      const response = await fetch('http://localhost:8000/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfToken,
        },
        body: JSON.stringify({ email: usuario?.email }),
      });

      const data = await response.json();

      setMensaje({
        texto: data.message || 'Intenta nuevamente.',
        tipo: response.ok ? 'success' : 'danger',
      });

      // LOGOUT automático solo si fue exitoso, después de 5 segundos
      if (response.ok) {
        setTimeout(async () => {
          localStorage.removeItem('usuario');
          try {
            await fetch('http://localhost:8000/logout', {
              method: 'POST',
              credentials: 'include'
            });
          } catch (err) { /* Ignorar error de logout */ }
          navigate('/login');
        }, 5000); // <-- Espera 5 segundos antes del logout
      } else {
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
      }
    } catch (err) {
      setMensaje({ texto: '❌ Error al conectar con el servidor.', tipo: 'danger' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    }
  };

  const renderPerfil = () => (
    <div className="w-100" style={{ maxWidth: '500px' }}>
      <div className="mb-3 text-center">
        <img
          src={
            usuario?.profile_image
              ? `http://localhost:8000/${usuario.profile_image}`
              : '/img/usuario/principal.png'
          }
          alt="Perfil"
          style={{ width: '120px', borderRadius: '50%' }}
          onError={e => { e.target.src = '/img/usuario/principal.png'; }}
        />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Nombre</label>
        <input className="form-control text-center" value={usuario?.name || ''} readOnly />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Apellidos</label>
        <input className="form-control text-center" value={usuario?.last_name || ''} readOnly />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Dirección</label>
        <input className="form-control text-center" value={usuario?.address || 'No especificada'} readOnly />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Correo electrónico</label>
        <input className="form-control text-center" value={usuario?.email || ''} readOnly />
      </div>
    </div>
  );

  const renderModificarDatos = () => (
    <div className="w-100" style={{ maxWidth: '500px' }}>
      <div className="mb-3">
        <label className="form-label fw-bold">Foto de perfil</label>
        <input type="file" className="form-control" accept="image/*" onChange={handleImagenChange} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Nombre</label>
        <input className="form-control text-center" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Apellidos</label>
        <input className="form-control text-center" name="last_name" value={formData.last_name} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Dirección</label>
        <input className="form-control text-center" name="address" value={formData.address} onChange={handleChange} />
      </div>
      <button className="btn btn-primary w-100" onClick={handleActualizar}>
        Guardar cambios
      </button>
    </div>
  );

  // --- NUEVO: render para la pestaña Contraseña
  const renderContraseña = () => (
    <div className="w-100" style={{ maxWidth: '400px' }}>
      <form onSubmit={handleEnviarRecuperacion}>
        <div className="mb-3">
          <label className="form-label fw-bold">Correo electrónico</label>
          <input
            className="form-control text-center"
            value={usuario?.email || ''}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-warning w-100">
          Enviar correo de recuperación
        </button>
        <div className="mt-3 small text-muted text-center">
          Te enviaremos un enlace a tu correo para cambiar la contraseña.
        </div>
      </form>
    </div>
  );

  const renderContenido = () => {
    switch (seleccion) {
      case 'Perfil': return renderPerfil();
      case 'Modificar Datos': return renderModificarDatos();
      case 'Pedidos': return <p>Aquí puedes ver tus pedidos.</p>;
      case 'Contraseña': return renderContraseña();
      default: return <p>Selecciona una opción del menú.</p>;
    }
  };

  const opciones = ['Perfil', 'Modificar Datos', 'Pedidos', 'Contraseña', 'Ir al carrito', 'Cerrar sesión'];

  return (
    <div className="panel-container">
      <div className="panel-sidebar">
        <h4>Opciones del Menú</h4>
        <div className="d-flex flex-column gap-3">
          {opciones.map((item) => (
            <button
              key={item}
              className={`btn ${seleccion === item ? 'btn-active' : 'btn-outline-light'} text-start`}
              onClick={() => handleClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="panel-content d-flex justify-content-center align-items-start pt-4">
        <div className="w-100">
          <h1 className="display-6 text-center mb-4">Panel del Usuario</h1>
          {/* ALERT BONITO */}
          {mensaje.texto && (
            <div
              className={`alert alert-${mensaje.tipo} text-center`}
              style={{
                maxWidth: 500,
                margin: '0 auto 1.5rem auto',
                fontSize: '1.1rem',
                fontWeight: 500,
                borderRadius: '1rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                letterSpacing: '0.5px'
              }}
            >
              {mensaje.texto}
            </div>
          )}
          <div className="contenido-box d-flex justify-content-center">
            {renderContenido()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelUsuario;
