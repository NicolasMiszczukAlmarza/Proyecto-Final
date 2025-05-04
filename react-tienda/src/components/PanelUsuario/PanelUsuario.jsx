// src/components/PanelUsuario.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelUsuario.css';

const PanelUsuario = () => {
  /* ---------------------------------------------------------------- */
  /*  ESTADO                                                          */
  /* ---------------------------------------------------------------- */
  const [seleccion, setSeleccion] = useState('Perfil');
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({ name: '', last_name: '', address: '' });
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPed, setCargandoPed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  /* ---------------------------------------------------------------- */
  /*  CARGAR USUARIO DESDE LOCALSTORAGE                               */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem('usuario');
    if (!saved) return navigate('/login');

    const user = JSON.parse(saved);
    setUsuario(user);
    setFormData({
      name: user.name,
      last_name: user.last_name,
      address: user.address || ''
    });
  }, [navigate]);

  /* ---------------------------------------------------------------- */
  /*  CARGAR PEDIDOS CUANDO SE ENTRA EN LA SECCIÓN                    */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (seleccion !== 'Pedidos' || !usuario?.email) return;

    setCargandoPed(true);
    fetch(`http://localhost:8000/pedidos-usuario/${usuario.email}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setPedidos(Array.isArray(d) ? d : []))
      .catch(() => setPedidos([]))
      .finally(() => setCargandoPed(false));
  }, [seleccion, usuario]);

  /* ---------------------------------------------------------------- */
  /*  MANEJO DE MENÚ                                                  */
  /* ---------------------------------------------------------------- */
  const handleClick = (opcion) => {
    switch (opcion) {
      case 'Ir al carrito':
        return navigate('/carrito');
      case 'Cerrar sesión':
        localStorage.removeItem('usuario');
        return navigate('/login');
      case 'Eliminar cuenta':
        return setShowConfirm(true);
      default:
        setSeleccion(opcion);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  ELIMINAR CUENTA                                                 */
  /* ---------------------------------------------------------------- */
  const handleEliminarCuenta = async () => {
    if (!usuario?.email) return;
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const xsrfToken = decodeURIComponent(
        document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
      );
  
      const resp = await fetch('http://localhost:8000/eliminar-usuario', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken },
        body: JSON.stringify({ email: usuario.email })
      });
  
      setShowConfirm(false);              // cierra el modal
      if (resp.ok) {
        setMensaje({ texto: '✅ Cuenta eliminada correctamente.', tipo: 'success' });
        setTimeout(() => { localStorage.removeItem('usuario'); navigate('/login'); }, 2200);
      } else {
        const { message } = await resp.json();
        setMensaje({ texto: `❌ Error al eliminar cuenta: ${message || 'Error desconocido'}`, tipo: 'danger' });
      }
    } catch {
      setMensaje({ texto: '❌ Error al conectar con el servidor.', tipo: 'danger' });
      setShowConfirm(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  ACTUALIZAR PERFIL                                               */
  /* ---------------------------------------------------------------- */
  const handleActualizar = async () => {
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const xsrfToken = decodeURIComponent(document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] || '');

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('last_name', formData.last_name);
      payload.append('address', formData.address);
      if (imagen) payload.append('profile_image', imagen);

      const r = await fetch('http://localhost:8000/actualizar-usuario', {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-XSRF-TOKEN': xsrfToken },
        body: payload
      });

      if (r.status === 401) {
        setMensaje({ texto: '⚠️ Sesión expirada. Inicia de nuevo.', tipo: 'danger' });
        localStorage.removeItem('usuario');
        return navigate('/login');
      }

      const data = await r.json();
      if (!r.ok) {
        setMensaje({ texto: `❌ Error: ${data.message}`, tipo: 'danger' });
        return;
      }

      const updated = { ...usuario, ...formData };
      if (data.profile_image) updated.profile_image = data.profile_image;

      localStorage.setItem('usuario', JSON.stringify(updated));
      setUsuario(updated);
      setMensaje({ texto: '✅ Datos actualizados.', tipo: 'success' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch {
      setMensaje({ texto: '❌ Error al conectar con el servidor.', tipo: 'danger' });
    }
  };

  /* ---------------------------------------------------------------- */
  /*  RECUPERAR CONTRASEÑA                                            */
  /* ---------------------------------------------------------------- */
  const handleEnviarRecuperacion = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const xsrfToken = decodeURIComponent(document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] || '');

      const r = await fetch('http://localhost:8000/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken },
        body: JSON.stringify({ email: usuario?.email })
      });

      const data = await r.json();
      setMensaje({ texto: data.message || 'Intenta nuevamente.', tipo: r.ok ? 'success' : 'danger' });

      if (r.ok) {
        setTimeout(() => { localStorage.removeItem('usuario'); navigate('/login'); }, 5000);
      } else {
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
      }
    } catch {
      setMensaje({ texto: '❌ Error al conectar con el servidor.', tipo: 'danger' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  HANDLERS DE FORMULARIO                                          */
  /* ---------------------------------------------------------------- */
  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleImagenChange = e => setImagen(e.target.files[0]);

  /* ---------------------------------------------------------------- */
  /*  RENDER: PEDIDOS (sin imagen)                                    */
  /* ---------------------------------------------------------------- */
  const renderPedidos = () => {
    const agrupados = pedidos.reduce((acc, p) => {
      acc[p.order_id] = acc[p.order_id] || [];
      acc[p.order_id].push(p);
      return acc;
    }, {});

    return (
      <div className="w-100" style={{ maxWidth: 600 }}>
        <h5 className="mb-3 text-center">Tus pedidos</h5>
        {cargandoPed ? (
          <div className="text-center">Cargando…</div>
        ) : Object.keys(agrupados).length === 0 ? (
          <div className="alert alert-info text-center">No has realizado pedidos aún.</div>
        ) : (
          Object.entries(agrupados).map(([id, prods]) => (
            <div key={id} className="mb-4 p-3 pedido-box">
              <div className="mb-2">
                <b>Identificador:</b> <span className="text-primary">{id}</span>
              </div>
              <div className="detalle-fecha">
                <b>Fecha:</b> {prods[0].fecha?.slice(0, 19).replace('T', ' ')}
                {prods[0].precioTotal && (
                  <span className="ms-3">
                    <b>Total:</b> {prods[0].precioTotal} €
                    {prods[0].descuento > 0 && (
                      <span> (Descuento: {prods[0].descuento} €)</span>
                    )}
                  </span>
                )}
              </div>
              <hr />
              {prods.map((p, idx) => (
                <div key={p.id || idx} className="mb-2">
                  <b>{p.producto_nombre || p.nombre || 'Producto'}</b>
                  <div className="small">
                    <b>Cantidad:</b> {p.cantidad} | <b>Precio:</b> {p.precioProducto} €
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    );
  };

    /* ---------------------------------------------------------------- */
  /*  RENDER: PERFIL                                                  */
  /* ---------------------------------------------------------------- */
  const renderPerfil = () => (
    <div className="w-100" style={{ maxWidth: 500 }}>
      <div className="mb-3 text-center">
        <img
          src={
            usuario?.profile_image
              ? `http://localhost:8000/${usuario.profile_image}`
              : '/img/usuario/principal.png'
          }
          alt="Perfil"
          style={{ width: 120, borderRadius: '50%' }}
          onError={(e) => {
            e.target.src = '/img/usuario/principal.png';
          }}
        />
      </div>
      {['name', 'last_name', 'address', 'email'].map((field) => (
        <div className="mb-3" key={field}>
          <label className="form-label fw-bold">
            {field === 'name'
              ? 'Nombre'
              : field === 'last_name'
              ? 'Apellidos'
              : field === 'address'
              ? 'Dirección'
              : 'Correo electrónico'}
          </label>
          <input
            className="form-control text-center"
            readOnly
            value={
              field === 'address'
                ? usuario?.address || 'No especificada'
                : usuario?.[field] || ''
            }
          />
        </div>
      ))}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  RENDER: MODIFICAR DATOS                                         */
  /* ---------------------------------------------------------------- */
  const renderModificarDatos = () => (
    <div className="w-100" style={{ maxWidth: 500 }}>
      <div className="mb-3">
        <label className="form-label fw-bold">Foto de perfil</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleImagenChange}
        />
      </div>
      {['name', 'last_name', 'address'].map((field) => (
        <div className="mb-3" key={field}>
          <label className="form-label fw-bold">
            {field === 'name'
              ? 'Nombre'
              : field === 'last_name'
              ? 'Apellidos'
              : 'Dirección'}
          </label>
          <input
            className="form-control text-center"
            name={field}
            value={formData[field]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button className="btn btn-primary w-100" onClick={handleActualizar}>
        Guardar cambios
      </button>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  RENDER: CONTRASEÑA                                              */
  /* ---------------------------------------------------------------- */
  const renderContraseña = () => (
    <div className="w-100" style={{ maxWidth: 400 }}>
      <form onSubmit={handleEnviarRecuperacion}>
        <div className="mb-3">
          <label className="form-label fw-bold">Correo electrónico</label>
          <input
            className="form-control text-center"
            readOnly
            value={usuario?.email || ''}
          />
        </div>
        <button type="submit" className="btn btn-warning w-100">
          Enviar correo de recuperación
        </button>
        <div className="mt-3 small text-muted text-center">
          Te enviaremos un enlace para cambiar la contraseña.
        </div>
      </form>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  SELECCIONAR CONTENIDO                                           */
  /* ---------------------------------------------------------------- */
  const renderContenido = () => {
    switch (seleccion) {
      case 'Perfil':
        return renderPerfil();
      case 'Modificar Datos':
        return renderModificarDatos();
      case 'Pedidos':
        return renderPedidos();
      case 'Contraseña':
        return renderContraseña();
      default:
        return <p>Selecciona una opción del menú.</p>;
    }
  };

  /* ---------------------------------------------------------------- */
  /*  OPCIONES DE MENÚ                                                */
  /* ---------------------------------------------------------------- */
  const opciones = [
    'Perfil',
    'Modificar Datos',
    'Pedidos',
    'Contraseña',
    'Ir al carrito',
    'Cerrar sesión',
    'Eliminar cuenta',
  ];

  /* ---------------------------------------------------------------- */
  /*  RETURN PRINCIPAL                                                */
  /* ---------------------------------------------------------------- */
  return (
    <div className="panel-container">
      {showConfirm && (
  <div className="confirm-backdrop">
    <div className="confirm-box">
      <h5 className="fw-bold mb-3">⚠️ Eliminar cuenta</h5>
      <p className="mb-4">
        ¿Seguro que quieres eliminar tu cuenta?
        <br />
        <strong>Esta acción NO se puede deshacer.</strong>
      </p>
      <div className="d-flex gap-3">
        <button className="btn btn-outline-secondary flex-fill" onClick={() => setShowConfirm(false)}>
          Cancelar
        </button>
        <button className="btn btn-danger flex-fill" onClick={handleEliminarCuenta}>
          Sí, eliminar
        </button>
      </div>
    </div>
  </div>
)}

      <div className="panel-sidebar">
        <h4>Opciones del Menú</h4>
        <div className="d-flex flex-column gap-3">
          {opciones.map((op) => (
            <button
              key={op}
              className={`btn ${
                seleccion === op ? 'btn-active' : 'btn-outline-light'
              } text-start`}
              onClick={() => handleClick(op)}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-content d-flex justify-content-center align-items-start pt-4">
        <div className="w-100">
          <h1 className="display-6 text-center mb-4">Panel del Usuario</h1>

          {mensaje.texto && (
  <div
    className={`alert alert-${mensaje.tipo} custom-alert text-center`}
    style={{
      maxWidth: 500,
      margin: '0 auto 1.5rem',
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
