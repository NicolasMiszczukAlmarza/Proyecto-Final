import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Formulario from './components/Formulario';
import './App.css';  // Asegúrate de importar el archivo de estilos

function App() {
  return (
    <div className="App"> {/* Aplica la clase 'App' al contenedor principal */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Formulario />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
