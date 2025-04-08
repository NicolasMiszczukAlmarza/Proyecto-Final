import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const Facturas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correo, carrito, total, descuentoAplicado } = location.state;

  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = 80;
    const imgHeight = 40;
    const xPos = (pageWidth - imgWidth) / 2;
    doc.addImage('public/img/logo/logo.jpg', 'JPEG', xPos, 10, imgWidth, imgHeight);
    doc.setFont('Helvetica', 'bold');
    doc.text('Factura de Compra', pageWidth / 2, 60, { align: 'center' });
    doc.text('Correo: ', 20, 80);
    doc.setFont('Helvetica', 'normal');
    doc.text(correo, 50, 80);
    doc.setFont('Helvetica', 'bold');
    doc.text('Detalles del Pedido:', 20, 90);

    carrito.forEach((producto, index) => {
      const precioProducto = producto.cantidad * producto.precio;
      doc.setFont('Helvetica', 'normal');
      doc.text(`- ${producto.nombre} (x${producto.cantidad}): ${precioProducto.toFixed(2)}€`, 20, 100 + index * 10);
    });

    if (descuentoAplicado > 0) {
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(0, 128, 0); // Color verde
      doc.text(`Descuento aplicado: -${descuentoAplicado.toFixed(2)}€`, 20, 110 + carrito.length * 10);
      doc.setTextColor(0, 0, 0); // Reset color
    }

    doc.setFont('Helvetica', 'bold');
    doc.text(`Total: ${total.toFixed(2)}€`, 20, 120 + carrito.length * 10);
    doc.save('factura.pdf');
  };

  return (
    <div className="factura-container">
      <img src="public/img/logo/logo.jpg" alt="Logo" className="logo" style={{ width: '250px', height: '175px' }} />
      <h1>Factura</h1>
      <p><strong>Correo del usuario:</strong> {correo}</p>
      <br></br>
      <table className="factura-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Producto</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Cantidad</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Precio Unitario</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Precio Total</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((producto, index) => {
            const precioProducto = producto.cantidad * producto.precio;
            return (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{producto.nombre}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{producto.cantidad}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{producto.precio.toFixed(2)}€</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{precioProducto.toFixed(2)}€</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br></br>
      {descuentoAplicado > 0 && (
        <h3 style={{ color: 'green' }}>Descuento aplicado: -{descuentoAplicado.toFixed(2)}€</h3>
      )}
      <h3>Total: {total.toFixed(2)}€</h3>
      <button onClick={generarPDF} className="btn-pdf">Generar PDF</button>
      <button onClick={() => navigate('/carrito')} className="btn-volver">Volver al Carrito</button>
    </div>
  );
};

export default Facturas;