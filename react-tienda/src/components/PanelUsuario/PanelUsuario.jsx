/*  --------------------------------------------------------------------
    PanelUsuario.jsx
    Componente completo, limpio y funcional.
    - Sube imagen de perfil (multipart/form‑data)
    - Guarda ruta correcta en Laravel (public/uploads/…)
    - Refresca usuario y muestra la foto nueva al volver a “Perfil”
--------------------------------------------------------------------- */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PanelUsuario.css';

const API = 'http://localhost:8000';

const PanelUsuario = () => {
  /* ────────────────────  estados  ──────────────────── */
  const [seleccion,   setSeleccion]   = useState('Perfil');
  const [usuario,     setUsuario]     = useState(null);
  const [formData,    setFormData]    = useState({ name:'', last_name:'', address:'' });
  const [imagen,      setImagen]      = useState(null);
  const [mensaje,     setMensaje]     = useState({ texto:'', tipo:'' });
  const [pedidos,     setPedidos]     = useState([]);
  const [cargandoPed, setCargandoPed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate        = useNavigate();
  const fileInputRef    = useRef(null);

  /* ────────────────────  helpers  ──────────────────── */
  const fetchUser = async () => {
    const { data } = await axios.get(`${API}/user`, { withCredentials:true });
    setUsuario(data);
    setFormData({ name:data.name, last_name:data.last_name, address:data.address ?? '' });
    localStorage.setItem('usuario', JSON.stringify(data));
  };

  const showMsg = (texto,tipo) => setMensaje({ texto, tipo });

  /* ────────────────────  efectos  ──────────────────── */
  useEffect(() => { fetchUser().catch(()=>navigate('/login')); }, [navigate]);

  useEffect(() => {
    if (seleccion !== 'Pedidos' || !usuario?.email) return;
    setCargandoPed(true);
    fetch(`${API}/pedidos-usuario/${usuario.email}`, { credentials:'include' })
      .then(r=>r.json())
      .then(d=>setPedidos(Array.isArray(d)?d:[]))
      .catch(()=>setPedidos([]))
      .finally(()=>setCargandoPed(false));
  }, [seleccion, usuario]);

  /* ───────────────  handlers de menú  ─────────────── */
  const handleClick = op => {
    if (op==='Ir al carrito')      return navigate('/carrito');
    if (op==='Cerrar sesión')     { localStorage.removeItem('usuario'); return navigate('/login'); }
    if (op==='Eliminar cuenta')   { setShowConfirm(true); return; }
    setSeleccion(op);
  };

  /* ───────────────  actualización de perfil  ─────────────── */
  const handleActualizar = async () => {
    if (!usuario) return;
  
    try {
      // 1. Obtener la cookie de CSRF
      await axios.get(`${API}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
  
      // 2. Crear el FormData
      const form = new FormData();
      form.append('name', formData.name);
      form.append('last_name', formData.last_name);
      form.append('address', formData.address);
      if (imagen) form.append('profile_image', imagen);
  
      // 3. Enviar el formulario a la ruta PROTEGIDA por Sanctum
      const resp = await axios.post(`${API}/user/actualizar`, form, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // 4. Actualizar el estado del usuario
      const updated = {
        ...usuario,
        ...formData,
        profile_image: resp.data.profile_image,
      };
      setUsuario(updated);
      localStorage.setItem('usuario', JSON.stringify(updated));
      await fetchUser(); // obtener info actualizada
  
      setImagen(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
  
      showMsg('✅ Perfil actualizado correctamente.', 'success');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Error de conexión.';
      showMsg(`❌ ${msg}`, 'danger');
    }
  };
  

  /* ───────────────  recuperar contraseña  ─────────────── */
  const handleEnviarRecuperacion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/forgot-password`, { email:usuario.email },
        { withCredentials:true });
      showMsg('📧 Correo de recuperación enviado.','success');
      setTimeout(()=>navigate('/login'),4000);
    } catch {
      showMsg('❌ Error al enviar correo.','danger');
    }
  };

  /* ───────────────  render helpers  ─────────────── */
  if (!usuario) return <div className="text-center mt-5">Cargando usuario…</div>;

  const renderPedidos = () => {
    const grupos = pedidos.reduce((a,p)=>(a[p.order_id]=[...(a[p.order_id]||[]),p],a),{});
    return (
      <div className="w-100" style={{ maxWidth:600 }}>
        <h5 className="mb-3 text-center">Tus pedidos</h5>
        {cargandoPed ? <div className="text-center">Cargando…</div> :
         Object.keys(grupos).length===0 ?
         <div className="alert alert-info text-center">No has realizado pedidos aún.</div> :
         Object.entries(grupos).map(([id,prods])=>(
           <div key={id} className="mb-4 p-3 pedido-box">
             <div className="mb-2"><b>Identificador:</b> <span className="text-primary">{id}</span></div>
             <div className="detalle-fecha">
               <b>Fecha:</b> {prods[0].fecha.slice(0,19).replace('T',' ')}
               {prods[0].precioTotal &&
                 <span className="ms-3"><b>Total:</b> {prods[0].precioTotal} €
                   {prods[0].descuento>0 && ` (Descuento: ${prods[0].descuento} €)`}
                 </span>}
             </div><hr/>
             {prods.map((p,i)=>(
               <div key={i} className="mb-2">
                 <b>{p.producto_nombre||p.nombre}</b>
                 <div className="small"><b>Cant.:</b> {p.cantidad} | <b>Precio:</b> {p.precioProducto} €</div>
               </div>))}
           </div>
         ))
        }
      </div>
    );
  };

  const renderPerfil = () => (
    <div className="w-100" style={{ maxWidth:500 }}>
      <div className="mb-3 text-center">
        <img src={usuario.profile_image}
             onError={e=>e.target.src='/img/usuario/principal.png'}
             alt="Perfil" style={{ width:120,borderRadius:'50%' }}/>
      </div>
      {['name','last_name','address','email'].map(f=>(
        <div className="mb-3" key={f}>
          <label className="form-label fw-bold">
            {f==='name'?'Nombre':f==='last_name'?'Apellidos':f==='address'?'Dirección':'Correo electrónico'}
          </label>
          <input className="form-control text-center" readOnly
                 value={f==='address' ? (usuario.address||'No especificada') : usuario[f]}/>
        </div>
      ))}
    </div>
  );

  const renderModificarDatos = () => (
    <div className="w-100" style={{ maxWidth:500 }}>
      <div className="mb-3">
        <label className="form-label fw-bold">Foto de perfil</label>
        <input type="file" className="form-control" accept="image/*"
               onChange={e=>setImagen(e.target.files[0])} ref={fileInputRef}/>
      </div>

      {imagen && (
        <div className="mb-3 text-center">
          <label className="form-label fw-bold">Vista previa</label><br/>
          <img src={URL.createObjectURL(imagen)} alt="preview"
               style={{ width:120,borderRadius:'50%' }}/>
        </div>
      )}

      {['name','last_name','address'].map(f=>(
        <div className="mb-3" key={f}>
          <label className="form-label fw-bold">
            {f==='name'?'Nombre':f==='last_name'?'Apellidos':'Dirección'}
          </label>
          <input className="form-control text-center" name={f}
                 value={formData[f]} onChange={e=>setFormData({...formData,[f]:e.target.value})}/>
        </div>
      ))}

      <button className="btn btn-primary w-100" onClick={handleActualizar}>
        Guardar cambios
      </button>
    </div>
  );

  const renderContraseña = () => (
    <div className="w-100" style={{ maxWidth:400 }}>
      <form onSubmit={handleEnviarRecuperacion}>
        <div className="mb-3">
          <label className="form-label fw-bold">Correo electrónico</label>
          <input className="form-control text-center" readOnly value={usuario.email}/>
        </div>
        <button className="btn btn-warning w-100" type="submit">
          Enviar correo de recuperación
        </button>
        <div className="mt-3 small text-muted text-center">
          Te enviaremos un enlace para cambiar la contraseña.
        </div>
      </form>
    </div>
  );

  const opciones = ['Perfil','Modificar Datos','Pedidos','Contraseña',
                    'Ir al carrito','Cerrar sesión','Eliminar cuenta'];

  /* ────────────────────  JSX principal  ──────────────────── */
  return (
    <div className="panel-container">
      {/* confirmación eliminar */}
      {showConfirm && (
        <div className="confirm-backdrop">
          <div className="confirm-box">
            <h5 className="fw-bold mb-3">⚠️ Eliminar cuenta</h5>
            <p>¿Seguro que quieres eliminar tu cuenta?<br/>
               <strong>Esta acción NO se puede deshacer.</strong></p>
            <div className="d-flex gap-3">
              <button className="btn btn-outline-secondary flex-fill"
                      onClick={()=>setShowConfirm(false)}>Cancelar</button>
              <button className="btn btn-danger flex-fill"
                      onClick={handleEliminarCuenta}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* sidebar */}
      <div className="panel-sidebar">
        <h4>Opciones del Menú</h4>
        {opciones.map(op=>(
          <button key={op}
            className={`btn ${seleccion===op?'btn-active':'btn-outline-light'} text-start`}
            onClick={()=>handleClick(op)}>{op}</button>
        ))}
      </div>

      {/* contenido */}
      <div className="panel-content d-flex justify-content-center align-items-start pt-4">
        <div className="w-100">
          <h1 className="display-6 text-center mb-4">Panel del Usuario</h1>

          {mensaje.texto &&
            <div className={`alert alert-${mensaje.tipo} text-center mx-auto`}
                 style={{maxWidth:500}}>{mensaje.texto}</div>}

          <div className="contenido-box d-flex justify-content-center">
            {seleccion==='Perfil'          && renderPerfil()}
            {seleccion==='Modificar Datos' && renderModificarDatos()}
            {seleccion==='Pedidos'         && renderPedidos()}
            {seleccion==='Contraseña'      && renderContraseña()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelUsuario;
