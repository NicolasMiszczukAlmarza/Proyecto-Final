import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Carrito.css";
import { categorias } from "../data/categorias"; // Asegúrate de tener las categorías correctas
import { productos } from "../data/productos"; // Asegúrate de tener los productos correctos

const Carrito = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la barra de búsqueda

  // Función para manejar el cierre de sesión
  const handleCerrarSesion = async () => {
    try {
      // Realizamos la solicitud de cierre de sesión al servidor
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include", // Para enviar las cookies de sesión si las hay
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Eliminar los datos de sesión almacenados en el localStorage o cookies
        localStorage.removeItem("usuario"); // Elimina el token o cualquier dato de usuario
        // Si también se almacena en cookies, las cookies deberían ser eliminadas aquí.

        // Redirigir al usuario al login
        navigate("/login"); // Redirige a la página de login (ajusta la ruta si es diferente)
      } else {
        console.error("Error al cerrar sesión en el servidor.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Función para manejar el clic en una categoría
  const handleCategoriaClick = (nombreCategoria) => {
    setCategoriaSeleccionada((prev) => (prev === nombreCategoria ? null : nombreCategoria));
  };

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualiza el estado con el término de búsqueda
  };

  // Filtra los productos por categoría y por búsqueda (no distingue entre mayúsculas y minúsculas)
  const productosFiltrados = productos.filter((producto) => {
    const categoria = categorias.find((cat) => cat.id === producto.id_categoria);
    const matchesCategoria = categoriaSeleccionada ? categoria.nombre === categoriaSeleccionada : true;
    const matchesBusqueda =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategoria && matchesBusqueda;
  });

  return (
    <>
      {/* Cabecera fija */}
      <header className="header fixed-top">
        <div className="container-fluid d-flex flex-column align-items-center p-3">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <img src="public/img/logo/logo.jpg" alt="Logo" className="logo" />
            <input
              type="text"
              className="form-control search-bar mx-3"
              placeholder="Buscar productos..."
              value={searchTerm} // Vincula el valor con el estado
              onChange={handleSearchChange} // Actualiza el estado cuando el usuario escribe
            />
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="icono-carrito mx-2" />
              <FontAwesomeIcon icon={faUser} className="icono-usuario mx-2" />
              <button className="btn btn-danger btn-sm ms-3" onClick={handleCerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Menú de categorías */}
          <nav className="categorias-menu w-100">
            <div className="container-fluid categorias-container d-flex justify-content-center">
              {categorias.map((categoria) => (
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

      {/* Contenedor principal con margen superior ajustado */}
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
            <p className="text-center w-100">No se encontraron productos que coincidan con esa búsqueda.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default Carrito;
