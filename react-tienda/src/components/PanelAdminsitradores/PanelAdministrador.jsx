import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelAdministrador.css';

const PanelAdministrador = () => {
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [seleccion, setSeleccion] = useState('Convertir a Admin');
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (!storedUser) return navigate('/login');

    const user = JSON.parse(storedUser);
    if (user.roles !== 'admin') return navigate('/');
    setUsuario(user);
  }, [navigate]);

  useEffect(() => {
    fetch('http://localhost:8000/usuarios', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const filtrados = Array.isArray(data)
          ? data.filter(u => u.email !== 'nicoadmin@admin.com')
          : [];
        setUsuarios(filtrados);
      })
      .catch(() => setUsuarios([]));
  }, [seleccion]);

  const toggleRol = async (email, rolActual) => {
    const endpoint = rolActual === 'admin' ? 'quitar-admin' : 'convertir-admin';

    await fetch(`http://localhost:8000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email })
    });

    setUsuarios(prev =>
      prev.map(u =>
        u.email === email
          ? { ...u, roles: rolActual === 'admin' ? 'normal' : 'admin' }
          : u
      )
    );
  };

  const renderUsuarios = (tipo) => {
    const usuariosFiltrados = usuarios.filter(
      u => u.roles === tipo && u.email !== usuario?.email
    );

    return (
      <div style={{ maxWidth: 800, margin: 'auto' }}>
        <h4 className="text-center mb-4">
          {tipo === 'admin'
            ? 'Admins (convertibles a normal)'
            : 'Usuarios normales (convertibles en admin)'}
        </h4>
        {usuariosFiltrados.length === 0 ? (
          <p className="text-center text-muted">No hay usuarios disponibles.</p>
        ) : (
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Email</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.name} {user.last_name}</td>
                  <td>{user.roles}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${user.roles === 'admin' ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => toggleRol(user.email, user.roles)}
                    >
                      {user.roles === 'admin' ? 'Convertir en normal' : 'Hacer admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const handleProductoChange = (e) => {
    const { name, value, files } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: name === 'imagen' ? files[0] : value
    }));
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(nuevoProducto).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    await fetch('http://localhost:8000/agregar-producto', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    alert('✅ Producto enviado correctamente');
    setNuevoProducto({ nombre: '', descripcion: '', precio: '', imagen: null });
  };

  const renderAgregarProducto = () => (
    <div className="container" style={{ maxWidth: 600 }}>
      <h4 className="text-center mb-4">Añadir Nuevo Producto</h4>
      <form onSubmit={handleAgregarProducto}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" name="nombre" value={nuevoProducto.nombre} onChange={handleProductoChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" name="descripcion" value={nuevoProducto.descripcion} onChange={handleProductoChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio (€)</label>
          <input type="number" className="form-control" name="precio" value={nuevoProducto.precio} onChange={handleProductoChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen</label>
          <input type="file" className="form-control" name="imagen" accept="image/*" onChange={handleProductoChange} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Agregar Producto</button>
      </form>
    </div>
  );

  const renderContenido = () => {
    switch (seleccion) {
      case 'Convertir a Admin': return renderUsuarios('normal');
      case 'Convertir a Normal': return renderUsuarios('admin');
      case 'Añadir producto': return renderAgregarProducto();
      case 'Borrar producto': return <h4 className="text-center">Listado para borrar productos (pendiente)</h4>;
      case 'Renovar producto': return <h4 className="text-center">Formulario para renovar productos (pendiente)</h4>;
      case 'Finanzas': return <h4 className="text-center">Resumen financiero (pendiente)</h4>;
      default: return <p className="text-center">Selecciona una opción del panel.</p>;
    }
  };

  const opciones = [
    'Convertir a Admin',
    'Convertir a Normal',
    'Añadir producto',
    'Borrar producto',
    'Renovar producto',
    'Finanzas',
    'Cerrar sesión'
  ];

  const handleClick = (opcion) => {
    if (opcion === 'Cerrar sesión') {
      localStorage.removeItem('usuario');
      navigate('/login');
    } else {
      setSeleccion(opcion);
    }
  };

  return (
    <div className="panel-container">
      <div className="panel-sidebar">
        <h4>Panel Admin</h4>
        <div className="d-flex flex-column gap-2">
          {opciones.map(item => (
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
      <div className="panel-content p-4">
        <div className="admin-header mb-4">
          <h2 className="m-0">Panel del Administrador</h2>
        </div>
        {renderContenido()}
      </div>
    </div>
  );
};

export default PanelAdministrador;
