import { useState } from 'react' // 1. Importamos la "memoria" de React

function App() {
  // 2. Aquí creamos una variable "contador" que empieza en 0
  const [contador, setContador] = useState(0)

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Prueba De Push</h1>
      
      {/* 3. Aquí mostramos el valor del contador */}
      <h2>Has hecho clic {contador} veces</h2>

      {/* 4. El botón aumenta el contador cuando le das clic */}
      <button 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        onClick={() => setContador(contador + 1)}
      >
        ¡Púchale aquí!
      </button>
    </div>
  )
}

export default App