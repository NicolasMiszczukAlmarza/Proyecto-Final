import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { categorias } from "../data/categorias";
import ModalCarrito from "./ModalCarrito";
import "./Carrito.css";

/* ------------ CONFIGURA TU BACKEND ------------- */
const BACKEND = "http://localhost:8000";   // ajústalo si cambias de host/puerto

const getImagenUrl = (ruta) => {
  /* 1️⃣  Si no existe o no es string → imagen por defecto */
  if (typeof ruta !== "string" || ruta.trim() === "") {
    return "/img/no-image.png";
  }

  /* 2️⃣  Ya es URL absoluta (http o https) */
  if (/^https?:\/\//i.test(ruta)) {
    return ruta;
  }

  /* 3️⃣  Limpiar posible slash inicial */
  const clean = ruta.startsWith("/") ? ruta.slice(1) : ruta;

  /* 4️⃣  Rutas que salen de Laravel ⇒ public/uploads */
  if (clean.startsWith("uploads")) {
    return `${BACKEND}/${encodeURI(clean)}`;
  }

  /* 5️⃣  Cualquier otra cosa (asset dentro de React) */
  return `/${encodeURI(clean)}`;
};


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

  /* ---------------- EFECTOS ----------------- */
  useEffect(() => {
    if (!usuario) navigate("/login");
  }, [usuario, navigate]);

  useEffect(() => {
    fetch(`${BACKEND}/productos`, { credentials: "include" })
      .then((r) => r.json())
      .then(setProductos)
      .catch(() => setProductos([]));
  }, []);

  /* -------------- HANDLERS ------------------ */
  const handleCerrarSesion = async () => {
    try {
      const r = await fetch(`${BACKEND}/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (r.ok) {
        localStorage.removeItem("usuario");
        navigate("/login");
      } else alert("Error al cerrar sesión en el servidor.");
    } catch {
      alert("Error al cerrar sesión.");
    }
  };

  const handleCategoriaClick = (nombre) => {
    setCategoriaSeleccionada((prev) => (prev === nombre ? null : nombre));
    setSearchTerm("");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCategoriaSeleccionada(null);
  };

  /* ----------- FILTRADO ------------------ */
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const cat = categorias.find((c) => c.id === p.id_categoria);
      const okCat = categoriaSeleccionada
        ? cat?.nombre.toLowerCase() === categoriaSeleccionada.toLowerCase()
        : true;
      const okSearch =
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      return okCat && okSearch;
    });
  }, [productos, categoriaSeleccionada, searchTerm]);

  /* ----------- CARRITO ------------------ */
  const agregarAlCarrito = () => {
    setCarrito((prev) => {
      const ex = prev.find((i) => i.id === productoSeleccionado.id);
      if (ex) {
        if (ex.cantidad + cantidad <= 5) {
          return prev.map((i) =>
            i.id === ex.id ? { ...i, cantidad: i.cantidad + cantidad } : i
          );
        }
        alert("Máximo 5 unidades por producto.");
        return prev;
      }
      return [...prev, { ...productoSeleccionado, cantidad }];
    });
    setShowModal(false);
  };

  const eliminarProductoCarrito = (id) =>
    setCarrito((prev) => prev.filter((i) => i.id !== id));

  const actualizarCantidad = (id, nueva) =>
    setCarrito((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad: nueva } : i))
    );

  const totalItems = carrito.reduce((a, i) => a + i.cantidad, 0);

  /* -------------- UI ------------------ */
  return (
    <>
      {/* ---------- Header ---------- */}
      <header className="header">
        <div className="header-inner">
          <img
            src="/img/logo/logo.PNG"
            alt="Logo"
            className="logo"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
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
            <span className="carrito-counter">{totalItems}</span>

            <img
              src={
                usuario?.profile_image
                  ? getImagenUrl(usuario.profile_image)
                  : "/img/usuario/principal.png"
              }
              alt="Perfil"
              className="icono-usuario"
              title="Ir a tu panel"
              onClick={() => navigate("/panel-usuario")}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/img/usuario/principal.png";
              }}
            />

            <button className="btn btn-danger btn-sm" onClick={handleCerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* ---------- Categorías ---------- */}
        <nav className="categorias-menu">
          <div className="categorias-container">
            {categorias.map((c) => (
              <span
                key={c.id}
                className={`categoria ${
                  categoriaSeleccionada === c.nombre ? "selected" : ""
                }`}
                onClick={() => handleCategoriaClick(c.nombre)}
              >
                {c.nombre}
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* ---------- Grid productos ---------- */}
      <main className="productos-container">
        <div className="productos-lista">
          {productosFiltrados.length ? (
            productosFiltrados.map((p) => (
              <div key={p.id} className="producto-card">
                <img
                  src={getImagenUrl(p.img)}
                  className="card-img-top"
                  alt={p.nombre}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/img/no-image.png";
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.nombre}</h5>
                  <p className="card-text">{p.descripcion}</p>
                  <h6 className="card-price">{p.precio}€</h6>
                  <button
                    className="btn btn-success w-100"
                    onClick={() => {
                      setProductoSeleccionado(p);
                      setCantidad(1);
                      setShowModal(true);
                    }}
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

      {/* ---------- Modal cantidad ---------- */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Selecciona la cantidad</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body text-center">
                <img
                  src={getImagenUrl(productoSeleccionado.img)}
                  alt={productoSeleccionado.nombre}
                  className="img-fluid"
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/img/no-image.png";
                  }}
                />
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    min={1}
                    max={5}
                    readOnly
                    className="form-control mx-2 text-center"
                    style={{ width: 60 }}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => setCantidad((c) => Math.min(5, c + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={agregarAlCarrito}>
                  Agregar al carrito
                </button>
                <button
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

      {/* ---------- Modal carrito ---------- */}
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
