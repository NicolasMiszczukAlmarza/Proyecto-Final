import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelUsuario.css';

const PanelUsuario = () => {
  const [seleccion, setSeleccion] = useState('Perfil');
  const navigate = useNavigate();

  const renderContenido = () => {
    switch (seleccion) {
      case 'Perfil':
        return <p className="fs-4">Aquí puedes editar tu perfil e información personal.</p>;
      case 'Pedidos':
        return <p className="fs-4">Aquí puedes ver tus pedidos y su estado.</p>;
      case 'Contraseña':
        return <p className="fs-4">Aquí puedes cambiar tu contraseña de acceso.</p>;
      default:
        return <p className="fs-4">Selecciona una opción del menú.</p>;
    }
  };

  const opciones = [
    'Perfil',
    'Pedidos',
    'Contraseña',
    'Ir al carrito',
    'Cerrar sesión'
  ];

  const handleClick = (item) => {
    if (item === 'Ir al carrito') {
      navigate('/carrito');
    } else if (item === 'Cerrar sesión') {
      // Aquí podrías limpiar el token y luego navegar
      navigate('/login');
    } else {
      setSeleccion(item);
    }
  };

  return (
    <div className="panel-container">
      {/* Menú lateral */}
      <div className="panel-sidebar">
        <h4>Opciones del Menu</h4>
        <div className="d-flex flex-column gap-3">
          {opciones.map((item) => (
            <button
              key={item}
              className={`btn ${
                seleccion === item ? 'btn-active' : 'btn-outline-light'
              } text-start`}
              onClick={() => handleClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido derecho */}
      <div className="panel-content">
        <h1 className="display-6 mb-4">Panel del Usuario</h1>
        <div className="contenido-box">
          {renderContenido()}
        </div>
      </div>
    </div>
  );
};

export default PanelUsuario;
