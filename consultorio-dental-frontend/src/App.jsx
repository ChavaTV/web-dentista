import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Dashboard_card from './pages/Dashboard_card';
import Pacientes from './pages/Pacientes';
import Calendario from './pages/Calendario';
import Agendar from './pages/Agendar';
// import Dentistas from './pages/Dentistas';
// import Facturacion from './pages/Facturacion';

function App() {
  return (
    <Router basename="/web-dentista">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="card" element={<Dashboard_card />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/Calendario" element={<Calendario />} />
        <Route path="/agendar" element={<Agendar />} />
        {/*<Route path="/facturacion" element={<Facturacion />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   return (
//     <div className="flex justify-center items-center h-screen bg-blue-500">
//       <h1 className="text-white text-4xl">¡Tailwind está funcionando!</h1>
//     </div>
//   )
// }

// export default App;

