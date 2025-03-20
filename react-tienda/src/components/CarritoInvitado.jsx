import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categorias } from "../data/categorias"; 
import { productos } from "../data/productos"; 
import './CarritoInvitado.css'; 

const CarritoInvitado = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Filtra categorías excluyendo "Más Vendida"
  const categoriasFiltradas = categorias.filter((categoria) => categoria.nombre !== "Mas Vendida");

  // Filtra productos por categoría
  const productosPorCategoria = productos.filter((producto) => {
    const categoria = categorias.find((cat) => cat.id === producto.id_categoria);
    return categoriaSeleccionada ? categoria && categoria.nombre === categoriaSeleccionada : false;
  });

  // Filtra productos por búsqueda
  const productosPorBusqueda = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCerrarSesion = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include", // Mantén la sesión si es necesario
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Si la sesión se cierra correctamente, eliminamos el email del localStorage
        localStorage.removeItem("userEmail");

        // Redirigimos al usuario al login
        navigate("/login");  // Aquí rediriges a la página de login
      } else {
        console.error("Error al cerrar sesión.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleCategoriaClick = (nombreCategoria) => {
    setCategoriaSeleccionada((prev) => (prev === nombreCategoria ? null : nombreCategoria));
    setBusqueda(""); // Limpia la búsqueda al seleccionar categoría
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setCategoriaSeleccionada(null); // Limpia la categoría al buscar
  };

  return (
    <>
      {/* Cabecera fija */}
      <header className="header fixed-top">
        <div className="container-fluid d-flex flex-column align-items-center p-3">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <img src="public/img/logo/logo.jpg" alt="Logo" className="logo" />
            {/* Barra de búsqueda */}
            <input
              type="text"
              className="form-control search-bar mx-3"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={handleBusquedaChange}
            />
            <button className="btn btn-danger btn-sm ms-3" onClick={handleCerrarSesion}>
              Cerrar sesión
            </button>
          </div>

          {/* Menú de categorías */}
          <nav className="categorias-menu w-100 mt-2">
            <div className="container-fluid categorias-container d-flex justify-content-center">
              {categoriasFiltradas.map((categoria) => (
                <span
                  key={categoria.id}
                  className={`categoria ${categoriaSeleccionada === categoria.nombre ? "selected" : ""}`}
                  onClick={() => handleCategoriaClick(categoria.nombre)}
                >
                  {categoria.nombre}
                </span>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Contenedor de productos por búsqueda */}
      {busqueda && (
        <main className="container productos-busqueda productos-busqueda-activa" style={{ marginTop: "-70%" }}>
          <h3 className="text-center">Resultados de búsqueda</h3>
          <div className="row productos-lista">
            {productosPorBusqueda.length > 0 ? (
              productosPorBusqueda.map((producto) => (
                <div key={producto.id} className="col-md-4 mb-4">
                  <div className="card producto-card">
                    <img src={producto.img} className="card-img-top" alt={producto.nombre} />
                    <div className="card-body">
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text">{producto.descripcion}</p>
                      <h6 className="text-primary">{producto.precio}€</h6>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-100">No hay productos que coincidan con la búsqueda.</p>
            )}
          </div>
        </main>
      )}

      {/* Contenedor de productos por categoría */}
      {categoriaSeleccionada && !busqueda && (
        <main className="container productos-categoria" style={{ marginTop: "-10%" }}>
          <h3 className="text-center">Productos de {categoriaSeleccionada}</h3>
          <div className="row productos-lista">
            {productosPorCategoria.length > 0 ? (
              productosPorCategoria.map((producto) => (
                <div key={producto.id} className="col-md-4 mb-4">
                  <div className="card producto-card">
                    <img src={producto.img} className="card-img-top" alt={producto.nombre} />
                    <div className="card-body">
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text">{producto.descripcion}</p>
                      <h6 className="text-primary">{producto.precio}€</h6>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-100">No hay productos en esta categoría.</p>
            )}
          </div>
        </main>
      )}

      {/* Contenedor de todos los productos cuando no hay búsqueda ni categoría seleccionada */}
      {!busqueda && !categoriaSeleccionada && (
        <main className="container productos-todos" style={{ marginTop: "150px" }}>
          <h3 className="text-center">Todos los productos</h3>
          <div className="row productos-lista">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <div key={producto.id} className="col-md-4 mb-4">
                  <div className="card producto-card">
                    <img src={producto.img} className="card-img-top" alt={producto.nombre} />
                    <div className="card-body">
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text">{producto.descripcion}</p>
                      <h6 className="text-primary">{producto.precio}€</h6>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-100">No hay productos disponibles.</p>
            )}
          </div>
        </main>
      )}
    </>
  );
};

export default CarritoInvitado;
