import React from 'react';
import { useLocation } from 'react-router-dom';

const Pago = () => {
  const location = useLocation();
  const { totalFinal } = location.state || { totalFinal: 0 };  // Obtener el totalFinal desde el state

  return (
    <div>
      <h1>Formulario de Pago</h1>
      <form>
        <div>
          <label htmlFor="monto">Cantidad a pagar:</label>
          <input
            type="text"
            id="monto"
            value={`${totalFinal.toFixed(2)}€`} // Mostrar el monto final, pero no editable
            readOnly
          />
        </div>

        <div>
          <label htmlFor="nombre">Nombre en la tarjeta:</label>
          <input type="text" id="nombre" required />
        </div>

        <div>
          <label htmlFor="tarjeta">Número de tarjeta:</label>
          <input type="text" id="tarjeta" required />
        </div>

        <div>
          <label htmlFor="fecha">Fecha de expiración:</label>
          <input type="month" id="fecha" required />
        </div>

        <div>
          <label htmlFor="codigoSeguridad">Código de seguridad (CVV):</label>
          <input type="text" id="codigoSeguridad" required />
        </div>

        <button type="submit">Realizar Pago</button>
      </form>
    </div>
  );
};

export default Pago;
