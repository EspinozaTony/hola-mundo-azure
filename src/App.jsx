import { useState, useEffect } from 'react';
import './App.css';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from './authConfig';

function App() {
  const [registros, setRegistros] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const { instance, accounts } = useMsal();

  // ⚠️ PON TU URL PÚBLICA REAL DE AZURE AQUÍ ABAJO:
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

  // Funciones para los botones de Login/Logout
  // Funciones para los botones de Login/Logout (AHORA CON REDIRECT)
  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => console.error(e));
  }

  const handleLogout = () => {
    instance.logoutRedirect().catch(e => console.error(e));
  }

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
    <div>
      {/* =========================================
          PANTALLA PARA INTRUSOS (NO LOGUEADOS)
      ========================================= */}
      <UnauthenticatedTemplate>
        <h1>Bienvenido a la App Serverless 🚀</h1>
        <p>Por favor, inicia sesión para ver y guardar tus tareas.</p>
        <button onClick={handleLogin}>Iniciar Sesión con Microsoft</button>
      </UnauthenticatedTemplate>

      {/* =========================================
          PANTALLA PARA EL USUARIO AUTORIZADO
      ========================================= */}
      <AuthenticatedTemplate>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          {/* Muestra el nombre de quien inició sesión */}
          <h3>Hola, {accounts[0]?.name} 👋</h3> 
          <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: 'white' }}>
            Cerrar Sesión
          </button>
        </div>
        
        {/* === TU LISTA DE TAREAS === */}
        <h1>Mi Lista Serverless</h1>
        
        <div>
          <input 
            type="text" 
            value={nuevoMensaje} 
            onChange={(e) => setNuevoMensaje(e.target.value)} 
            placeholder="Escribe una nueva tarea..."
          />
          <button onClick={guardarDato}>Guardar Dato</button>
        </div>
        
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {registros.map((registro) => (
            <li key={registro.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', color: 'black' }}>
              <span>{registro.mensaje}</span>
              <button 
                onClick={() => eliminarDato(registro.id)} 
                style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>

      </AuthenticatedTemplate>
    </div>
  )
}

export default App;