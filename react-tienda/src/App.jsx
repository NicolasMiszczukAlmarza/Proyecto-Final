import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Asegúrate de importar el componente Login
import Formulario from './components/Formulario'; // Asegúrate de importar el componente Formulario
import Carrito from './components/Carrito';  // Importa el componente Carrito
import CarritoInvitado from './components/CarritoInvitado';  // Importa el componente CarritoInvitado
import 'bootstrap/dist/css/bootstrap.min.css';  // Importa Bootstrap
import './App.css';  // Asegúrate de importar el archivo de estilos

function App() {
  return (
    <div className="App"> {/* Aplica la clase 'App' al contenedor principal */}
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/carrito-invitado" />} /> {/* Redirige al carrito de invitado al iniciar */}
          <Route path="/registro" element={<Formulario />} />
          <Route path="/carrito" element={<Carrito />} /> {/* Ruta para el Carrito */}
          <Route path="/carrito-invitado" element={<CarritoInvitado />} /> {/* Ruta para el Carrito de Invitado */}
          <Route path="/login" element={<Login />} /> {/* Ruta para el Login */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
