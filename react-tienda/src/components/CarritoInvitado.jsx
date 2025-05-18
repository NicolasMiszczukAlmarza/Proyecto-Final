import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categorias } from "../data/categorias";
import { productos } from "../data/productos";
import "./CarritoInvitado.css";

const CarritoInvitado = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const categoriasMenuList = useMemo(
    () => categorias.filter((c) => c.nombre.toLowerCase() !== "mas vendida"),
    []
  );

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const cat = categorias.find((c) => c.id === p.id_categoria);
      const okCat = categoriaSeleccionada
        ? cat?.nombre === categoriaSeleccionada
        : true;
      const okSearch = busqueda
        ? p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
        : true;
      return okCat && okSearch;
    });
  }, [categoriaSeleccionada, busqueda]);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <img
              src="/img/logo/logo.jpg"
              alt="Logo"
              className="logo"
              onClick={() => navigate("/")}
              onError={(e) => (e.currentTarget.src = "/img/logo/nico.PNG")}
            />
          </div>
          <div className="header-center">
            <input
              type="text"
              className="search-bar"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="header-right">
            <button className="btn-login" onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </header>

      <nav className="categorias-menu">
        <div className="categorias-container">
          {categoriasMenuList.map((c) => (
            <span
              key={c.id}
              className={`categoria ${
                c.nombre === categoriaSeleccionada ? "selected" : ""
              }`}
              onClick={() =>
                setCategoriaSeleccionada((prev) =>
                  prev === c.nombre ? null : c.nombre
                )
              }
            >
              {c.nombre}
            </span>
          ))}
        </div>
      </nav>

      <main className="productos-container">
        <h3 className="productos-titulo">
          {busqueda
            ? "Resultados de búsqueda"
            : categoriaSeleccionada
            ? `Productos de ${categoriaSeleccionada}`
            : "Todos los productos"}
        </h3>

        <div className="productos-lista">
          {productosFiltrados.length ? (
            productosFiltrados.map((p) => (
              <div key={p.id} className="producto-card">
                <img
                  src={p.img}
                  alt={p.nombre}
                  className="card-img-top"
                  onError={(e) => (e.currentTarget.src = "/img/no-image.png")}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.nombre}</h5>
                  <p className="card-text">{p.descripcion}</p>
                  <h6 className="card-price">{p.precio}€</h6>
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
