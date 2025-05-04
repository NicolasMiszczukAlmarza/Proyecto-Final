import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelAdministrador.css';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PanelAdministrador = () => {
  const navigate = useNavigate();

  /* ----------------------------------------------------------------
   * ESTADOS
   * ---------------------------------------------------------------- */
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [seleccion, setSeleccion] = useState('Añadir producto');
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', descripcion: '', precio: '', stock: '',
    id_categoria: '', img: null,
  });
  const [productoEditando, setProductoEditando] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [recargarProductos, setRecargarProductos] = useState(false);

  const [mensaje, setMensaje] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [finanzasData, setFinanzasData] = useState(null);

  /* ----------------------------------------------------------------
   * EFECTOS
   * ---------------------------------------------------------------- */

  // Autenticación y rol
  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (!stored) return navigate('/login');
    const user = JSON.parse(stored);
    if (user.roles !== 'admin') return navigate('/');
    setUsuario(user);
  }, [navigate]);

  // Carga de usuarios o productos según pestaña
  useEffect(() => {
    if (['Convertir a Admin', 'Convertir a Normal'].includes(seleccion)) {
      fetch('http://localhost:8000/usuarios', { credentials: 'include' })
        .then(r => r.json()).then(setUsuarios).catch(() => setUsuarios([]));
    }
    if (['Editar producto', 'Renovar Stock'].includes(seleccion)) {
      fetch('http://localhost:8000/productos', { credentials: 'include' })
        .then(r => r.json()).then(setProductos).catch(() => setProductos([]));
    }
  }, [seleccion, recargarProductos]);

  // Categorías (solo una vez)
  useEffect(() => {
    fetch('http://localhost:8000/categorias', { credentials: 'include' })
      .then(r => r.json()).then(setCategorias).catch(() => setCategorias([]));
  }, []);

  // Datos financieros cuando se entra en Finanzas
  useEffect(() => {
    if (seleccion === 'Finanzas') {
      fetch('http://localhost:8000/resumen-financiero', { credentials: 'include' })
        .then(r => r.json()).then(setFinanzasData).catch(() => setFinanzasData(null));
    }
  }, [seleccion]);

  // Limpia alerta al cambiar pestaña
  useEffect(() => setMensaje(null), [seleccion]);

  // Oculta alerta tras 3 s
  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(() => setMensaje(null), 3000);
    return () => clearTimeout(t);
  }, [mensaje]);

  /* ----------------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------------- */

  const handleProductoChange = (e, setFunc) => {
    const { name, value, files } = e.target;
    setFunc(p => ({ ...p, [name]: name === 'img' ? files[0] : value }));
  };

  const toggleRol = async (email, rolActual) => {
    const endpoint = rolActual === 'admin' ? 'quitar-admin' : 'convertir-admin';
    await fetch(`http://localhost:8000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    setUsuarios(u => u.map(us =>
      us.email === email ? { ...us, roles: rolActual === 'admin' ? 'normal' : 'admin' } : us
    ));
  };

  /* ----------------  CRUD PRODUCTOS  ---------------- */

  const handleAgregarProducto = async e => {
    e.preventDefault();
    const formData = new FormData();
    const producto = { ...nuevoProducto, stock: nuevoProducto.stock || 50 };
    Object.entries(producto).forEach(([k, v]) => v && formData.append(k, v));

    try {
      const r = await fetch('http://localhost:8000/agregar-producto', {
        method: 'POST', credentials: 'include', body: formData,
      });
      if (!r.ok) throw new Error();
      setMensaje({ tipo: 'success', texto: 'Producto agregado exitosamente' });
      setNuevoProducto({ nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '', img: null });
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al agregar producto' });
    }
  };

  const handleGuardarEdicion = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(productoEditando).forEach(([k, v]) => {
      if (v !== null && v !== undefined && (k !== 'img' || v instanceof File)) fd.append(k, v);
    });
    try {
      const r = await fetch(`http://localhost:8000/editar-producto/${productoEditando.id}`, {
        method: 'POST', credentials: 'include', body: fd
      });
      if (!r.ok) throw new Error();
      setMensaje({ tipo: 'success', texto: 'Producto actualizado correctamente' });
      setProductoEditando(null);
      setRecargarProductos(p => !p);
    } catch { setMensaje({ tipo: 'error', texto: 'Error al actualizar producto' }); }
  };

  const confirmarEliminacion = id => { setProductoAEliminar(id); setModalVisible(true); };

  const handleEliminarProducto = async () => {
    try {
      const r = await fetch(`http://localhost:8000/eliminar-producto/${productoAEliminar}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (!r.ok) throw new Error();
      setMensaje({ tipo: 'success', texto: 'Producto eliminado correctamente' });
      setRecargarProductos(p => !p);
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar producto' });
    } finally {
      setModalVisible(false); setProductoAEliminar(null);
    }
  };

  /* ----------------  RENOVAR STOCK  ---------------- */

  const renovarStockProducto = async prod => {
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const token = decodeURIComponent(
        document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
      );
      const r = await fetch('http://localhost:8000/renovar-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': token },
        credentials: 'include',
        body: JSON.stringify({ id: prod.id, cantidad: 10, order_id: null })
      });
      if (!r.ok) throw new Error();
      setMensaje({ tipo: 'success', texto: `Stock de "${prod.nombre}" incrementado en 10 unidades.` });
      setRecargarProductos(p => !p);
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al renovar stock' });
    }
  };

  /* ----------------------------------------------------------------
   * RENDER SECCIONES
   * ---------------------------------------------------------------- */

  const renderUsuarios = tipo => (
    <div className="container">
      <h5>{tipo === 'admin' ? 'Administradores' : 'Usuarios normales'}</h5>
      <table className="table">
        <thead><tr><th>Email</th><th>Nombre</th><th>Rol</th><th>Acción</th></tr></thead>
        <tbody>
          {usuarios
            .filter(u => u.roles === tipo)
            .map(u => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.name} {u.last_name}</td>
                <td>{u.roles}</td>
                <td>
                  <button
                    className={`btn btn-sm ${u.roles === 'admin' ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => toggleRol(u.email, u.roles)}
                  >
                    {u.roles === 'admin' ? 'Convertir a normal' : 'Hacer admin'}
                  </button>
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
        <h4>Renovar Stock (menos de 10 unidades)</h4>
        {bajos.length === 0
          ? <p className="text-muted">No hay productos con stock bajo.</p>
          : <ul className="list-group">
            {bajos.map(p => (
              <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{p.nombre} — Stock actual: {p.stock}</span>
                <button className="btn btn-sm btn-warning" onClick={() => renovarStockProducto(p)}>+10 unidades</button>
              </li>
            ))}
          </ul>}
      </div>
    );
  };

  /* ---------- FINANZAS (tabla + gráfica) ---------- */

  const renderFinanzas = () => {
    const COLORS = ['#0088FE', '#00C49F', '#FF8042'];
    const data = finanzasData ? [
      { name: 'Beneficios', value: finanzasData.beneficios },
      { name: 'Pérdidas', value: finanzasData.perdidas },
      { name: 'Total', value: finanzasData.total },
    ] : [];
    return (
      <div className="container mt-4">
        <h4>Resumen Financiero</h4>
        {finanzasData
          ? <>
            <table className="table table-bordered mt-3">
              <tbody>
                <tr><th>Total (€)</th>      <td>{finanzasData.total.toFixed(2)}</td></tr>
                <tr><th>Beneficios (€)</th> <td>{finanzasData.beneficios.toFixed(2)}</td></tr>
                <tr><th>Pérdidas (€)</th>   <td>{finanzasData.perdidas.toFixed(2)}</td></tr>
              </tbody>
            </table>

            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={40} outerRadius={80} label>
                    {data.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
          : <p className="text-muted">Cargando datos financieros…</p>}
      </div>
    );
  };

  /* ---------- AÑADIR / EDITAR PRODUCTO ---------- */

  const renderAgregarProducto = () => (
    <div className="container">
      <h4>Añadir Nuevo Producto</h4>
      <form onSubmit={handleAgregarProducto} className="card p-4 shadow">
        <input name="nombre" value={nuevoProducto.nombre} onChange={e => handleProductoChange(e, setNuevoProducto)} placeholder="Nombre" required className="form-control mb-2" />
        <textarea name="descripcion" value={nuevoProducto.descripcion} onChange={e => handleProductoChange(e, setNuevoProducto)} placeholder="Descripción" required className="form-control mb-2" />
        <input type="number" name="precio" value={nuevoProducto.precio} onChange={e => handleProductoChange(e, setNuevoProducto)} placeholder="Precio (€)" required className="form-control mb-2" />
        <input type="number" name="stock" value={nuevoProducto.stock} onChange={e => handleProductoChange(e, setNuevoProducto)} placeholder="Stock" className="form-control mb-2" />
        <select name="id_categoria" value={nuevoProducto.id_categoria} onChange={e => handleProductoChange(e, setNuevoProducto)} required className="form-select mb-2">
          <option value="">Seleccione una categoría</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <input type="file" name="img" accept="image/*" onChange={e => handleProductoChange(e, setNuevoProducto)} className="form-control mb-3" />
        <button className="btn btn-primary">Agregar</button>
      </form>
    </div>
  );

  const renderEditarProducto = () => {
    const lista = categoriaFiltro ? productos.filter(p => p.id_categoria === +categoriaFiltro) : productos;
    return (
      <div className="container">
        <h4>Editar Producto</h4>
        <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)} className="form-select mb-3">
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>

        {!productoEditando
          ? <ul className="list-group">
            {lista.map(p => (
              <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                {p.nombre}
                <div className="btn-group">
                  <button className="btn btn-sm btn-info" onClick={() => setProductoEditando(p)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => confirmarEliminacion(p.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          : <div className="card p-4 shadow-sm">
            <form onSubmit={handleGuardarEdicion}>
              <input name="nombre" value={productoEditando.nombre} onChange={e => handleProductoChange(e, setProductoEditando)} required className="form-control mb-2" />
              <textarea name="descripcion" value={productoEditando.descripcion} onChange={e => handleProductoChange(e, setProductoEditando)} required className="form-control mb-2" />
              <input type="number" name="precio" value={productoEditando.precio} onChange={e => handleProductoChange(e, setProductoEditando)} required className="form-control mb-2" />
              <input type="number" name="stock" value={productoEditando.stock} onChange={e => handleProductoChange(e, setProductoEditando)} required className="form-control mb-2" />
              <select name="id_categoria" value={productoEditando.id_categoria} onChange={e => handleProductoChange(e, setProductoEditando)} required className="form-select mb-2">
                <option value="">Seleccione una categoría</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <input type="file" name="img" accept="image/*" onChange={e => handleProductoChange(e, setProductoEditando)} className="form-control mb-3" />
              <button className="btn btn-success w-100">Guardar</button>
              <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => setProductoEditando(null)}>Cancelar</button>
            </form>
          </div>}
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

  /* ----------------  SWITCH  ---------------- */
  const renderContenido = () => {
    switch (seleccion) {
      case 'Convertir a Admin': return renderUsuarios('normal');
      case 'Convertir a Normal': return renderUsuarios('admin');
      case 'Añadir producto': return renderAgregarProducto();
      case 'Editar producto': return renderEditarProducto();
      case 'Renovar Stock': return renderRenovarStock();
      case 'Finanzas': return renderFinanzas();
      default: return <p>Seleccione una opción</p>;
    }
  };

  /* ----------------  UI PRINCIPAL  ---------------- */
  return (
    <div className="panel-container d-flex">
      {/* Sidebar */}
      <div className="panel-sidebar">
        <h5>Panel Admin</h5>
        {[
          'Convertir a Admin', 'Convertir a Normal', 'Añadir producto',
          'Editar producto', 'Renovar Stock', 'Finanzas', 'Cerrar sesión',
        ].map(op => (
          <button key={op}
            className={`btn ${seleccion === op ? 'btn-active' : 'btn-outline-light'} mb-2`}
            onClick={() => {
              if (op === 'Cerrar sesión') { localStorage.removeItem('usuario'); navigate('/login'); }
              else setSeleccion(op);
            }}>
            {op}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="panel-content">
        <h3 className="admin-header">Gestión Administrativa</h3>

        {mensaje && (
          <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show mt-3`} role="alert">
            {mensaje.texto}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Cerrar" />
          </div>
        )}

        {renderContenido()}
      </div>
    </div>
  );
};

export default PanelAdministrador;
