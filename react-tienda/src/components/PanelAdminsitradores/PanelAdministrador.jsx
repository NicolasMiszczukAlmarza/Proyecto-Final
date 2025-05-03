import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelAdministrador.css';

const PanelAdministrador = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [seleccion, setSeleccion] = useState('Añadir producto');
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '', img: null
  });

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
      .then(data => setUsuarios(data.filter(u => u.email !== 'nicoadmin@admin.com')))
      .catch(() => setUsuarios([]));
  }, [seleccion]);

  useEffect(() => {
    fetch('http://localhost:8000/categorias', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]));
  }, []);

  const toggleRol = async (email, rolActual) => {
    const endpoint = rolActual === 'admin' ? 'quitar-admin' : 'convertir-admin';
    await fetch(`http://localhost:8000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email })
    });

    setUsuarios(prev =>
      prev.map(u => u.email === email ? { ...u, roles: rolActual === 'admin' ? 'normal' : 'admin' } : u)
    );
  };

  const handleProductoChange = (e) => {
    const { name, value, files } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: name === 'img' ? files[0] : value
    }));
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const productoConStock = { ...nuevoProducto, stock: nuevoProducto.stock || 50 };
    Object.entries(productoConStock).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const res = await fetch('http://localhost:8000/agregar-producto', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (!res.ok) throw new Error();
      alert('✅ Producto agregado correctamente');
      setNuevoProducto({ nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '', img: null });
    } catch {
      alert('❌ Error al guardar el producto');
    }
  };

  const renderUsuarios = (tipo) => (
    <div className="container" style={{ maxWidth: 800 }}>
      <h5 className="text-center mb-3">{tipo === 'admin' ? 'Administradores' : 'Usuarios normales'}</h5>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr><th>Email</th><th>Nombre</th><th>Rol</th><th>Acción</th></tr>
        </thead>
        <tbody>
          {usuarios.filter(u => u.roles === tipo).map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name} {user.last_name}</td>
              <td>{user.roles}</td>
              <td>
                <button className={`btn btn-sm ${user.roles === 'admin' ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => toggleRol(user.email, user.roles)}>
                  {user.roles === 'admin' ? 'Convertir a normal' : 'Hacer admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAgregarProducto = () => (
    <div className="container" style={{ maxWidth: 600 }}>
      <h4 className="text-center mb-4">Añadir Nuevo Producto</h4>
      <form onSubmit={handleAgregarProducto}>
        <input type="text" className="form-control mb-3" name="nombre" value={nuevoProducto.nombre} onChange={handleProductoChange} placeholder="Nombre" required />
        <textarea className="form-control mb-3" name="descripcion" value={nuevoProducto.descripcion} onChange={handleProductoChange} placeholder="Descripción" required />
        <input type="number" className="form-control mb-3" name="precio" value={nuevoProducto.precio} onChange={handleProductoChange} placeholder="Precio €" required />
        <input type="number" className="form-control mb-3" name="stock" value={nuevoProducto.stock} onChange={handleProductoChange} placeholder="Stock (por defecto 50)" />

        <select className="form-select mb-3" name="id_categoria" value={nuevoProducto.id_categoria} onChange={handleProductoChange} required>
          <option value="">Seleccione una categoría</option>
          {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
        </select>

        <input type="file" className="form-control mb-3" name="img" accept="image/*" onChange={handleProductoChange} />

        <button type="submit" className="btn btn-primary w-100">Agregar Producto</button>
      </form>
    </div>
  );

  const renderContenido = () => {
    switch (seleccion) {
      case 'Convertir a Admin': return renderUsuarios('normal');
      case 'Convertir a Normal': return renderUsuarios('admin');
      case 'Añadir producto': return renderAgregarProducto();
      case 'Editar producto': return <h5 className="text-center">Editar producto (pendiente)</h5>;
      case 'Eliminar producto': return <h5 className="text-center">Eliminar producto (pendiente)</h5>;
      case 'Renovar stock': return <h5 className="text-center">Renovar stock (pendiente)</h5>;
      case 'Eliminar cuenta': return <h5 className="text-center">Eliminar cuenta (pendiente)</h5>;
      default: return <p className="text-center">Selecciona una opción.</p>;
    }
  };

  const opciones = [
    'Convertir a Admin',
    'Convertir a Normal',
    'Añadir producto',
    'Editar producto',
    'Eliminar producto',
    'Renovar stock',
    'Eliminar cuenta',
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
    <div className="panel-container d-flex">
      <div className="panel-sidebar p-3 bg-dark text-white" style={{ minWidth: 220 }}>
        <h5 className="mb-4">Panel Admin</h5>
        {opciones.map(item => (
          <button key={item} className={`btn w-100 mb-2 ${seleccion === item ? 'btn-light text-dark' : 'btn-outline-light'}`} onClick={() => handleClick(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="panel-content p-4 flex-grow-1">
        <h3 className="mb-4">Gestión Administrativa</h3>
        {renderContenido()}
      </div>
    </div>
  );
};

export default PanelAdministrador;