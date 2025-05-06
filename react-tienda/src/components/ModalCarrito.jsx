import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./ModalCarrito.css";

/* ------------ Backend base ------------- */
const BACKEND = "http://localhost:8000";

/* ---- Convierte la ruta almacenada en BD a una URL válida ---- */
const getImagenUrl = (ruta) => {
  if (!ruta) return "/img/no-image.png";
  if (/^https?:\/\//i.test(ruta)) return ruta;

  const clean = ruta.startsWith("/") ? ruta.slice(1) : ruta;
  return clean.startsWith("uploads")
    ? `${BACKEND}/${encodeURI(clean)}`
    : `/${encodeURI(clean)}`;
};

const ModalCarrito = ({
  carrito,
  onCerrar,
  onEliminarProducto,
  onActualizarCantidad,
}) => {
  const navigate = useNavigate();

  const [cantidad, setCantidad] = useState({});
  const [totalConIva, setTotalConIva] = useState(0);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [mensajeDescuento, setMensajeDescuento] = useState("");

  /* ---------------- CÁLCULOS DE TOTAL ---------------- */
  useEffect(() => {
    const base = carrito.reduce(
      (t, p) => t + p.precio * (cantidad[p.id] || p.cantidad),
      0
    );
    const conIva = base * 1.21;
    if (conIva >= 1500) {
      const desc = conIva * 0.3;
      setDescuentoAplicado(desc);
      setTotalFinal(conIva - desc);
      setMensajeDescuento("Descuento del 30 % aplicado automáticamente");
    } else {
      const falta = 1500 - conIva;
      setDescuentoAplicado(0);
      setTotalFinal(conIva);
      setMensajeDescuento(
        `Te faltan ${falta.toFixed(2)} € para el 30 % de descuento`
      );
    }
    setTotalConIva(conIva);
  }, [carrito, cantidad]);

  const realizarPedido = () =>
    navigate("/pago", { state: { totalFinal, carrito, descuentoAplicado } });

  /* ------------------- UI ------------------- */
  return (
    <div
      className="modal fade show"
      style={{ display: "block", position: "fixed", top: 0, right: 0, zIndex: 1050 }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-center">Tu Carrito</h5>
            <button type="button" className="btn-close" onClick={onCerrar}></button>
          </div>

          <div className="modal-body">
            {mensajeDescuento && (
              <div className="alert alert-info text-center mb-3">
                {mensajeDescuento}
              </div>
            )}

            {carrito.length === 0 ? (
              <p>No tienes productos en el carrito.</p>
            ) : (
              <>
                {carrito.map((p) => (
                  <div
                    key={p.id}
                    className="d-flex align-items-center mb-3 border-bottom pb-2"
                  >
                    <img
                      src={getImagenUrl(p.img)}
                      alt={p.nombre}
                      className="img-thumbnail"
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/img/no-image.png";
                      }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6>{p.nombre}</h6>
                      <p className="mb-1">{p.precio.toFixed(2)} €</p>

                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={cantidad[p.id] || p.cantidad}
                        onChange={(e) => {
                          const nueva = Math.min(5, Math.max(1, +e.target.value));
                          setCantidad((prev) => ({ ...prev, [p.id]: nueva }));
                          onActualizarCantidad(p.id, nueva);
                        }}
                        className="form-control w-50"
                      />
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => onEliminarProducto(p.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}

                <div className="mt-3 d-flex justify-content-between">
                  <h6>Total con IVA:</h6>
                  <h6>{totalConIva.toFixed(2)} €</h6>
                </div>

                {descuentoAplicado > 0 && (
                  <div className="mt-3 d-flex justify-content-between text-success">
                    <h6>Descuento aplicado:</h6>
                    <h6>-{descuentoAplicado.toFixed(2)} €</h6>
                  </div>
                )}

                <div className="mt-3 d-flex justify-content-between">
                  <h6>Precio final:</h6>
                  <h6>{totalFinal.toFixed(2)} €</h6>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-primary w-100 mt-2" onClick={realizarPedido}>
              Realizar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalCarrito.propTypes = {
  carrito: PropTypes.array.isRequired,
  onCerrar: PropTypes.func.isRequired,
  onEliminarProducto: PropTypes.func.isRequired,
  onActualizarCantidad: PropTypes.func.isRequired,
};

export default ModalCarrito;
