import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Agendar = () => {
  const [paciente, setPaciente] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [doctor, setDoctor] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [dentistas, setDentistas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulación de pacientes y doctores (en el futuro puedes traerlos de tu backend)
  //const pacientes = ["Juan Pérez", "María López", "Carlos Sánchez"];
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await axios.get('http://localhost:4000/pacientes');
        setPacientes(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener pacientes:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los pacientes",
        });
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  //const doctores = ["Dr. Ramírez", "Dra. Fernández", "Dr. Torres"];
    // 🔹 Consultar dentistas
  useEffect(() => {
    const fetchDentistas = async () => {
      try {
        const res = await axios.get("http://localhost:4000/dentistas");
        setDentistas(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener dentistas:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los dentistas",
        });
        setLoading(false);
      }
    };
    fetchDentistas();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paciente || !fecha || !hora || !descripcion || !doctor) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor llena todos los campos antes de agendar la cita.",
        confirmButtonText: "Ok",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "✅ Cita Agendada",
      html: `
        <p><b>Paciente:</b> ${paciente}</p>
        <p><b>Fecha:</b> ${fecha}</p>
        <p><b>Hora:</b> ${hora}</p>
        <p><b>Doctor:</b> ${doctor}</p>
        <p><b>Descripción:</b> ${descripcion}</p>
      `,
      confirmButtonText: "Aceptar",
    });

    // Aquí podrías hacer un POST al backend con axios
    // axios.post("/api/citas", { paciente, fecha, hora, descripcion, doctor });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#d0bcff] to-[#c8f7c5] p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-[#6d5e8d] mb-6">
          📅 Agendar Cita
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Paciente */}
            <div>
                <label className="block text-[#5f6c5d] font-medium mb-2">
                Paciente
                </label>
                <select
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6d5e8d]"
                value={paciente}
                onChange={(e) => setPaciente(e.target.value)}
                disabled={loading}
                >
                <option value="">
                    {loading ? "Cargando pacientes..." : "Selecciona un paciente"}
                </option>
                {pacientes.map((p) => (
                    <option key={p.id_paciente} value={p.nombre}>
                    {p.nombre}
                    </option>
                ))}
                </select>
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#5f6c5d] font-medium mb-2">
                Fecha
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6d5e8d]"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#5f6c5d] font-medium mb-2">
                Hora
              </label>
              <input
                type="time"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6d5e8d]"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-[#5f6c5d] font-medium mb-2">
              Descripción del procedimiento
            </label>
            <textarea
              maxLength="200"
              rows="3"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6d5e8d]"
              placeholder="Ejemplo: Limpieza dental, extracción, revisión..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-[#5f6c5d] font-medium mb-2">
              Doctor/Dentista
            </label>
            <select
              className="w-full p-3 border rounded-xl"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              disabled={loading}
            >
              <option value="">Selecciona un dentista</option>
              {dentistas.map((d) => (
                <option key={d.id_dentista} value={d.nombre}>
                  {d.nombre} 
                </option>
              ))}
            </select>
          </div>

          {/* Botón */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#905ffa] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#7d42fd] transition-all transform hover:scale-105"
            >
              ✅ Guardar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Agendar;
