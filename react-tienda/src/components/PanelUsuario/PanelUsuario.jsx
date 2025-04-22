import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelUsuario.css';

const PanelUsuario = () => {
  const [seleccion, setSeleccion] = useState('Perfil');
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({ name: '', last_name: '', address: '' });
  const [imagen, setImagen] = useState(null);
  const navigate = useNavigate();

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
      if (imagen) formDataToSend.append('img', imagen);

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
        alert('⚠️ Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        localStorage.removeItem('usuario');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorMsg = isJson ? (await response.json()).message : 'Error desconocido';
        alert(`❌ Error al actualizar: ${errorMsg}`);
        return;
      }

      const data = isJson ? await response.json() : {};
      const updatedUser = { ...usuario, ...formData };
      if (data.img) updatedUser.img = data.img;

      localStorage.setItem('usuario', JSON.stringify(updatedUser));
      setUsuario(updatedUser);
      alert('✅ Datos actualizados correctamente.');
    } catch (err) {
      console.error('Error actualizando:', err);
      alert('❌ Error al conectar con el servidor.');
    }
  };

  const renderPerfil = () => (
    <div className="w-100" style={{ maxWidth: '500px' }}>
      <div className="mb-3 text-center">
        {usuario?.img && (
          <img
            src={`http://localhost:8000/${usuario.img}`}
            alt="Perfil"
            style={{ width: '120px', borderRadius: '50%' }}
          />
        )}
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

  const renderContenido = () => {
    switch (seleccion) {
      case 'Perfil': return renderPerfil();
      case 'Modificar Datos': return renderModificarDatos();
      case 'Pedidos': return <p>Aquí puedes ver tus pedidos.</p>;
      case 'Contraseña': return <p>Aquí puedes cambiar tu contraseña.</p>;
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
            <button key={item} className={`btn ${seleccion === item ? 'btn-active' : 'btn-outline-light'} text-start`} onClick={() => handleClick(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-content d-flex justify-content-center align-items-start pt-4">
        <div className="w-100">
          <h1 className="display-6 text-center mb-4">Panel del Usuario</h1>
          <div className="contenido-box d-flex justify-content-center">
            {renderContenido()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelUsuario;
