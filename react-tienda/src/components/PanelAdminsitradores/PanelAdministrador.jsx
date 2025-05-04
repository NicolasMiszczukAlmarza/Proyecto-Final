import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelAdministrador.css';

const PanelAdministrador = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [seleccion, setSeleccion] = useState('Añadir producto');
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '', img: null });
  const [productoEditando, setProductoEditando] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [recargarProductos, setRecargarProductos] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (!storedUser) return navigate('/login');
    const user = JSON.parse(storedUser);
    if (user.roles !== 'admin') return navigate('/');
    setUsuario(user);
  }, [navigate]);

  useEffect(() => {
    if (['Convertir a Admin', 'Convertir a Normal'].includes(seleccion)) {
      fetch('http://localhost:8000/usuarios', { credentials: 'include' })
        .then(res => res.json())
        .then(setUsuarios)
        .catch(() => setUsuarios([]));
    }

    if (['Editar producto', 'Renovar Stock'].includes(seleccion)) {
      fetch('http://localhost:8000/productos', { credentials: 'include' })
        .then(res => res.json())
        .then(setProductos)
        .catch(() => setProductos([]));
    }
  }, [seleccion, recargarProductos]);

  useEffect(() => {
    fetch('http://localhost:8000/categorias', { credentials: 'include' })
      .then(res => res.json())
      .then(setCategorias)
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
    setUsuarios(prev => prev.map(u => u.email === email ? { ...u, roles: rolActual === 'admin' ? 'normal' : 'admin' } : u));
  };

  const handleProductoChange = (e, setFunc) => {
    const { name, value, files } = e.target;
    setFunc(prev => ({ ...prev, [name]: name === 'img' ? files[0] : value }));
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const producto = { ...nuevoProducto, stock: nuevoProducto.stock || 50 };
    Object.entries(producto).forEach(([k, v]) => v && formData.append(k, v));

    try {
      const res = await fetch('http://localhost:8000/agregar-producto', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (!res.ok) throw new Error();
      setMensaje({ tipo: 'success', texto: 'Producto agregado exitosamente' });
      setNuevoProducto({ nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '', img: null });
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al agregar producto' });
    }
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(productoEditando).forEach(([k, v]) => {
      if (v !== null && v !== undefined && (k !== 'img' || v instanceof File)) {
        formData.append(k, v);
      }
    });

    try {
      const res = await fetch(`http://localhost:8000/editar-producto/${productoEditando.id}`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (!res.ok) throw new Error();
      setMensaje({ tipo: 'success', texto: 'Producto actualizado correctamente' });
      setProductoEditando(null);
      setRecargarProductos(prev => !prev);
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al actualizar producto' });
    }
  };

  const confirmarEliminacion = (id) => {
    setProductoAEliminar(id);
    setModalVisible(true);
  };

  const handleEliminarProducto = async () => {
    try {
      const res = await fetch(`http://localhost:8000/eliminar-producto/${productoAEliminar}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error();
      setMensaje({ tipo: 'success', texto: 'Producto eliminado correctamente' });
      setRecargarProductos(prev => !prev);
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar producto' });
    } finally {
      setModalVisible(false);
      setProductoAEliminar(null);
    }
  };

  const renovarStockProducto = async (producto) => {
    try {
      // Paso 1: Obtener cookie CSRF
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
  
      // Paso 2: Leer el token XSRF desde cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
  
      const token = getCookie('XSRF-TOKEN');
  
      // Paso 3: Enviar la petición con el token
      const res = await fetch('http://localhost:8000/renovar-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(token),
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: producto.id,
          cantidad: 10,
          order_id: null
        })
      });
  
      if (!res.ok) throw new Error();
  
      setMensaje({
        tipo: 'success',
        texto: `Stock de "${producto.nombre}" incrementado en 10 unidades.`
      });
      setRecargarProductos(prev => !prev);
    } catch {
      setMensaje({
        tipo: 'error',
        texto: 'Error al renovar stock'
      });
    }
  };
  

  const renderUsuarios = (tipo) => (
    <div className="container">
      <h5>{tipo === 'admin' ? 'Administradores' : 'Usuarios normales'}</h5>
      <table className="table">
        <thead><tr><th>Email</th><th>Nombre</th><th>Rol</th><th>Acción</th></tr></thead>
        <tbody>
          {usuarios.filter(u => u.roles === tipo).map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name} {user.last_name}</td>
              <td>{user.roles}</td>
              <td>
                <button className={`btn btn-sm ${user.roles === 'admin' ? 'btn-warning' : 'btn-success'}`} onClick={() => toggleRol(user.email, user.roles)}>
                  {user.roles === 'admin' ? 'Convertir a normal' : 'Hacer admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderRenovarStock = () => {
    const productosBajos = productos.filter(p => p.stock < 10);
    return (
      <div className="container">
        <h4>Renovar Stock (menos de 10 unidades)</h4>
        {productosBajos.length === 0 ? (
          <p className="text-muted">No hay productos con stock bajo.</p>
        ) : (
          <ul className="list-group">
            {productosBajos.map(p => (
              <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{p.nombre} — Stock actual: {p.stock}</span>
                <button className="btn btn-sm btn-warning" onClick={() => renovarStockProducto(p)}>+10 unidades</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderContenido = () => {
    if (seleccion === 'Convertir a Admin') return renderUsuarios('normal');
    if (seleccion === 'Convertir a Normal') return renderUsuarios('admin');
    if (seleccion === 'Añadir producto') return renderAgregarProducto();
    if (seleccion === 'Editar producto') return renderEditarProducto();
    if (seleccion === 'Renovar Stock') return renderRenovarStock();
    return <p>Seleccione una opción</p>;
  };

  const renderAgregarProducto = () => (
    <div className="container">
      <h4>Añadir Nuevo Producto</h4>
      <form onSubmit={handleAgregarProducto} className="card p-4 shadow">
        <input type="text" name="nombre" value={nuevoProducto.nombre} onChange={e => handleProductoChange(e, setNuevoProducto)} placeholder="Nombre" required className="form-control mb-2" />
        <textarea name="descripcion" value={nuevoProducto.descripcion} onChange={e => handleProductoChange(e, setNuevoProducto)} placeholder="Descripción" required className="form-control mb-2" />
        <input type="number" name="precio" value={nuevoProducto.precio} onChange={e => handleProductoChange(e, setNuevoProducto)} placeholder="Precio (€)" required className="form-control mb-2" />
        <input type="number" name="stock" value={nuevoProducto.stock} onChange={e => handleProductoChange(e, setNuevoProducto)} placeholder="Stock (default 50)" className="form-control mb-2" />
        <select name="id_categoria" value={nuevoProducto.id_categoria} onChange={e => handleProductoChange(e, setNuevoProducto)} required className="form-select mb-2">
          <option value="">Seleccione una categoría</option>
          {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
        </select>
        <input type="file" name="img" accept="image/*" onChange={e => handleProductoChange(e, setNuevoProducto)} className="form-control mb-3" />
        <button type="submit" className="btn btn-primary">Agregar</button>
      </form>
    </div>
  );

  const renderEditarProducto = () => {
    const filtrados = categoriaFiltro ? productos.filter(p => p.id_categoria === parseInt(categoriaFiltro)) : productos;
    return (
      <div className="container">
        <h4>Editar Producto</h4>
        <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)} className="form-select mb-3">
          <option value="">Todas las categorías</option>
          {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
        </select>
        {!productoEditando ? (
          <ul className="list-group">
            {filtrados.map(p => (
              <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                {p.nombre}
                <div className="btn-group">
                  <button className="btn btn-sm btn-info" onClick={() => setProductoEditando(p)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => confirmarEliminacion(p.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card p-4 shadow-sm">
            <form onSubmit={handleGuardarEdicion}>
              <input type="text" name="nombre" value={productoEditando.nombre} onChange={e => handleProductoChange(e, setProductoEditando)} required className="form-control mb-2" />
              <textarea name="descripcion" value={productoEditando.descripcion} onChange={e => handleProductoChange(e, setProductoEditando)} required className="form-control mb-2" />
              <input type="number" name="precio" value={productoEditando.precio} onChange={e => handleProductoChange(e, setProductoEditando)} required className="form-control mb-2" />
              <input type="number" name="stock" value={productoEditando.stock} onChange={e => handleProductoChange(e, setProductoEditando)} required className="form-control mb-2" />
              <select name="id_categoria" value={productoEditando.id_categoria} onChange={e => handleProductoChange(e, setProductoEditando)} required className="form-select mb-2">
                <option value="">Seleccione una categoría</option>
                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
              </select>
              <input type="file" name="img" accept="image/*" onChange={e => handleProductoChange(e, setProductoEditando)} className="form-control mb-3" />
              <button type="submit" className="btn btn-success w-100">Guardar</button>
              <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => setProductoEditando(null)}>Cancelar</button>
            </form>
          </div>
        )}

        {modalVisible && (
          <div className="modal-backdrop">
            <div className="modal-confirm">
              <p className="mb-3">¿Estás seguro de que quieres eliminar este producto?</p>
              <div className="d-flex justify-content-between">
                <button className="btn btn-danger" onClick={handleEliminarProducto}>Sí, eliminar</button>
                <button className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="panel-container d-flex">
      <div className="panel-sidebar">
        <h5>Panel Admin</h5>
        {['Convertir a Admin', 'Convertir a Normal', 'Añadir producto', 'Editar producto', 'Renovar Stock', 'Cerrar sesión'].map(op => (
          <button key={op} className={`btn ${seleccion === op ? 'btn-active' : 'btn-outline-light'} mb-2`} onClick={() => {
            if (op === 'Cerrar sesión') {
              localStorage.removeItem('usuario');
              navigate('/login');
            } else {
              setSeleccion(op);
            }
          }}>{op}</button>
        ))}
      </div>
      <div className="panel-content">
        <h3 className="admin-header">Gestión Administrativa</h3>
        {mensaje && (
          <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show mt-3`} role="alert">
            {mensaje.texto}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
          </div>
        )}
        {renderContenido()}
      </div>
    </div>
  );
};

export default PanelAdministrador;