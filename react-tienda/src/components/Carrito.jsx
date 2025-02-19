import React from 'react';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import { categorias } from '../data/categorias'; // Importar las categorías
import './Carrito.css'; // Importar el archivo CSS

const Carrito = () => {
  const navigate = useNavigate();  // Inicializamos useNavigate

  const handleCerrarSesion = () => {
    // Eliminar cualquier dato relacionado con la sesión (por ejemplo, token de autenticación)
    localStorage.removeItem('usuario'); // Elimina el usuario del almacenamiento local (si lo tenías guardado)

    // Si usas un sistema de autenticación como Context o Redux, puedes hacer el reset aquí también
    // ejemplo: dispatch(logout());

    // Redirigir a la página de login
    navigate('/');  // Redirige a la ruta de login
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Primera fila con fondo suave */}
      <div className="first-row row w-100 d-flex justify-content-between align-items-center p-4 bg-light shadow-sm rounded">
        {/* Alineado a la izquierda con el saludo */}
        <p className="col-6 text-dark mb-0">Hola, Usuario</p>

        {/* Alineado a la derecha con el avatar del usuario y las opciones */}
        <div className="col-6 d-flex justify-content-end align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-person rounded-circle me-3" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
          </svg>
          <div className="ms-3">
            <button className="btn btn-primary btn-sm">Mi cuenta</button>
            <button className="btn btn-danger btn-sm mt-2" onClick={handleCerrarSesion}>Cerrar sesión</button>
          </div>
        </div>
      </div>

      {/* Segunda sección con bloques de categorías */}
      <div className="second-row row w-100 mt-4">
        {/* Bloque 1: Categorías */}
        <div className="block col-4 p-3 text-center text-white rounded block-categorias">
          <h2>Categorías</h2>
          {/* Mapeamos las categorías para mostrarlas */}
          <div className="row">
            {categorias.map((categoria) => (
              <div className="col-12 mb-2" key={categoria.id}>
                <div className="card card-hover bg-light">
                  <div className="card-body">
                    <p className="card-title mb-0">{categoria.nombre}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloque 2 */}
        <div className="block col-4 bg-primary p-3 text-center text-white rounded">
          <h2>Bloque 2</h2>
          {/* Aquí puedes agregar contenido específico para el bloque 2 */}
        </div>

        {/* Bloque 3 */}
        <div className="block col-4 bg-success p-3 text-center text-white rounded">
          <h2>Bloque 3</h2>
          {/* Aquí puedes agregar contenido específico para el bloque 3 */}
        </div>
      </div>
    </div>
  );
};

export default Carrito;
