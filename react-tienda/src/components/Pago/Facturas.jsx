import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './Facturas.css';

const Facturas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correo, carrito, total, descuentoAplicado } = location.state;

  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Logo
    const imgWidth = 50;
    const imgHeight = 25;
    const xPos = (pageWidth - imgWidth) / 2;
    doc.addImage('public/img/logo/logo.jpg', 'JPEG', xPos, 10, imgWidth, imgHeight);
  
    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Factura de Compra', pageWidth / 2, 45, { align: 'center' });
  
    // Línea divisoria
    doc.setDrawColor(0);
    doc.line(20, 50, pageWidth - 20, 50);
  
    // Datos del cliente
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Correo del cliente: ${correo}`, 20, 60);
  
    // Tabla de productos
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle de productos:', 20, 75);
  
    let startY = 85;
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(240, 240, 240);
    doc.rect(20, startY, pageWidth - 40, 10, 'F');
    doc.text('Producto', 22, startY + 7);
    doc.text('Cant.', pageWidth / 2 - 20, startY + 7);
    doc.text('P. Unit.', pageWidth / 2 + 10, startY + 7);
    doc.text('Total', pageWidth - 45, startY + 7);
  
    startY += 12;
  
    carrito.forEach((producto, index) => {
      const y = startY + index * 10;
      const precioProducto = producto.cantidad * producto.precio;
      doc.text(producto.nombre, 22, y);
      doc.text(`${producto.cantidad}`, pageWidth / 2 - 20, y);
      doc.text(`${producto.precio.toFixed(2)}€`, pageWidth / 2 + 10, y);
      doc.text(`${precioProducto.toFixed(2)}€`, pageWidth - 45, y);
    });
  
    let finalY = startY + carrito.length * 10 + 10;
  
    if (descuentoAplicado > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 128, 0);
      doc.text(`Descuento aplicado: -${descuentoAplicado.toFixed(2)}€`, 20, finalY);
      finalY += 10;
      doc.setTextColor(0, 0, 0);
    }
  
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total final: ${total.toFixed(2)}€`, 20, finalY);
  
    doc.save('factura.pdf');
  };
  

  return (
    <div className="factura-container">
      <img src="public/img/logo/logo.png" alt="Logo" className="logo" />
      <h1>Factura</h1>
      <p><strong>Correo del usuario:</strong> {correo}</p>

      <table className="factura-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Precio Total</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((producto, index) => {
            const precioProducto = producto.cantidad * producto.precio;
            return (
              <tr key={index}>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.precio.toFixed(2)}€</td>
                <td>{precioProducto.toFixed(2)}€</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {descuentoAplicado > 0 && (
        <h3 className="descuento">Descuento aplicado: -{descuentoAplicado.toFixed(2)}€</h3>
      )}
      <h3 className="total">Total: {total.toFixed(2)}€</h3>

      <div className="factura-buttons">
        <button onClick={generarPDF} className="btn btn-pdf">Generar PDF</button>
        <button onClick={() => navigate('/carrito')} className="btn btn-volver">Volver al Carrito</button>
      </div>
    </div>
  );
};

export default Facturas;