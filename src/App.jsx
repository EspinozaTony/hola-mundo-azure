import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [registros, setRegistros] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  // ⚠️ PEGA TU URL PÚBLICA DE AZURE AQUÍ ABAJO:
  const API_URL = "https://tony-api-12345.azurewebsites.net/api/api";

  // Función GET: Traer los datos de la base de datos
  const cargarDatos = async () => {
    try {
      const respuesta = await fetch(API_URL);
      const data = await respuesta.json();
      setRegistros(data);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  // Cargar los datos automáticamente al abrir la página
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función POST: Guardar un nuevo mensaje
  const guardarDato = async () => {
    if (!nuevoMensaje) return;
    
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ mensaje: nuevoMensaje }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    setNuevoMensaje(""); // Limpiar la caja de texto
    cargarDatos(); // Recargar la lista
  };

  // Función DELETE: Borrar un mensaje usando su ID
  const eliminarDato = async (id) => {
    await fetch(`${API_URL}?id=${id}`, { 
      method: 'DELETE' 
    });
    cargarDatos(); // Recargar la lista
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>Proyecto Serverless de Tony 🚀</h1>
      <p>Conectado a Azure Functions y Cosmos DB</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          value={nuevoMensaje} 
          onChange={(e) => setNuevoMensaje(e.target.value)} 
          placeholder="Escribe un mensaje para el profe..." 
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={guardarDato} style={{ padding: '10px', cursor: 'pointer' }}>
          Guardar Dato
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {registros.map((reg) => (
          <li key={reg.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            <span>{reg.mensaje}</span>
            <button onClick={() => eliminarDato(reg.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;