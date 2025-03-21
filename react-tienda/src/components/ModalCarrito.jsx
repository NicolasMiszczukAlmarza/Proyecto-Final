import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import './ModalCarrito.css';  // Asegúrate de que el archivo CSS esté importado

const ModalCarrito = ({ carrito, onCerrar, onEliminarProducto, onActualizarCantidad }) => {
    const [cantidad, setCantidad] = useState({});
    const [codigoDescuento, setCodigoDescuento] = useState('');
    const [codigoGenerado, setCodigoGenerado] = useState('');
    const [totalSinIva, setTotalSinIva] = useState(0);  // Total sin IVA
    const [totalConIva, setTotalConIva] = useState(0);  // Total con IVA
    const [descuentoAplicado, setDescuentoAplicado] = useState(0);  // Descuento aplicado
    const [totalConDescuento, setTotalConDescuento] = useState(0);  // Total con descuento
    const [descuentoYaAplicado, setDescuentoYaAplicado] = useState(false);  // Para asegurarse de que el descuento se aplique solo una vez

    const calcularTotal = () => {
        return carrito.reduce(
            (total, producto) => total + producto.precio * (cantidad[producto.id] || producto.cantidad),
            0
        );
    };

    const calcularTotalConIva = (totalSinIva) => {
        return totalSinIva * 1.21; // Aplicamos el 21% de IVA
    };

    const generarCodigoDescuento = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numeros = '0123456789';
        let codigo = '';
        for (let i = 0; i < 5; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        for (let i = 0; i < 2; i++) {
            codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
        }
        setCodigoGenerado(codigo);
        setCodigoDescuento(codigo);  // Se asigna el código generado al campo de texto
    };

    const handleCantidadChange = (productoId, newCantidad) => {
        if (newCantidad >= 1 && newCantidad <= 5) {
            setCantidad((prev) => ({ ...prev, [productoId]: newCantidad }));
            onActualizarCantidad(productoId, newCantidad);  // Actualiza la cantidad
        }
    };

    const vaciarCarrito = () => {
        carrito.forEach((producto) => {
            onEliminarProducto(producto.id);
        });
    };

    useEffect(() => {
        const total = calcularTotal();
        const totalSinIvaCalculado = total;
        const totalConIvaCalculado = calcularTotalConIva(total);

        setTotalSinIva(totalSinIvaCalculado);  // Total sin IVA
        setTotalConIva(totalConIvaCalculado);  // Total con IVA

        setTotalConDescuento(totalConIvaCalculado);  // Inicializamos el total con descuento igual al total con IVA

        if (totalConIvaCalculado > 1500 && !descuentoYaAplicado) {
            generarCodigoDescuento(); // Generamos un código si el total con IVA es mayor a 1500€
        }
    }, [carrito, cantidad, descuentoYaAplicado]);

    const aplicarDescuento = () => {
        if (codigoDescuento === codigoGenerado && !descuentoYaAplicado) {
            const descuento = totalConIva * 0.30; // 30% de descuento
            const totalFinalConDescuento = totalConIva - descuento;  // Total con descuento
            setDescuentoAplicado(descuento);  // Guardamos el valor del descuento
            setTotalConDescuento(totalFinalConDescuento);  // Actualizamos el total con descuento correctamente
            setDescuentoYaAplicado(true);  // Marcar que el descuento ya ha sido aplicado
        } else if (descuentoYaAplicado) {
            alert("El descuento ya ha sido aplicado.");
        } else {
            alert("Código de descuento inválido");
        }
    };

    return (
        <div
            className="modal fade show"
            style={{
                display: "block",
                position: "fixed",
                top: 0,
                right: 0,
                zIndex: 1050,
            }}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-center">
                            Tu Carrito
                        </h5>
                        <button type="button" className="btn-close" onClick={onCerrar}></button>
                    </div>
                    <div className="modal-body">
                        {carrito.length === 0 ? (
                            <p>No tienes productos en el carrito.</p>
                        ) : (
                            <div>
                                <ul className="list-group">
                                    {carrito.map((producto) => (
                                        <li
                                            key={producto.id}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={producto.img}
                                                    alt={producto.nombre}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        objectFit: "cover",
                                                        marginRight: "10px",
                                                    }}
                                                />
                                                <div>
                                                    <h6 className="producto-nombre">{producto.nombre}</h6>
                                                    <p>{producto.descripcion}</p>
                                                    <div className="d-flex align-items-center">
                                                        <button
                                                            className="btn btn-decrement"
                                                            onClick={() =>
                                                                handleCantidadChange(
                                                                    producto.id,
                                                                    (cantidad[producto.id] || producto.cantidad) - 1
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={cantidad[producto.id] || producto.cantidad}
                                                            onChange={(e) =>
                                                                handleCantidadChange(
                                                                    producto.id,
                                                                    parseInt(e.target.value, 10)
                                                                )
                                                            }
                                                            min="1"
                                                            max="5"
                                                            className="form-control"
                                                            style={{
                                                                width: "60px",
                                                                textAlign: "center",
                                                            }}
                                                            readOnly
                                                        />
                                                        <button
                                                            className="btn btn-increment"
                                                            onClick={() =>
                                                                handleCantidadChange(
                                                                    producto.id,
                                                                    (cantidad[producto.id] || producto.cantidad) + 1
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="badge bg-primary rounded-pill">
                                                {(producto.precio * (cantidad[producto.id] || producto.cantidad)).toFixed(2)}€
                                            </span>
                                            <button
                                                className="btn btn-danger btn-sm ms-2"
                                                onClick={() => onEliminarProducto(producto.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Mostrar los totales */}
                                <div className="mt-3 d-flex justify-content-between">
                                    <h6>Total sin IVA:</h6>
                                    <h6>{totalSinIva.toFixed(2)}€</h6>
                                </div>
                                <div className="mt-3 d-flex justify-content-between">
                                    <h6>Total con IVA (antes del descuento):</h6>
                                    <h6>{totalConIva.toFixed(2)}€</h6>
                                </div>
                                {descuentoAplicado > 0 && (
                                    <div className="mt-3 d-flex justify-content-between" style={{ color: "red" }}>
                                        <h6>Descuento aplicado:</h6>
                                        <h6>-{descuentoAplicado.toFixed(2)}€</h6>
                                    </div>
                                )}
                                <div className="mt-3 d-flex justify-content-between">
                                    <h6>Total final con descuento:</h6>
                                    <h6>{totalConDescuento.toFixed(2)}€</h6>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        {totalConIva > 1500 && !descuentoYaAplicado && (
                            <div className="w-100">
                                <input
                                    type="text"
                                    value={codigoDescuento}
                                    onChange={(e) => setCodigoDescuento(e.target.value)}
                                    placeholder="Introduce código de descuento"
                                    className="form-control"
                                />
                                <button
                                    type="button"
                                    className="btn btn-success mt-2"
                                    onClick={aplicarDescuento}
                                >
                                    Aplicar descuento
                                </button>
                            </div>
                        )}
                        <div className="w-100">
                            <button
                                type="button"
                                className="btn btn-danger w-100"
                                onClick={vaciarCarrito}
                            >
                                Vaciar el carrito
                            </button>
                        </div>
                        <div className="w-100 mt-2">
                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={() => alert("Proceder al pago...")}
                                style={{
                                    backgroundColor: "#6f42c1",
                                    borderColor: "#6f42c1",
                                }}
                            >
                                Proceder al pago
                            </button>
                        </div>
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
