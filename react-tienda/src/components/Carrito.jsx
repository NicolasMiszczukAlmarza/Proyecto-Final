import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { categorias } from "../data/categorias";
import ModalCarrito from "./ModalCarrito";
import "./Carrito.css";

const Carrito = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [showCarritoModal, setShowCarritoModal] = useState(false);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (!usuario) navigate("/login");
  }, [usuario, navigate]);

  useEffect(() => {
    fetch("http://localhost:8000/productos", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch(() => setProductos([]));
  }, []);

  const handleCerrarSesion = async () => {
    try {
      const res = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        localStorage.removeItem("usuario");
        navigate("/login");
      } else {
        alert("Error al cerrar sesión en el servidor.");
      }
    } catch {
      alert("Error al cerrar sesión.");
    }
  };

  const handleCategoriaClick = (nombre) => {
    setCategoriaSeleccionada((prev) => (prev === nombre ? null : nombre));
    setSearchTerm(""); // limpiar búsqueda al cambiar de categoría
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCategoriaSeleccionada(null); // 🔥 desmarca la categoría al buscar
  };

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const categoria = categorias.find((cat) => cat.id === producto.id_categoria);
      const matchCategoria = categoriaSeleccionada
        ? categoria?.nombre.toLowerCase() === categoriaSeleccionada.toLowerCase()
        : true;
      const matchBusqueda =
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategoria && matchBusqueda;
    });
  }, [productos, categoriaSeleccionada, searchTerm]);

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

  const aumentarCantidad = () => setCantidad((prev) => (prev < 5 ? prev + 1 : prev));
  const disminuirCantidad = () => setCantidad((prev) => (prev > 1 ? prev - 1 : prev));
  const handleCantidadChange = (e) => {
    let nueva = parseInt(e.target.value, 10);
    if (isNaN(nueva) || nueva < 1) nueva = 1;
    if (nueva > 5) nueva = 5;
    setCantidad(nueva);
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

  const handleAñadirAlCarrito = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1);
    setShowModal(true);
  };

  const handleIrAlPanelUsuario = () => navigate("/panel-usuario");

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <img
            src="/img/logo/logo.PNG"
            alt="Logo"
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="user-actions">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="icono-carrito"
              onClick={() => setShowCarritoModal(true)}
            />
            <span className="carrito-counter">{contarProductosCarrito()}</span>
            <img
              src={
                usuario?.profile_image
                  ? `http://localhost:8000/${usuario.profile_image}`
                  : "/img/usuario/principal.png"
              }
              alt="Perfil"
              className="icono-usuario"
              onClick={handleIrAlPanelUsuario}
              onError={(e) => {
                e.target.src = "/img/usuario/principal.png";
              }}
              title="Ir a tu panel"
            />
            <button className="btn btn-danger btn-sm" onClick={handleCerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>
        <nav className="categorias-menu">
          <div className="categorias-container">
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
      </header>

      <main className="productos-container">
        <div className="productos-lista">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <div key={producto.id} className="producto-card">
                <img
                  src={`/${producto.img}`}
                  className="card-img-top"
                  alt={producto.nombre}
                />
                <div className="card-body">
                  <h5 className="card-title">{producto.nombre}</h5>
                  <p className="card-text">{producto.descripcion}</p>
                  <h6 className="card-price">{producto.precio}€</h6>
                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleAñadirAlCarrito(producto)}
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-100">No se encontraron productos.</p>
          )}
        </div>
      </main>

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
                  src={`/${productoSeleccionado.img}`}
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
