import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Formulario from './components/Formulario';
import Carrito from './components/Carrito';
import CarritoInvitado from './components/CarritoInvitado';
import Pago from './components/Pago/Pago';
import Facturas from './components/Pago/Facturas';
import PanelUsuario from './components/PanelUsuario/PanelUsuario';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import PanelAdministrador from './components/PanelAdminsitradores/PanelAdministrador'; // 👈 NUEVO IMPORT

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/carrito-invitado" />} />
          <Route path="/registro" element={<Formulario />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/carrito-invitado" element={<CarritoInvitado />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/factura" element={<Facturas />} />
          <Route path="/panel-usuario" element={<PanelUsuario />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/panel-administrador" element={<PanelAdministrador />} /> {/* 👈 NUEVA RUTA */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
