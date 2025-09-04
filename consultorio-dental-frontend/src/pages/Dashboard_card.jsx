import { FaTooth } from "react-icons/fa";
import { useEffect, useState } from "react";
import mostrarAlerta from '../components/alertas';
import { useNavigate } from "react-router-dom";

const Dashboard_card = () => {
    const [fecha, setFecha] = useState("");

  useEffect(() => {
    const hoy = new Date();
    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const fechaFormateada = hoy.toLocaleDateString("es-ES", opciones);
    setFecha(fechaFormateada);
  }, []);

  const citas = [
    {
      nombre: "Ana López",
      hora: "09:00 AM",
      dentista: "Dr. Pérez",
      silla: "1",
    },
    {
      nombre: "Luis García",
      hora: "10:00 AM",
      dentista: "Dra. Martínez",
      silla: "2",
    },
    {
      nombre: "Valeria Méndez",
      hora: "11:30 AM",
      dentista: "Dr. Torres",
      silla: "3",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b68dfc] via-[#9ecfff] to-[#7ef0d9] p-6">
      {/* Encabezado */}
      <div className="text-center mb-4 flex justify-center items-center gap-3">
        <FaTooth className="text-4xl text-white" />
        <h1 className="text-3xl font-bold uppercase tracking-wide text-black">
          Clínica Dents
        </h1>
      </div>

      {/* Fecha */}
      <h2 className="text-4xl text-black font-bold mb-6 text-center">
        {fecha}
      </h2>

      {/* Botón Regresar */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/', { replace: false })}
            className="bg-[#6099ad] hover:bg-[#4b5849] text-white px-4 py-2 rounded-xl
                      transition-all shadow-md hover:scale-105"
          > 
            Menú Principal
          </button>
        </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {citas.map((cita, index) => (
          <div
            key={index}
            className="bg-blue-200 text-black rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
          >
            <h3 className="text-xl font-bold mb-2">{cita.nombre}</h3>
            <p>
              <span className="font-semibold">Silla:</span> {cita.silla}
            </p>
            <p>
              <span className="font-semibold">Hora:</span> {cita.hora}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Dentista:</span> {cita.dentista}
            </p>

            {/* Botones */}
            <div className="flex gap-3">
              <button className="flex-1 bg-emerald-300 text-green-950 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 hover:bg-green-500 hover:scale-105"
              onClick={() => mostrarAlerta('atendido', cita.nombre)}
              >
                Atendido
              </button>
              <button className="flex-1 bg-red-400 text-red-950 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 hover:bg-red-500 hover:scale-105"
              onClick={() => mostrarAlerta('no', cita.nombre)}
              >
                No asistió
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard_card;
