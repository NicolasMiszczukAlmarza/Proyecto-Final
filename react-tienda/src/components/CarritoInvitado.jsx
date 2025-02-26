import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categorias } from "../data/categorias"; 
import { productos } from "../data/productos"; 
import './CarritoInvitado.css'; 

const CarritoInvitado = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda

  // Filtra las categorías excluyendo "Mas Vendida"
  const categoriasFiltradas = categorias.filter((categoria) => categoria.nombre !== "Mas Vendida");

  // Filtra productos en base a la categoría seleccionada y la búsqueda
  const productosFiltrados = productos.filter((producto) => {
    const categoria = categorias.find((cat) => cat.id === producto.id_categoria);
    const coincideConCategoria = categoriaSeleccionada
      ? categoria && categoria.nombre === categoriaSeleccionada
      : true;

    const coincideConBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());

    return coincideConCategoria && coincideConBusqueda;
  });

  // No modificamos el margen superior si la búsqueda tiene resultados
  let marginTop = "0%"; // Valor por defecto cuando hay productos filtrados

  // Si hay productos, pero la búsqueda no está activa, ajustar el margen
  if (busqueda.length === 0) {
    if (productosFiltrados.length < 8) {
      marginTop = "0%"; // Si hay menos de 8 productos, el margen es 15%
    } else {
      marginTop = "0%"; // Si hay más de 8 productos, el margen es 30%
    }
  }

  const handleCerrarSesion = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include", // Para enviar las cookies de sesión
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("userEmail"); // Eliminar el email del localStorage
        navigate("/"); // Redirige al inicio
      } else {
        console.error("Error al cerrar sesión.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleCategoriaClick = (nombreCategoria) => {
    setCategoriaSeleccionada((prev) => (prev === nombreCategoria ? null : nombreCategoria));
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    if (e.target.value !== "") {
      setCategoriaSeleccionada(null); // Desmarcar categorías al buscar
    }
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

      {/* Contenedor de productos */}
      <main className="container productos-container mt-5 pt-5" style={{ marginTop }}>
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
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-100">No hay productos que coincidan con la búsqueda o categoría seleccionada.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default CarritoInvitado;
