import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "./Carrito.css";
import { categorias } from "../data/categorias";
import { productos } from "../data/productos";
import ModalCarrito from "./ModalCarrito";

const Carrito = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [showCarritoModal, setShowCarritoModal] = useState(false);

  // Obtener usuario actual
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (!usuario) navigate("/login");
  }, [usuario, navigate]);

  const handleCerrarSesion = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        localStorage.removeItem("usuario");
        navigate("/login");
      } else {
        alert("Error al cerrar sesión en el servidor.");
      }
    } catch (error) {
      alert("Error al cerrar sesión.");
    }
  };

  const handleCategoriaClick = (nombreCategoria) => {
    setCategoriaSeleccionada((prev) =>
      prev === nombreCategoria ? null : nombreCategoria
    );
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

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
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === productoSeleccionado.id);
      if (existente) {
        if (existente.cantidad + cantidad <= 5) {
          return prev.map((item) =>
            item.id === productoSeleccionado.id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          );
        } else {
          alert("No puedes agregar más de 5 unidades.");
          return prev;
        }
      } else {
        return [...prev, { ...productoSeleccionado, cantidad }];
      }
    });
    setShowModal(false);
  };

  const handleAñadirAlCarrito = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1);
    setShowModal(true);
  };

  const handleCantidadChange = (e) => {
    let nueva = Math.min(Math.max(1, parseInt(e.target.value, 10)), 5);
    if (isNaN(nueva)) nueva = 1;
    setCantidad(nueva);
  };

  const aumentarCantidad = () => {
    setCantidad((prev) => (prev < 5 ? prev + 1 : prev));
  };

  const disminuirCantidad = () => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const contarProductosCarrito = () =>
    carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const eliminarProductoCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

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
                onClick={() => setShowCarritoModal(true)}
              />
              <span className="carrito-counter">{contarProductosCarrito()}</span>

              {/* FOTO DE USUARIO */}
              <img
                src={
                  usuario?.profile_image
                    ? `http://localhost:8000/${usuario.profile_image}`
                    : "/img/usuario/principal.png"
                }
                alt="Perfil"
                className="icono-usuario mx-2"
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "2px solid #ddd",
                }}
                onClick={handleIrAlPanelUsuario}
                onError={e => { e.target.src = "/img/usuario/principal.png"; }}
                title="Ir a tu panel"
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
              {categorias.map((cat) => (
                <span
                  key={cat.id}
                  className={`categoria ${categoriaSeleccionada === cat.nombre ? "selected" : ""}`}
                  onClick={() => handleCategoriaClick(cat.nombre)}
                >
                  {cat.nombre}
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
                  <img src={producto.img} className="card-img-top" alt={producto.nombre} />
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
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Selecciona la cantidad</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body text-center">
                <img
                  src={productoSeleccionado.img}
                  alt={productoSeleccionado.nombre}
                  className="img-fluid"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <button className="btn btn-secondary" onClick={disminuirCantidad}>-</button>
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
                  <button className="btn btn-success" onClick={aumentarCantidad}>+</button>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={agregarAlCarrito}>
                  Agregar al carrito
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal del carrito */}
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
