import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import './ModalCarrito.css';

const ModalCarrito = ({ carrito, onCerrar, onEliminarProducto, onActualizarCantidad }) => {
    const [cantidad, setCantidad] = useState({});
    const [codigoDescuento, setCodigoDescuento] = useState('');
    const [codigoGenerado, setCodigoGenerado] = useState('');
    const [totalSinIva, setTotalSinIva] = useState(0);
    const [totalConIva, setTotalConIva] = useState(0);
    const [descuentoAplicado, setDescuentoAplicado] = useState(0);
    const [totalFinal, setTotalFinal] = useState(0);
    const [descuentoYaAplicado, setDescuentoYaAplicado] = useState(false);
    const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
    const [mensajeNotificacion, setMensajeNotificacion] = useState('');

    useEffect(() => {
        // Actualiza el total con el estado de las cantidades actuales.
        const total = carrito.reduce(
            (total, producto) => total + producto.precio * (cantidad[producto.id] || producto.cantidad),
            0
        );
        const totalConIvaCalculado = total * 1.21;
        
        setTotalSinIva(total);
        setTotalConIva(totalConIvaCalculado);
        setTotalFinal(totalConIvaCalculado - descuentoAplicado);
    }, [carrito, cantidad, descuentoAplicado]);

    const actualizarCantidad = (producto, nuevaCantidad) => {
        if (nuevaCantidad < 1) return; // Aseguramos que la cantidad no sea menor que 1

        if (nuevaCantidad > 5) {
            setMensajeNotificacion('No puedes agregar más de 5 productos.');
            setMostrarNotificacion(true);
            return; // Detenemos la ejecución para no actualizar la cantidad si excede el límite
        }

        // Reemplazamos la cantidad en lugar de sumarla
        setCantidad(prevCantidad => {
            return { ...prevCantidad, [producto.id]: nuevaCantidad };
        });

        // Actualizamos la cantidad en el carrito
        onActualizarCantidad(producto.id, nuevaCantidad);
    };

    const generarCodigoDescuento = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numeros = '0123456789';
        let codigo = '';
        for (let i = 0; i < 3; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        for (let i = 0; i < 2; i++) {
            codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
        }
        setCodigoGenerado(codigo);
        setCodigoDescuento(codigo);
    };

    const aplicarDescuento = () => {
        if (codigoDescuento === codigoGenerado && !descuentoYaAplicado) {
            const descuento = totalConIva * 0.30;
            setDescuentoAplicado(descuento);
            setTotalFinal(totalConIva - descuento);
            setDescuentoYaAplicado(true);
        } else {
            setMensajeNotificacion(descuentoYaAplicado ? "El descuento ya ha sido aplicado." : "Código de descuento inválido");
            setMostrarNotificacion(true);
        }
    };

    const cerrarNotificacion = () => {
        setMostrarNotificacion(false);
    };

    const vaciarCarrito = () => {
        carrito.forEach((producto) => onEliminarProducto(producto.id));
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
                                                value={cantidad[producto.id] || producto.cantidad} 
                                                onChange={(e) => actualizarCantidad(producto, parseInt(e.target.value, 10))} 
                                                className="form-control w-50" 
                                            />
                                        </div>
                                        <button className="btn btn-danger" onClick={() => onEliminarProducto(producto.id)}>Eliminar</button>
                                    </div>
                                ))}
                                <div className="mt-3 d-flex justify-content-between">
                                    <h6>Total con IVA:</h6>
                                    <h6>{totalConIva.toFixed(2)}€</h6>
                                </div>
                                {descuentoAplicado > 0 && (
                                    <div className="mt-3 d-flex justify-content-between text-danger">
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
                        {totalConIva > 1500 && !descuentoYaAplicado && (
                            <div className="w-100">
                                <button className="btn btn-warning w-100" onClick={generarCodigoDescuento}>Generar Código de Descuento</button>
                                <input type="text" value={codigoDescuento} onChange={(e) => setCodigoDescuento(e.target.value)} className="form-control mt-2" />
                                <button className="btn btn-success mt-2 w-100" onClick={aplicarDescuento}>Aplicar descuento</button>
                            </div>
                        )}
                        <button className="btn btn-danger w-100" onClick={vaciarCarrito}>Vaciar Carrito</button>
                        <button className="btn btn-primary w-100 mt-2" onClick={() => alert("Realizando pedido...")}>Realizar Pedido</button>
                    </div>
                </div>
            </div>

            {/* Notificación directamente en el modal */}
            {mostrarNotificacion && (
                <div style={{
                    position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    color: 'white', padding: '10px', borderRadius: '5px', zIndex: 2000
                }}>
                    <span>{mensajeNotificacion}</span>
                    <button onClick={cerrarNotificacion} style={{
                        background: 'transparent', border: 'none', color: 'white', fontSize: '16px', marginLeft: '10px'
                    }}>X</button>
                </div>
            )}
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
