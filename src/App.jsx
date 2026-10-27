import { useState } from 'react';
import './App.css';
import CrudProductos from './componets/producto/crudProductos';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar-custom">
        <div className="container-fluid px-4">
          <div className="navbar-content">
            <div className="navbar-brand-section">
              <div className="navbar-icon">📦</div>
              <div>
                <h1 className="navbar-title">Inventory Manager</h1>
                <p className="navbar-subtitle">SENATI - Gestión de Productos</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <CrudProductos />
    </div>
  );
}

export default App;