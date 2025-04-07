import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Carrito.css";
import { categorias } from "../data/categorias";
import { productos } from "../data/productos";
import ModalCarrito from "./ModalCarrito"; // Importar ModalCarrito


const Carrito = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [showCarritoModal, setShowCarritoModal] = useState(false); // Estado para mostrar el ModalCarrito

  const handleCerrarSesion = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("usuario");
        navigate("/login");
      } else {
        console.error("Error al cerrar sesión en el servidor.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleCategoriaClick = (nombreCategoria) => {
    setCategoriaSeleccionada((prev) =>
      prev === nombreCategoria ? null : nombreCategoria
    );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const productosFiltrados = productos.filter((producto) => {
    const categoria = categorias.find((cat) => cat.id === producto.id_categoria);
    const matchesCategoria = categoriaSeleccionada
      ? categoria.nombre === categoriaSeleccionada
      : true;
    const matchesBusqueda =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategoria && matchesBusqueda;
  });

  const agregarAlCarrito = () => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find(
        (item) => item.id === productoSeleccionado.id
      );
      if (productoExistente) {
        if (productoExistente.cantidad + cantidad <= 5) {
          return prevCarrito.map((item) =>
            item.id === productoSeleccionado.id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          );
        } else {
          alert("No puedes agregar más de 5 unidades de este producto.");
          return prevCarrito;
        }
      } else {
        return [...prevCarrito, { ...productoSeleccionado, cantidad }];
      }
    });
    setShowModal(false);
  };

  const handleAñadirAlCarrito = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1);
    setShowModal(true);
  };

  const handleCantidadChange = (event) => {
    const nuevaCantidad = Math.min(
      Math.max(1, parseInt(event.target.value, 10)),
      5
    );
    setCantidad(nuevaCantidad);
  };

  const aumentarCantidad = () => {
    if (cantidad < 5) setCantidad(cantidad + 1);
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  const contarProductosCarrito = () => {
    return carrito.length;
  };

  const eliminarProductoCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter((producto) => producto.id !== id));
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((producto) =>
        producto.id === id ? { ...producto, cantidad: nuevaCantidad } : producto
      )
    );
  };

  // Nueva función para ir al PanelUsuario
  const handleIrAlPanelUsuario = () => {
    navigate("/panel-usuario");
  };

  return (
    <>
      <header className="header fixed-top">
        <div className="container-fluid d-flex flex-column align-items-center p-3">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <img src="public/img/logo/logo.jpg" alt="Logo" className="logo" />
            <input
              type="text"
              className="form-control search-bar mx-3"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="d-flex align-items-center">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="icono-carrito mx-2"
                onClick={() => setShowCarritoModal(true)} // Mostrar modal carrito
              />
              <span className="carrito-counter">{contarProductosCarrito()}</span>
              {/* Ícono de usuario con el evento onClick para navegar al panel de usuario */}
              <FontAwesomeIcon
                icon={faUser}
                className="icono-usuario mx-2"
                onClick={handleIrAlPanelUsuario}
              />
              <button
                className="btn btn-danger btn-sm ms-3"
                onClick={handleCerrarSesion}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
          <nav className="categorias-menu w-100">
            <div className="container-fluid categorias-container d-flex justify-content-center">
              {categorias.map((categoria) => (
                <span
                  key={categoria.id}
                  className={`categoria ${
                    categoriaSeleccionada === categoria.nombre
                      ? "selected"
                      : ""
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

      <main className="container productos-container mt-5 pt-5">
        <div className="row productos-lista">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <div key={producto.id} className="col-md-4 mb-4">
                <div className="card producto-card">
                  <img
                    src={producto.img}
                    className="card-img-top"
                    alt={producto.nombre}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">{producto.descripcion}</p>
                    <h6 className="text-primary">${producto.precio}</h6>
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handleAñadirAlCarrito(producto)}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-100">
              No se encontraron productos que coincidan con esa búsqueda.
            </p>
          )}
        </div>
      </main>

      {/* Modal de cantidad */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Selecciona la cantidad
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={productoSeleccionado.img}
                    alt={productoSeleccionado.nombre}
                    className="img-fluid"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <button className="btn-custom-rojo2" onClick={disminuirCantidad}>
                    -
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={handleCantidadChange}
                    min="1"
                    max="5"
                    className="form-control mx-2"
                    style={{ width: "60px", textAlign: "center" }}
                    readOnly
                  />
                  <button className="btn btn-success" onClick={aumentarCantidad}>
                    +
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={agregarAlCarrito}>
                  Agregar al carrito
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de carrito */}
      {showCarritoModal && (
        <ModalCarrito
          carrito={carrito}
          onCerrar={() => setShowCarritoModal(false)}
          onEliminarProducto={eliminarProductoCarrito}
          onActualizarCantidad={actualizarCantidad}
        />
      )}
    </>
  );
};

export default Carrito;
