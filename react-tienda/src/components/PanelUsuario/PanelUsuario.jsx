import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faClipboardList, faCog } from "@fortawesome/free-solid-svg-icons";

const PanelUsuario = () => {
  const [selectedOption, setSelectedOption] = useState('Datos');

  // Función para renderizar el contenido según la opción seleccionada
  const renderContent = () => {
    switch (selectedOption) {
      case 'Datos':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Datos del Usuario</h2>
            <p>Aquí se muestran los datos del usuario.</p>
          </div>
        );
      case 'Pedidos':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Pedidos</h2>
            <p>Aquí se muestran los pedidos del usuario.</p>
          </div>
        );
      default:
        return <p>Selecciona una opción.</p>;
    }
  };

  return (
    <div className="flex h-screen">
      
      {/* Barra lateral (sidebar) */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-500 text-white flex flex-col">
        
        {/* Menú de navegación: solo las opciones */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            <li
              className={`
                flex items-center p-2 rounded-md cursor-pointer transition-colors 
                ${selectedOption === 'Datos' 
                  ? 'bg-blue-800' 
                  : 'hover:bg-blue-700'}
              `}
              onClick={() => setSelectedOption('Datos')}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              <span>Datos</span>
            </li>

            <li
              className={`
                flex items-center p-2 rounded-md cursor-pointer transition-colors 
                ${selectedOption === 'Pedidos' 
                  ? 'bg-blue-800'
                  : 'hover:bg-blue-700'}
              `}
              onClick={() => setSelectedOption('Pedidos')}
            >
              <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
              <span>Pedidos</span>
            </li>

            <li
              className="flex items-center p-2 rounded-md cursor-pointer transition-colors hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              <span>Configuración</span>
            </li>
          </ul>
        </nav>

        {/* Footer opcional en el sidebar */}
        <div className="p-4 border-t border-white/20">
          <p className="text-sm text-center">© 2025 Mi Tienda</p>
        </div>
      </aside>

      {/* Área de contenido principal */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Encabezado o título principal */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Panel de Usuario</h1>
        </div>

        {/* Card para el contenido */}
        <div className="bg-white rounded-lg shadow-lg p-6 h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default PanelUsuario;
