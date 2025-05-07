import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelUsuario.css';
import axios from 'axios';


const PanelUsuario = () => {
  const [seleccion, setSeleccion] = useState('Perfil');
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({ name: '', last_name: '', address: '' });
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPed, setCargandoPed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Cargar usuario desde localStorage
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        // Obtener datos actualizados del usuario
        const response = await axios.get(`http://localhost:8000/user`, {
          withCredentials: true,
        });
  
        if (response.status === 200) {
          const user = response.data;
  
          // Actualizamos el estado
          setUsuario(user);
  
          // Actualizamos el formulario con los nuevos datos
          setFormData({
            name: user.name,
            last_name: user.last_name,
            address: user.address || '',
          });
  
          // Guardamos el usuario actualizado en localStorage
          localStorage.setItem('usuario', JSON.stringify(user));
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        navigate('/login');
      }
    };
  
    fetchUsuario();
  }, [navigate]);
  

  // Cargar pedidos al seleccionar sección 'Pedidos'
  useEffect(() => {
    if (seleccion !== 'Pedidos' || !usuario?.email) return;
    setCargandoPed(true);
    fetch(`http://localhost:8000/pedidos-usuario/${usuario.email}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setPedidos(Array.isArray(data) ? data : []))
      .catch(() => setPedidos([]))
      .finally(() => setCargandoPed(false));
  }, [seleccion, usuario]);

  // Handler de menú
  const handleClick = opcion => {
    if (opcion === 'Ir al carrito') return navigate('/carrito');
    if (opcion === 'Cerrar sesión') {
      localStorage.removeItem('usuario');
      return navigate('/login');
    }
    if (opcion === 'Eliminar cuenta') {
      return setShowConfirm(true);
    }
    setSeleccion(opcion);
  };

  // Eliminar cuenta
  const handleEliminarCuenta = async () => {
    if (!usuario?.email) return;
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const xsrfToken = decodeURIComponent(
        document.cookie.split('; ').find(c => c.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
      );
      const resp = await fetch('http://localhost:8000/eliminar-usuario', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken },
        body: JSON.stringify({ email: usuario.email })
      });
      setShowConfirm(false);
      if (resp.ok) {
        setMensaje({ texto: '✅ Cuenta eliminada correctamente.', tipo: 'success' });
        setTimeout(() => { localStorage.removeItem('usuario'); navigate('/login'); }, 2200);
      } else {
        const { message } = await resp.json();
        setMensaje({ texto: `❌ Error al eliminar cuenta: ${message}`, tipo: 'danger' });
      }
    } catch {
      setMensaje({ texto: '❌ Error de conexión.', tipo: 'danger' });
      setShowConfirm(false);
    }
  };

  const handleImagenChange = e => setImagen(e.target.files[0]);

  // Actualizar perfil
  const handleActualizar = async () => {
    if (!usuario) return;
  
    try {
      // Pedimos el token CSRF para la sesión
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });
  
      // Creamos el formData con los datos
      const form = new FormData();
      form.append('name', formData.name);
      form.append('last_name', formData.last_name);
      form.append('address', formData.address);
  
      if (imagen) {
        form.append('profile_image', imagen);  // Si existe, se adjunta
      }
  
      // Enviamos el formulario al backend
      const resp = await axios.post('http://localhost:8000/actualizar-usuario', form, {
        withCredentials: true
      });
  
      const data = resp.data;
  
      if (resp.status !== 200) {
        setMensaje({ texto: `❌ ${data.message}`, tipo: 'danger' });
        return;
      }
  
      // Actualizamos el usuario en React con los nuevos datos
      const updated = {
        ...usuario,
        ...formData,
        profile_image: data.profile_image, // <-- Aquí ya viene la URL correcta
      };
  
      // Actualizamos el estado del usuario en React
      setUsuario(updated);
  
      // Guardamos en localStorage para persistencia
      localStorage.setItem('usuario', JSON.stringify(updated));
  
      // Mostramos un mensaje de éxito
      setMensaje({
        texto: '✅ Perfil actualizado correctamente.',
        tipo: 'success',
      });
  
    } catch (error) {
      console.error(error);
      setMensaje({ texto: '❌ Error de conexión.', tipo: 'danger' });
    }
  };
  

  // Recuperar contraseña
  const handleEnviarRecuperacion = async e => {
    e.preventDefault();
    if (!usuario?.email) return;
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const resp = await fetch('http://localhost:8000/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario.email })
      });
      const data = await resp.json();
      setMensaje({ texto: data.message, tipo: resp.ok ? 'success' : 'danger' });
      if (resp.ok) setTimeout(() => { localStorage.removeItem('usuario'); navigate('/login'); }, 5000);
    } catch {
      setMensaje({ texto: '❌ Error de conexión.', tipo: 'danger' });
    }
  };

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Si usuario no cargado, mostramos carga
  if (!usuario) {
    return <div className="text-center mt-5">Cargando usuario…</div>;
  }

  const renderPedidos = () => {
    const agrupados = pedidos.reduce((a, p) => {
      a[p.order_id] = a[p.order_id] || [];
      a[p.order_id].push(p);
      return a;
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
                <b>Fecha:</b> {prods[0].fecha.slice(0, 19).replace('T', ' ')}
                {prods[0].precioTotal && (
                  <span className="ms-3">
                    <b>Total:</b> {prods[0].precioTotal} €
                    {prods[0].descuento > 0 && ` (Descuento: ${prods[0].descuento} €)`}
                  </span>
                )}
              </div>
              <hr />
              {prods.map((p, i) => (
                <div key={i} className="mb-2">
                  <b>{p.producto_nombre || p.nombre}</b>
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

  const renderPerfil = () => (
    <div className="w-100" style={{ maxWidth: 500 }}>
      <div className="mb-3 text-center">
      <img 
  src={usuario.profile_image} 
  alt="Perfil" 
  style={{ width: 120, borderRadius: '50%' }} 
  onError={(e) => (e.target.src = '/img/usuario/principal.png')} 
/>

      </div>
      {['name', 'last_name', 'address', 'email'].map((f) => (
        <div className="mb-3" key={f}>
          <label className="form-label fw-bold">
            {f === 'name'
              ? 'Nombre'
              : f === 'last_name'
              ? 'Apellidos'
              : f === 'address'
              ? 'Dirección'
              : 'Correo electrónico'}
          </label>
          <input
            className="form-control text-center"
            readOnly
            value={f === 'address' ? usuario.address || 'No especificada' : usuario[f]}
          />
        </div>
      ))}
    </div>
  );
  
  

  const renderModificarDatos = () => (
    <div className="w-100" style={{ maxWidth: 500 }}>
      <div className="mb-3">
        <label className="form-label fw-bold">Foto de perfil</label>
        <input type="file" className="form-control" accept="image/*" onChange={handleImagenChange} />
      </div>
      {['name', 'last_name', 'address'].map(f => (
        <div className="mb-3" key={f}>
          <label className="form-label fw-bold">
            {f === 'name'
              ? 'Nombre'
              : f === 'last_name'
              ? 'Apellidos'
              : 'Dirección'}
          </label>
          <input
            className="form-control text-center"
            name={f}
            value={formData[f]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button className="btn btn-primary w-100" onClick={handleActualizar}>
        Guardar cambios
      </button>
    </div>
  );

  const renderContraseña = () => (
    <div className="w-100" style={{ maxWidth: 400 }}>
      <form onSubmit={handleEnviarRecuperacion}>
        <div className="mb-3">
          <label className="form-label fw-bold">Correo electrónico</label>
          <input className="form-control text-center" readOnly value={usuario.email} />
        </div>
        <button type="submit" className="btn btn-warning w-100">Enviar correo de recuperación</button>
        <div className="mt-3 small text-muted text-center">
          Te enviaremos un enlace para cambiar la contraseña.
        </div>
      </form>
    </div>
  );

  const opciones = ['Perfil', 'Modificar Datos', 'Pedidos', 'Contraseña', 'Ir al carrito', 'Cerrar sesión', 'Eliminar cuenta'];

  return (
    <div className="panel-container">
      {showConfirm && (
        <div className="confirm-backdrop">
          <div className="confirm-box">
            <h5 className="fw-bold mb-3">⚠️ Eliminar cuenta</h5>
            <p className="mb-4">¿Seguro que quieres eliminar tu cuenta?<br /><strong>Esta acción NO se puede deshacer.</strong></p>
            <div className="d-flex gap-3">
              <button className="btn btn-outline-secondary flex-fill" onClick={() => setShowConfirm(false)}>Cancelar</button>
              <button className="btn btn-danger flex-fill" onClick={handleEliminarCuenta}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="panel-sidebar">
        <h4>Opciones del Menú</h4>
        <div className="d-flex flex-column gap-3">
          {opciones.map(op => (
            <button
              key={op}
              className={`btn ${seleccion === op ? 'btn-active' : 'btn-outline-light'} text-start`}
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
            {seleccion === 'Perfil' && renderPerfil()}
            {seleccion === 'Modificar Datos' && renderModificarDatos()}
            {seleccion === 'Pedidos' && renderPedidos()}
            {seleccion === 'Contraseña' && renderContraseña()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelUsuario;
