import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./ModalCarrito.css";

const BACKEND = "http://localhost:8000";

const getImagenUrl = (ruta) => {
  if (!ruta) return "/img/no-image.png";
  if (/^https?:\/\//i.test(ruta)) return ruta;

  const clean = ruta.startsWith("/") ? ruta.slice(1) : ruta;
  return clean.startsWith("uploads")
    ? `${BACKEND}/${encodeURI(clean)}`
    : `/${encodeURI(clean)}`;
};

const ModalCarrito = ({ carrito, onCerrar, onEliminarProducto, onActualizarCantidad }) => {
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState({});
  const [totalConIva, setTotalConIva] = useState(0);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [mensajeDescuento, setMensajeDescuento] = useState("");

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

  const actualizarCantidad = (id, delta) => {
    const nueva = Math.min(5, Math.max(1, (cantidad[id] || 1) + delta));
    setCantidad((prev) => ({ ...prev, [id]: nueva }));
    onActualizarCantidad(id, nueva);
  };

  const realizarPedido = () =>
    navigate("/pago", { state: { totalFinal, carrito, descuentoAplicado } });

  return (
    <div className="modal fade show" style={{ display: "block", position: "fixed", top: 0, right: 0, zIndex: 1050 }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tu Carrito</h5>
            <button type="button" className="btn-close" onClick={onCerrar}></button>
          </div>

          <div className="modal-body">
            {mensajeDescuento && (
              <div className="alert alert-info text-center mb-3">{mensajeDescuento}</div>
            )}

            {carrito.length === 0 ? (
              <p>No tienes productos en el carrito.</p>
            ) : (
              <>
                {carrito.map((p) => (
                  <div key={p.id} className="carrito-producto">
                    <img
                      src={getImagenUrl(p.img)}
                      alt={p.nombre}
                      className="img-thumbnail"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/img/no-image.png";
                      }}
                    />
                    <div className="producto-info">
                      <h6 className="producto-nombre">{p.nombre}</h6>
                      <p>{p.precio.toFixed(2)} €</p>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn-decrement" onClick={() => actualizarCantidad(p.id, -1)}>-</button>
                        <input
                          type="text"
                          readOnly
                          value={cantidad[p.id] || p.cantidad}
                          className="form-control text-center cantidad-input"
                        />
                        <button className="btn-increment" onClick={() => actualizarCantidad(p.id, 1)}>+</button>
                      </div>
                    </div>
                    <button className="btn btn-eliminar" onClick={() => onEliminarProducto(p.id)}>
                      Eliminar
                    </button>
                  </div>
                ))}

                <div className="resumen-precio">
                  <div className="d-flex justify-content-between">
                    <span>Total con IVA:</span>
                    <span>{totalConIva.toFixed(2)} €</span>
                  </div>
                  {descuentoAplicado > 0 && (
                    <div className="d-flex justify-content-between text-success">
                      <span>Descuento aplicado:</span>
                      <span>-{descuentoAplicado.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between precio-final">
                    <span>Precio final:</span>
                    <span>{totalFinal.toFixed(2)} €</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-primary w-100" onClick={realizarPedido}>
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