import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaTable, FaCalendarAlt, FaClipboardList, FaBell } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const botones = [
    { label: "Formulario Pacientes", icon: <FaUserPlus size={32} />, path: "/pacientes" },
    { label: "Tabla Pacientes", icon: <FaTable size={32} />, path: "/card" },
    { label: "Calendario", icon: <FaCalendarAlt size={32} />, path: "/Calendario" },
    { label: "Agendar Citas", icon: <FaClipboardList size={32} />, path: "/agendar" },
    // { label: "Prueba Login", icon: <FaClipboardList size={32} />, path: "/login" },
    // { label: "Recordatorios", icon: <FaBell size={32} />, path: "/recordatorios" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b68dfc] via-[#9ecfff] to-[#7ef0d9] flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-[#5f6c5d]">Menú Principal</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {botones.map((btn) => (
          <button
            key={btn.label}
            onClick={() => navigate(btn.path)}
            className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 text-[#3e493c]"
          >
            {btn.icon}
            <span className="mt-3 font-semibold">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
