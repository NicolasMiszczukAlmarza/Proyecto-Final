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
    const data = localStorage.getItem('usuario');
    if (data) {
      const user = JSON.parse(data);
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

  const handleClick = (item) => {
    if (item === 'Ir al carrito') {
      navigate('/carrito');
    } else if (item === 'Cerrar sesión') {
      localStorage.removeItem('usuario');
      navigate('/login');
    } else {
      setSeleccion(item);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  };

  const handleActualizar = async () => {
    try {
      const response = await fetch("http://localhost:8000/actualizar-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = { ...usuario, ...formData };
        localStorage.setItem("usuario", JSON.stringify(updatedUser));
        setUsuario(updatedUser);
        alert("Datos actualizados correctamente.");
      } else {
        alert("Error al actualizar.");
      }
    } catch (error) {
      console.error("Error actualizando datos:", error);
      alert("Hubo un problema al actualizar los datos.");
    }
  };

  const renderPerfil = () => {
    if (!usuario) return <p className="text-center">Cargando datos del usuario...</p>;

    return (
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="mb-3">
          <label className="form-label fw-bold">Nombre</label>
          <input className="form-control text-center" value={usuario.name} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Apellidos</label>
          <input className="form-control text-center" value={usuario.last_name} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Dirección</label>
          <input className="form-control text-center" value={usuario.address || 'No especificada'} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Correo electrónico</label>
          <input className="form-control text-center" value={usuario.email} readOnly />
        </div>
      </div>
    );
  };

  const renderModificarDatos = () => (
    <div className="w-100" style={{ maxWidth: '500px' }}>
      <div className="mb-3">
        <label className="form-label fw-bold">Foto de perfil</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleImagenChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Nombre</label>
        <input
          className="form-control text-center"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Apellidos</label>
        <input
          className="form-control text-center"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Dirección</label>
        <input
          className="form-control text-center"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
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
      case 'Pedidos': return <p className="fs-4">Aquí puedes ver tus pedidos y su estado.</p>;
      case 'Contraseña': return <p className="fs-4">Aquí puedes cambiar tu contraseña de acceso.</p>;
      default: return <p className="fs-4">Selecciona una opción del menú.</p>;
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
          <div className="contenido-box d-flex justify-content-center">
            {renderContenido()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelUsuario;
