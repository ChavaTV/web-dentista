import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Dashboard_card from './pages/Dashboard_card';
import Pacientes from './pages/Pacientes';
import Calendario from './pages/Calendario';
import Agendar from './pages/Agendar';
import Login from './pages/login';
// import Dentistas from './pages/Dentistas';
// import Facturacion from './pages/Facturacion';

function App() {
  return (
    <Router basename="/web-dentista">
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="card" element={<Dashboard_card />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/Calendario" element={<Calendario />} />
        <Route path="/agendar" element={<Agendar />} />
        {/* <Route path="/login" element={<Login />} /> */}
        
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
