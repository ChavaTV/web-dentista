import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Agendar = () => {
  const [pacientes, setPacientes] = useState([]);
  const [dentistas, setDentistas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 Todo lo que se envía al backend
  const [formData, setFormData] = useState({
    id_paciente: "",
    id_dentista: "",
    fecha: "",
    hora: "",
    descripcion: ""
  });

  // Cargar pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await axios.get("http://localhost:4000/pacientes");
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

  // Cargar dentistas
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

  // 🔹 Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar cita al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Enviando cita:", formData);
      const res = await axios.post("http://localhost:4000/citas", formData);

      Swal.fire({
        icon: "success",
        title: "✅ Cita Agendada",
        text: `Cita registrada con ID: ${res.data.id_cita}`,
      });

      // Recargar o redirigir
      window.location.reload(); 
      // o navigate("/web-dentista/citas") si usas React Router
    } catch (error) {
      console.error("Error al registrar cita:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar la cita",
      });
    }
  };

  // usar router para navegar
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#d0bcff] to-[#c8f7c5] p-6">
      {/* Botón Regresar */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate('/')}
          className="bg-[#6099ad] hover:bg-[#4b5849] text-white px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105"
        >
          Menú Principal
        </button>
      </div>



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
              name="id_paciente"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6d5e8d]"
              value={formData.id_paciente}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">
                {loading ? "Cargando pacientes..." : "Selecciona un paciente"}
              </option>
              {pacientes.map((p) => (
                <option key={p.id_paciente} value={p.id_paciente}>
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
                name="fecha"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6d5e8d]"
                value={formData.fecha}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-[#5f6c5d] font-medium mb-2">
                Hora
              </label>
              <input
                type="time"
                name="hora"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6d5e8d]"
                value={formData.hora}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-[#5f6c5d] font-medium mb-2">
              Descripción del procedimiento
            </label>
            <textarea
              name="descripcion"
              maxLength="200"
              rows="3"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6d5e8d]"
              placeholder="Ejemplo: Limpieza dental, extracción, revisión..."
              value={formData.descripcion}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-[#5f6c5d] font-medium mb-2">
              Doctor/Dentista
            </label>
            <select
              name="id_dentista"
              className="w-full p-3 border rounded-xl"
              value={formData.id_dentista}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Selecciona un dentista</option>
              {dentistas.map((d) => (
                <option key={d.id_dentista} value={d.id_dentista}>
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
