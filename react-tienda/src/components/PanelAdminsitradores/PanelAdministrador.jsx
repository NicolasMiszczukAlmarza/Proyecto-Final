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

  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '', img: null });
  const [productoEditando, setProductoEditando] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [recargarProductos, setRecargarProductos] = useState(false);

  const [mensaje, setMensaje] = useState(null);
  const [finanzasData, setFinanzasData] = useState(null);

  /* --- Eliminar usuario ---------------------------------------- */
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
  }, [navigate]);

  // Cargar usuarios / productos según pestaña
  useEffect(() => {
    if (['Convertir a Admin', 'Convertir a Normal', 'Eliminar usuarios'].includes(seleccion)) {
      fetch('http://localhost:8000/usuarios', { credentials: 'include' })
        .then(r => r.json()).then(setUsuarios).catch(() => setUsuarios([]));
    }
    if (['Editar producto', 'Renovar Stock'].includes(seleccion)) {
      fetch('http://localhost:8000/productos', { credentials: 'include' })
        .then(r => r.json()).then(setProductos).catch(() => setProductos([]));
    }
  }, [seleccion, recargarProductos]);

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
    await fetch(`http://localhost:8000/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ email }),
    });
    setUsuarios(us => us.map(u => u.email === email ? { ...u, roles: rolActual === 'admin' ? 'normal' : 'admin' } : u));
    showMsg('Rol actualizado');
  };

  const confirmDeleteUser = (u) => { setUserToDelete(u); setDeleteModalVisible(true); };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const resp = await fetch('http://localhost:8000/eliminar-usuario', {
        method: 'DELETE', credentials: 'include', headers: {
          'Content-Type': 'application/json', 'X-XSRF-TOKEN': csrfToken()
        }, body: JSON.stringify({ email: userToDelete.email }),
      });
      if (!resp.ok) throw new Error((await resp.json()).message);
      setUsuarios(prev => prev.filter(u => u.email !== userToDelete.email));
      showMsg('Usuario eliminado');
    } catch (err) { showMsg(err.message || 'Error', 'danger'); }
    finally { setDeleteModalVisible(false); setUserToDelete(null); }
  };

  /* ----------------------- PRODUCTS ------------------------------ */
  const handleProductoChange = (e, setFunc) => {
    const { name, value, files } = e.target;
    setFunc(p => ({ ...p, [name]: name === 'img' ? files[0] : value }));
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
                <button className={`btn btn-sm ${u.roles === 'admin' ? 'btn-warning' : 'btn-success'} me-2`} onClick={() => toggleRol(u.email, u.roles)}>
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
        {bajos.length === 0 ? <p className="text-muted">Sin productos bajos de stock.</p>
          : <ul className="list-group">
              {bajos.map(p => (
                <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{p.nombre} — Stock: {p.stock}</span>
                  <button className="btn btn-sm btn-warning" onClick={() => renovarStockProducto(p)}>+10</button>
                </li>
              ))}
            </ul>}
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
              <Pie data={dataPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={80} label>
                {dataPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  /* ----------------  SWITCH  ---------------- */
  const renderContenido = () => {
    switch (seleccion) {
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
    'Convertir a Admin', 'Convertir a Normal', 'Eliminar usuarios',
    'Renovar Stock', 'Finanzas', 'Cerrar sesión',
  ];

  return (
    <div className="panel-container d-flex">
      {/* Sidebar */}
      <div className="panel-sidebar">
        <h5>Panel Admin</h5>
        {opciones.map(op => (
          <button key={op} className={`btn ${seleccion === op ? 'btn-active' : 'btn-outline-light'} mb-2`} onClick={() => {
            if (op === 'Cerrar sesión') { localStorage.removeItem('usuario'); navigate('/login'); }
            else setSeleccion(op);
          }}>{op}</button>
        ))}
      </div>

      {/* Contenido */}
      <div className="panel-content">
        <h3 className="admin-header">Gestión Administrativa</h3>

        {mensaje && (
          <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show mt-3`} role="alert">
            {mensaje.texto}
            <button type="button" className="btn-close" data-bs-dismiss="alert" />
          </div>
        )}

        {renderContenido()}

        {/* Modal confirmar eliminación */}
        {deleteModalVisible && (
          <div className="modal-backdrop">
            <div className="modal-confirm">
              <h5 className="mb-3">⚠️ Eliminar usuario</h5>
              <p>¿Seguro que quieres eliminar a <strong>{userToDelete.email}</strong>?</p>
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