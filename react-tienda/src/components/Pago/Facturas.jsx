import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const Facturas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correo, carrito, total } = location.state;

  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = 80;
    const imgHeight = 40;
    const xPos = (pageWidth - imgWidth) / 2;
    doc.addImage('public/img/logo/logo.jpg', 'JPEG', xPos, 10, imgWidth, imgHeight); // Imagen centrada
    doc.setFont('Helvetica', 'bold');
    doc.text('Factura de Compra', pageWidth / 2, 60, { align: 'center' });
    doc.text('Correo: ', 20, 80);
    doc.setFont('Helvetica', 'normal');
    doc.text(correo, 50, 80); // Espacio mayor después de 'Correo:'
    doc.setFont('Helvetica', 'bold');
    doc.text('Detalles del Pedido:', 20, 90);

    carrito.forEach((producto, index) => {
      doc.setFont('Helvetica', 'normal');
      doc.text(`- ${producto.nombre} (x${producto.cantidad}): ${producto.precio}€`, 20, 100 + index * 10);
    });

    doc.setFont('Helvetica', 'bold');
    doc.text(`Total: ${total}€`, 20, 110 + carrito.length * 10);
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
            <th style={{ border: '1px solid black', padding: '8px' }}>Precio</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((producto, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{producto.nombre}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{producto.cantidad}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{producto.precio}€</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <h3>Total: {total}€</h3>
      <button onClick={generarPDF} className="btn-pdf">Generar PDF</button>
      <button onClick={() => navigate('/carrito')} className="btn-volver">Volver al Carrito</button>
    </div>
  );
};

export default Facturas;
