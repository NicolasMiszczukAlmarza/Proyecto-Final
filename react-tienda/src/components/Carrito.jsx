import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Carrito.css";
import { categorias } from "../data/categorias";
import { productos } from "../data/productos";

const Carrito = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const handleCategoriaClick = (nombreCategoria) => {
    setCategoriaSeleccionada((prev) => (prev === nombreCategoria ? null : nombreCategoria));
  };

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter((producto) => {
        const categoria = categorias.find((cat) => cat.id === producto.id_categoria);
        return categoria && categoria.nombre === categoriaSeleccionada;
      })
    : productos;

  return (
    <>
      {/* Cabecera fija */}
      <header className="header fixed-top">
        <div className="container-fluid d-flex flex-column align-items-center p-3">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <img src="public/img/logo/logo.jpg" alt="Logo" className="logo" />
            <input type="text" className="form-control search-bar mx-3" placeholder="Buscar productos..." />
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="icono-carrito mx-2" />
              <FontAwesomeIcon icon={faUser} className="icono-usuario mx-2" />
              <button className="btn btn-danger btn-sm ms-3" onClick={handleCerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          </div>
          
          {/* Mensaje de bienvenida en el header */}
         
          
          <nav className="categorias-menu w-100">
            <div className="container-fluid categorias-container d-flex justify-content-center">
              {categorias.map((categoria) => (
                <span
                  key={categoria.id}
                  className={`categoria ${categoriaSeleccionada === categoria.nombre ? "selected" : ""} ${
                    categoria.id === 11 ? "mas-vendida" : ""
                  }`}
                  onClick={() => handleCategoriaClick(categoria.nombre)}
                >
                  {categoria.nombre}
                </span>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Contenedor principal con margen superior corregido */}
      <main className="container productos-container mt-5 pt-5">
        <div className="row productos-lista">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <div key={producto.id} className="col-md-4 mb-4">
                <div className="card producto-card">
                  <img src={producto.img} className="card-img-top" alt={producto.nombre} />
                  <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">{producto.descripcion}</p>
                    <h6 className="text-primary">${producto.precio}</h6>
                    <button className="btn btn-success w-100">Añadir al carrito</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-100">No hay productos en esta categoría.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default Carrito;
