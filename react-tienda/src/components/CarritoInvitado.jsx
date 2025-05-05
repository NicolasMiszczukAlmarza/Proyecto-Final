import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categorias } from "../data/categorias";
import { productos } from "../data/productos";
import "./CarritoInvitado.css";

const CarritoInvitado = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const categoriasFiltradas = categorias.filter(c => c.nombre !== "Mas Vendida");

  const productosFiltrados = productos.filter(producto => {
    const categoria = categorias.find(cat => cat.id === producto.id_categoria);
    const coincideCategoria = categoriaSeleccionada
      ? categoria?.nombre === categoriaSeleccionada
      : true;
    const coincideBusqueda = busqueda
      ? producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      : true;
    return coincideCategoria && coincideBusqueda;
  });

  const handleCerrarSesion = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        localStorage.removeItem("userEmail");
        navigate("/login");
      } else {
        console.error("Error al cerrar sesión.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleCategoriaClick = (nombreCategoria) => {
    setCategoriaSeleccionada(prev => prev === nombreCategoria ? null : nombreCategoria);
    setBusqueda("");
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setCategoriaSeleccionada(null);
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <img src="public/img/logo/logo.jpg" alt="Logo" className="logo" />
          </div>
          <div className="header-center">
            <input
              type="text"
              className="search-bar"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={handleBusquedaChange}
            />
          </div>
          <div className="header-right">
            <button className="btn-danger" onClick={handleCerrarSesion}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="productos-container">
        {/* Categorías */}
        <nav className="categorias-menu">
          <div className="categorias-container">
            {categoriasFiltradas.map(categoria => (
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

        {/* Título */}
        <h3 className="productos-titulo">
          {busqueda
            ? "Resultados de búsqueda"
            : categoriaSeleccionada
              ? `Productos de ${categoriaSeleccionada}`
              : "Todos los productos"}
        </h3>

        {/* Lista de productos */}
        <div className="productos-lista">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(producto => (
              <div key={producto.id} className="producto-card">
                <img src={producto.img} alt={producto.nombre} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{producto.nombre}</h5>
                  <p className="card-text">{producto.descripcion}</p>
                  <h6 className="card-price">{producto.precio}€</h6>
                </div>
              </div>
            ))
          ) : (
            <p className="no-productos">No hay productos disponibles.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default CarritoInvitado;
