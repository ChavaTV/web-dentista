import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaTable, FaCalendarAlt, FaClipboardList, FaBell } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const botones = [
    { label: "Formulario Pacientes", icon: <FaUserPlus size={32} />, path: "/pacientes" },
    { label: "Tabla Pacientes", icon: <FaTable size={32} />, path: "/card" },
    { label: "Calendario", icon: <FaCalendarAlt size={32} />, path: "/Calendario" },
    { label: "Agendar Citas", icon: <FaClipboardList size={32} />, path: "/agendar" },
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

// import { useEffect, useState } from "react";
// import { FaTooth } from "react-icons/fa";


// function Dashboard() {
//   const [fecha, setFecha] = useState("");

//   useEffect(() => {
//     const hoy = new Date();
//     const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
//     const fechaFormateada = hoy.toLocaleDateString("es-ES", opciones);
//     setFecha(fechaFormateada);
//   }, []);

//   // Ejemplo de datos, podrías reemplazarlos por datos de una API con Axios
//   const citasHoy = [
//     { nombre: "Juan Pérez", hora: "10:00 AM", dentista: "Dra. López", silla: "1" },
//     { nombre: "Ana Gómez", hora: "11:00 AM", dentista: "Dr. Ramírez", silla: "2" },
//     { nombre: "Carlos Ruiz", hora: "12:00 PM", dentista: "Dra. Ortega", silla: "3" },
//     { nombre: "Lucía Torres", hora: "1:30 PM", dentista: "Dr. Mendoza", silla: "4" },
//   ];

//   return (
//     // <div className="min-h-screen bg-rose-300 p-6"> text-purple-800
//     <div className="min-h-screen bg-fuchsia-400 p-6">
//       <div className="text-center mb-4 flex justify-center items-center gap-3">
//         <FaTooth className="text-4xl text-white" />
//         <h1 className="text-3xl font-bold uppercase tracking-wide text-black">
//           Clínica Dents
//         </h1>
//       </div>

//       <h2 className="text-4xl text-black font-bold mb-6 text-center">
//         {fecha}
//       </h2>

//       <div className="grid grid-cols-6 gap-4 bg-pink-400 text-black p-4 rounded-xl shadow font-semibold text-center">
//         <div>Nombre del Paciente</div>
//         <div>Hora</div>
//         <div>Dentista</div>
//         <div>No. Silla</div>
//         <div>Atendido</div>
//         <div>No asistió</div>
//       </div>

//       {citasHoy.map((cita, index) => (
//         <div
//           key={index}
//           className="grid grid-cols-6 gap-4 bg-pink-300 mt-2 p-4 rounded-lg text-black shadow-sm text-center"
//         >
//           <div>{cita.nombre}</div>
//           <div>{cita.hora}</div>
//           <div>{cita.dentista}</div>
//           <div>{cita.silla}</div>
//           <div>
//             <button className="bg-pink-300 text-green-700 px-2 py-1 rounded text-sm">
//               ✔️
//             </button>
//           </div>
//           <div>
//             <button className="bg-pink-300 text-red-700 px-2 py-1 rounded text-sm">
//               ❌
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;

// //paleta de colores
// //  bg-rose-300
// //  text-purple-950
// // bg-purple-500
