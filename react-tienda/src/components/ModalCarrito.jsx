import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; 
import './ModalCarrito.css';

const ModalCarrito = ({ carrito, onCerrar, onEliminarProducto, onActualizarCantidad }) => {
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState({});
  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [totalSinIva, setTotalSinIva] = useState(0);
  const [totalConIva, setTotalConIva] = useState(0);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [mensajeDescuento, setMensajeDescuento] = useState("");

  const generarCodigoDescuento = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    let codigo = '';
    for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
      codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    for (let i = 0; i < 2; i++) {
      codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    setCodigoGenerado(codigo);
    return codigo;
  };

  useEffect(() => {
    generarCodigoDescuento();
  }, []);

  useEffect(() => {
    const total = carrito.reduce(
      (total, producto) => total + producto.precio * (cantidad[producto.id] || producto.cantidad),
      0
    );
    const totalConIvaCalculado = total * 1.21;

    if (totalConIvaCalculado >= 1500) {
      const descuento = totalConIvaCalculado * 0.30;
      setDescuentoAplicado(descuento);
      setTotalFinal(totalConIvaCalculado - descuento);
      setMensajeDescuento("Descuento del 30% aplicado automáticamente");
    } else {
      const faltante = 1500 - totalConIvaCalculado;
      setDescuentoAplicado(0);
      setTotalFinal(totalConIvaCalculado);
      setMensajeDescuento(`Te falta ${faltante.toFixed(2)}€ para llegar al descuento del 30%`);
    }

    setTotalSinIva(total);
    setTotalConIva(totalConIvaCalculado);
  }, [carrito, cantidad]);

  const realizarPedido = () => {
    navigate("/pago", { state: { totalFinal, carrito } });
  };

  return (
    <div className="modal fade show" style={{ display: "block", position: "fixed", top: 0, right: 0, zIndex: 1050 }}>
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
              <div>
                {carrito.map((producto) => (
                  <div key={producto.id} className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <img
                      src={producto.img}
                      alt={producto.nombre}
                      className="img-thumbnail"
                      style={{ width: 80, height: 80, objectFit: 'cover' }}
                      onError={(e) => e.target.src = "/imagenes/default.jpg"}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6>{producto.nombre}</h6>
                      <p className="mb-1">{producto.precio.toFixed(2)}€</p>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={cantidad[producto.id] || producto.cantidad}
                        onChange={(e) => {
                          const nuevaCantidad = Math.min(5, parseInt(e.target.value, 10));
                          setCantidad(prevCantidad => ({
                            ...prevCantidad,
                            [producto.id]: nuevaCantidad
                          }));
                          onActualizarCantidad(producto.id, nuevaCantidad);
                        }}
                        className="form-control w-50"
                      />
                    </div>
                    <button className="btn btn-danger" onClick={() => onEliminarProducto(producto.id)}>
                      Eliminar
                    </button>
                  </div>
                ))}
                <div className="mt-3 d-flex justify-content-between">
                  <h6>Total con IVA:</h6>
                  <h6>{totalConIva.toFixed(2)}€</h6>
                </div>
                {descuentoAplicado > 0 && (
                  <div className="mt-3 d-flex justify-content-between text-success">
                    <h6>Descuento aplicado:</h6>
                    <h6>-{descuentoAplicado.toFixed(2)}€</h6>
                  </div>
                )}
                <div className="mt-3 d-flex justify-content-between">
                  <h6>Precio Final:</h6>
                  <h6>{totalFinal.toFixed(2)}€</h6>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary w-100 mt-2" onClick={realizarPedido}>
              Realizar Pedido
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
