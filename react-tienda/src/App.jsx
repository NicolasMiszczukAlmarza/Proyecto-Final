import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Formulario from './components/Formulario';
import Carrito from './components/Carrito';
import CarritoInvitado from './components/CarritoInvitado';
import Pago from './components/Pago/Pago';
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
          <Route path="/pago" element={<Pago />} /> {/* Ruta para la página de pago */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
