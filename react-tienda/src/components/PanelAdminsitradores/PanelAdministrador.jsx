/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelAdministrador.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PanelAdministrador = () => {
  const navigate = useNavigate();

  /* ----------------------------------------------------------------
   * ESTADOS PRINCIPALES
   * ---------------------------------------------------------------- */
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [seleccion, setSeleccion] = useState('Añadir producto');

  // Productos
  const nuevoProdInicial = { nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '', img: null };
  const [nuevoProducto, setNuevoProducto] = useState(nuevoProdInicial);
  const [productoEditando, setProductoEditando] = useState(null);

  // Filtro por categoría en “Editar / Eliminar”
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  // Miscelánea
  const [mensaje, setMensaje] = useState(null);
  const [finanzasData, setFinanzasData] = useState(null);
  const [recargarProductos, setRecargarProductos] = useState(false);

  /* ------------------- HOOKS ------------------- */

// 1️⃣ Fuerza recarga al entrar a “Editar producto”
useEffect(() => {
  if (seleccion === 'Editar producto') {
    setRecargarProductos(prev => !prev);
  }
}, [seleccion]);

// 2️⃣ Obtiene usuarios / productos cada vez que cambian la pestaña
//     o recargarProductos pasa a true
useEffect(() => {
  if (['Convertir a Admin', 'Convertir a Normal', 'Eliminar usuarios'].includes(seleccion)) {
    fetch('http://localhost:8000/usuarios', { credentials: 'include' })
      .then(r => r.json()).then(setUsuarios)
      .catch(() => setUsuarios([]));
  }

  if (['Editar producto', 'Renovar Stock'].includes(seleccion) || recargarProductos) {
    fetch('http://localhost:8000/productos', { credentials: 'include' })
      .then(r => r.json()).then(setProductos)
      .catch(() => setProductos([]));
  }
}

, [seleccion, recargarProductos]);




  /* --- Eliminar usuario ---------------------------------------- */
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  /* --- Eliminar producto --------------------------------------- */
  const [productoEliminar, setProductoEliminar] = useState(null);
  const [deleteProductoVisible, setDeleteProductoVisible] = useState(false);

  /* ----------------------------------------------------------------
   * USE EFFECTS
   * ---------------------------------------------------------------- */
  // Autenticación
  useEffect(() => {
    const saved = localStorage.getItem('usuario');
    if (!saved) return navigate('/login');
    const u = JSON.parse(saved);
    if (u.roles !== 'admin') return navigate('/');
    setUsuario(u);
  }, []);



  // Categorías (una sola vez)
  useEffect(() => {
    fetch('http://localhost:8000/categorias', { credentials: 'include' })
      .then(r => r.json()).then(setCategorias).catch(() => setCategorias([]));
  }, []);

  // Resumen financiero
  useEffect(() => {
    if (seleccion === 'Finanzas') {
      fetch('http://localhost:8000/resumen-financiero', { credentials: 'include' })
        .then(r => r.json()).then(setFinanzasData).catch(() => setFinanzasData(null));
    }
  }, [seleccion]);

  // Limpia alertas
  useEffect(() => setMensaje(null), [seleccion]);
  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(() => setMensaje(null), 3000);
    return () => clearTimeout(t);
  }, [mensaje]);

  /* ----------------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------------- */
  const showMsg = (texto, tipo = 'success') => setMensaje({ texto, tipo });

  const csrfToken = () => decodeURIComponent(
    document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
  );

  /* ----------------------- USERS --------------------------------- */
  const toggleRol = async (email, rolActual) => {
    const endpoint = rolActual === 'admin' ? 'quitar-admin' : 'convertir-admin';
    await fetch(`http://localhost:8000/admin/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    setUsuarios(us => us.map(u => u.email === email
      ? { ...u, roles: rolActual === 'admin' ? 'normal' : 'admin' }
      : u));
    showMsg('Rol actualizado');
  };
  
  const confirmDeleteUser = (u) => { setUserToDelete(u); setDeleteModalVisible(true); };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const resp = await fetch('http://localhost:8000/admin/eliminar', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken(),
        },
        body: JSON.stringify({ email: userToDelete.email }),
      });
  
      if (!resp.ok) throw new Error((await resp.json()).message);
  
      if (userToDelete.email === usuario.email) {
        localStorage.removeItem('usuario');
        navigate('/login');
      } else {
        setUsuarios(prev => prev.filter(u => u.email !== userToDelete.email));
        showMsg('Usuario eliminado');
      }
    } catch (err) {
      if (err instanceof Response) {
        const errorData = await err.json();
        console.error("Errores de validación:", errorData.errors);
        showMsg(Object.values(errorData.errors).flat().join(', '), 'danger');
      } else {
        showMsg(err.message || 'Error al eliminar', 'danger');
      }
    } finally {
      setDeleteModalVisible(false);
      setUserToDelete(null);
    }
  };
  

  /* ----------------------- PRODUCTS ------------------------------ */
  const handleProductoChange = (e, setFunc) => {
    const { name, value, files } = e.target;
    setFunc(p => ({ ...p, [name]: name === 'img' ? files[0] : value }));
  };

const handleAgregarProducto = async () => {
  console.log('Nuevo producto:', nuevoProducto); // ✅ Aquí

  const formData = new FormData();
  Object.entries(nuevoProducto).forEach(([k, v]) => {
    if (k === 'img') {
      if (v instanceof File) formData.append('img', v);
      return;
    }
    formData.append(k, v);
  });
    

    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const resp = await fetch('http://localhost:8000/agregar-producto', {
        method: 'POST', credentials: 'include', headers: { 'X-XSRF-TOKEN': csrfToken() }, body: formData,
      });
      if (!resp.ok) throw new Error((await resp.json()).message);
      showMsg('Producto añadido');
      setNuevoProducto(nuevoProdInicial);
      setRecargarProductos(prev => !prev);
    } catch (err) {
      showMsg(err.message || 'Error al añadir', 'danger');
    }
  };

  const handleEditarProducto = async () => {
    if (!productoEditando) return;
  
    try {
      // Preparar datos para el formulario
      const formData = new FormData();
      Object.entries(productoEditando).forEach(([key, value]) => {
        if (key === 'img') {
          if (value instanceof File) formData.append('img', value);
        } else {
          formData.append(key, value);
        }
      });
  
      // Obtener el token CSRF
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
  
      // Hacer la petición para actualizar el producto
      const resp = await fetch(`http://localhost:8000/editar-producto/${productoEditando.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': csrfToken(),
          'Accept': 'application/json',
        },
        body: formData,
      });
  
      const data = await resp.json();
  
      if (!resp.ok) {
        console.error('Errores del backend:', data.errors || data.message);
        showMsg(data.message || 'Error al editar', 'danger');
        return;
      }
  
      showMsg('Producto actualizado');
      setRecargarProductos(prev => !prev);
      setProductoEditando(null);
    } catch (err) {
      console.error('Error general:', err);
      showMsg(err.message || 'Error al editar', 'danger');
    }
  };
  

  const confirmarEliminarProducto = (p) => { setProductoEliminar(p); setDeleteProductoVisible(true); };

  const handleEliminarProducto = async () => {
    if (!productoEliminar) return;
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const resp = await fetch(`http://localhost:8000/eliminar-producto/${productoEliminar.id}`, {
        method: 'DELETE', credentials: 'include', headers: { 'X-XSRF-TOKEN': csrfToken() },
      });
      if (!resp.ok) throw new Error((await resp.json()).message);
      showMsg('Producto eliminado');
      setRecargarProductos(prev => !prev);
    } catch (err) {
      showMsg(err.message || 'Error al eliminar', 'danger');
    } finally {
      setDeleteProductoVisible(false);
      setProductoEliminar(null);
    }
  };

  const renovarStockProducto = async (p) => {
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const resp = await fetch('http://localhost:8000/renovar-stock', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': csrfToken() },
        body: JSON.stringify({ id: p.id, cantidad: 10 }),
      });
      if (!resp.ok) throw new Error((await resp.json()).message);
      showMsg('Stock renovado');
      setRecargarProductos(prev => !prev);
    } catch (err) {
      showMsg(err.message || 'Error al renovar stock', 'danger');
    }
  };

  /* ----------------------------------------------------------------
   * RENDER: USUARIOS / PRODUCTOS / FINANZAS
   * ---------------------------------------------------------------- */
  const renderTablaUsuarios = (filtro) => (
    <div className="container">
      <h5>{filtro === 'admin' ? 'Administradores' : filtro === 'normal' ? 'Usuarios normales' : 'Todos los usuarios'}</h5>
      <table className="table">
        <thead><tr><th>Email</th><th>Nombre</th><th>Rol</th><th>Acciones</th></tr></thead>
        <tbody>
          {usuarios.filter(u => filtro === 'all' || u.roles === filtro).map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.name} {u.last_name}</td>
              <td>{u.roles}</td>
              <td>
                <button
                  className={`btn btn-sm ${u.roles === 'admin' ? 'btn-warning' : 'btn-success'} me-2`}
                  onClick={() => toggleRol(u.email, u.roles)}
                >
                  {u.roles === 'admin' ? 'Convertir a normal' : 'Hacer admin'}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => confirmDeleteUser(u)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderRenovarStock = () => {
    const bajos = productos.filter(p => p.stock < 10);
    return (
      <div className="container">
        <h4>Renovar Stock (menos de 10)</h4>
        {bajos.length === 0
          ? <p className="text-muted">Sin productos bajos de stock.</p>
          : (
            <ul className="list-group">
              {bajos.map(p => (
                <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{p.nombre} — Stock: {p.stock}</span>
                  <button className="btn btn-sm btn-warning" onClick={() => renovarStockProducto(p)}>+10</button>
                </li>
              ))}
            </ul>
          )}
      </div>
    );
  };

  const renderFinanzas = () => {
    if (!finanzasData) return <p className="text-muted">Cargando…</p>;
    const COLORS = ['#0088FE', '#00C49F', '#FF8042'];
    const dataPie = [
      { name: 'Beneficios', value: finanzasData.beneficios },
      { name: 'Pérdidas', value: finanzasData.perdidas },
      { name: 'Total', value: finanzasData.total },
    ];
    return (
      <div className="container mt-4">
        <h4>Resumen Financiero</h4>
        <table className="table table-bordered mt-3">
          <tbody>
            <tr><th>Total (€)</th><td>{finanzasData.total.toFixed(2)}</td></tr>
            <tr><th>Beneficios (€)</th><td>{finanzasData.beneficios.toFixed(2)}</td></tr>
            <tr><th>Pérdidas (€)</th><td>{finanzasData.perdidas.toFixed(2)}</td></tr>
          </tbody>
        </table>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={dataPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                label
              >
                {dataPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderAgregarProducto = () => (
    <div className="container mt-4">
      <h4>Añadir nuevo producto</h4>
      <form onSubmit={(e) => { e.preventDefault(); handleAgregarProducto(); }} className="row g-3 mt-2">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            name="nombre"
            value={nuevoProducto.nombre}
            onChange={e => handleProductoChange(e, setNuevoProducto)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Precio (€)</label>
          <input
            className="form-control"
            type="number"
            step="0.01"
            name="precio"
            value={nuevoProducto.precio}
            onChange={e => handleProductoChange(e, setNuevoProducto)}
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="descripcion"
            value={nuevoProducto.descripcion}
            onChange={e => handleProductoChange(e, setNuevoProducto)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Stock inicial</label>
          <input
            className="form-control"
            type="number"
            name="stock"
            value={nuevoProducto.stock}
            onChange={e => handleProductoChange(e, setNuevoProducto)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            name="id_categoria"
            value={nuevoProducto.id_categoria}
            onChange={e => handleProductoChange(e, setNuevoProducto)}
            required
          >
            <option value="">Seleccionar</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-12">
          <label className="form-label">Imagen</label>
          <input
            className="form-control"
            type="file"
            name="img"
            accept="image/*"
            onChange={e => handleProductoChange(e, setNuevoProducto)}
          />
        </div>
        <div className="col-12 d-flex justify-content-end">
          <button className="btn btn-primary">Añadir producto</button>
        </div>
      </form>
    </div>
  );

  /* ----------- EDITAR / ELIMINAR CON FILTRO POR CATEGORÍA ---------- */
const renderEditarProductos = () => {
  const filtrados = categoriaFiltro
    ? productos.filter(p => Number(p.id_categoria) === Number(categoriaFiltro))
    : productos;

  return (
    <div className="container mt-4">
      <h4>Editar / Eliminar productos</h4>

      {/* ---------- Filtro por categoría ---------- */}
      <div className="mb-3 d-flex align-items-center">
        <label className="me-2">Filtrar por categoría:</label>
        <select
          className="form-select w-auto"
          value={categoriaFiltro}
          onChange={e => setCategoriaFiltro(e.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {/* ---------- Tabla ---------- */}
      {filtrados.length === 0 ? (
        <p className="text-muted">No hay productos para mostrar.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{Number(p.precio).toFixed(2)} €</td>
                <td>{p.stock}</td>
                <td>{categorias.find(c => c.id === p.id_categoria)?.nombre || '—'}</td>
                <td>
                  <button className="btn btn-sm btn-info me-2" onClick={() => setProductoEditando(p)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => confirmarEliminarProducto(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal editar producto */}
      {productoEditando && (
        <div className="modal-backdrop">
          <div className="modal-confirm large">
            <h5 className="mb-3">Editar producto</h5>
            <form onSubmit={(e) => { e.preventDefault(); handleEditarProducto(); }} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  className="form-control"
                  name="nombre"
                  value={productoEditando.nombre}
                  onChange={e => handleProductoChange(e, setProductoEditando)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Precio (€)</label>
                <input
                  className="form-control"
                  type="number"
                  step="0.01"
                  name="precio"
                  value={productoEditando.precio}
                  onChange={e => handleProductoChange(e, setProductoEditando)}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  value={productoEditando.descripcion}
                  onChange={e => handleProductoChange(e, setProductoEditando)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Stock</label>
                <input
                  className="form-control"
                  type="number"
                  name="stock"
                  value={productoEditando.stock}
                  onChange={e => handleProductoChange(e, setProductoEditando)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  name="id_categoria"
                  value={productoEditando.id_categoria}
                  onChange={e => handleProductoChange(e, setProductoEditando)}
                  required
                >
                  <option value="">Seleccionar</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="col-md-12">
                <label className="form-label">Imagen (opcional)</label>
                <input
                  className="form-control"
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={e => handleProductoChange(e, setProductoEditando)}
                />
              </div>
              <div className="col-12 d-flex justify-content-between">
                <button className="btn btn-secondary" type="button" onClick={() => setProductoEditando(null)}>Cancelar</button>
                <button className="btn btn-primary">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal eliminar producto */}
      {deleteProductoVisible && (
        <div className="modal-backdrop">
          <div className="modal-confirm">
            <h5 className="mb-3">⚠️ Eliminar producto</h5>
            <p>¿Seguro que quieres eliminar <strong>{productoEliminar.nombre}</strong>?</p>
            <div className="d-flex justify-content-between">
              <button className="btn btn-danger" onClick={handleEliminarProducto}>Sí, eliminar</button>
              <button className="btn btn-secondary" onClick={() => setDeleteProductoVisible(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  /* ----------------  SWITCH  ---------------- */
  const renderContenido = () => {
    switch (seleccion) {
      case 'Añadir producto': return renderAgregarProducto();
      case 'Editar producto': return renderEditarProductos();
      case 'Convertir a Admin': return renderTablaUsuarios('normal');
      case 'Convertir a Normal': return renderTablaUsuarios('admin');
      case 'Eliminar usuarios': return renderTablaUsuarios('all');
      case 'Renovar Stock': return renderRenovarStock();
      case 'Finanzas': return renderFinanzas();
      default: return <p>Seleccione una opción</p>;
    }
  };

  /* ----------------  UI PRINCIPAL  ---------------- */
  const opciones = [
    'Añadir producto', 'Editar producto',
    'Renovar Stock', 'Finanzas',
    'Convertir a Admin', 'Convertir a Normal', 'Eliminar usuarios',
    'Cerrar sesión',
  ];

  return (
    <div className="panel-container d-flex">
      {/* Sidebar */}
      <div className="panel-sidebar">
        <h5>Panel Admin</h5>
        {opciones.map(op => (
          <button
            key={op}
            className={`btn ${seleccion === op ? 'btn-active' : 'btn-outline-light'} mb-2`}
            onClick={() => {
              if (op === 'Cerrar sesión') {
                localStorage.removeItem('usuario');
                navigate('/login');
              } else {
                setSeleccion(op);
              }
            }}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="panel-content">
        <h3 className="admin-header">Gestión Administrativa</h3>

        {mensaje && (
          <div
            className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show mt-3`}
            role="alert"
          >
            {mensaje.texto}
            <button type="button" className="btn-close" data-bs-dismiss="alert" />
          </div>
        )}

        {renderContenido()}

        {/* Modal confirmar eliminación de usuario */}
        {deleteModalVisible && (
          <div className="modal-backdrop">
            <div className="modal-confirm">
              <h5 className="mb-3">⚠️ Eliminar usuario</h5>
              <p>¿Seguro que quieres eliminar a <strong>{userToDelete?.email}</strong>?</p>
              <div className="d-flex justify-content-between">
                <button className="btn btn-danger" onClick={handleDeleteUser}>Sí, eliminar</button>
                <button className="btn btn-secondary" onClick={() => setDeleteModalVisible(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAdministrador;
