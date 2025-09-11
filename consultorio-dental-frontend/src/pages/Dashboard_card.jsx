import { useEffect, useState } from "react";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import { FaTooth } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import mostrarAlerta from '../components/alertas';
import Swal from "sweetalert2";

const Dashboard_card = () => {
  const [appointments, setAppointments] = useState([]);
  const [citas, setCitas] = useState([]);
  const navigate = useNavigate();
  const fecha = new Date().toISOString().split("T")[0]; // fecha de hoy

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(collection(db, "citas"), where("fecha", "==", fecha));
        const querySnapshot = await getDocs(q);

        const citasArr = [];
        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();

          let paciente = null;
          let dentista = null;

          if (data.paciente_ref?.path) {
            const pacienteDoc = await getDoc(data.paciente_ref);
            paciente = pacienteDoc.exists()
              ? { id: pacienteDoc.id, ...pacienteDoc.data() }
              : null;
          }

          if (data.dentista_ref?.path) {
            const dentistaDoc = await getDoc(data.dentista_ref);
            dentista = dentistaDoc.exists()
              ? { id: dentistaDoc.id, ...dentistaDoc.data() }
              : null;
          }

          citasArr.push({
            id: docSnap.id,
            descripcion: data.descripcion,
            hora: data.hora,
            paciente: paciente?.nombre || "Desconocido",
            dentista: dentista?.nombre || "Desconocido",
          });
        }

        // Ordenar por hora
        citasArr.sort((a, b) => {
          const dateA = new Date(`${fecha}T${a.hora}`);
          const dateB = new Date(`${fecha}T${b.hora}`);
          return dateA - dateB;
        });

        console.log("Citas del día:", citasArr);
        setCitas(citasArr);
      } catch (err) {
        console.error("❌ Error al obtener citas:", err);
      }
    };

    fetchAppointments();
  }, [fecha]);

  const mostrarAlerta = (estado, nombre) => {
    Swal.fire({
      icon: estado === "atendido" ? "success" : "error",
      title: estado === "atendido" ? "Paciente atendido" : "No asistió",
      text: `Paciente: ${nombre}`,
      confirmButtonColor: estado === "atendido" ? "#60a5fa" : "#f87171",
    });
  };

  // useEffect(() => {
  //   const hoy = new Date();
  //   const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  //   const fechaFormateada = hoy.toLocaleDateString("es-ES", opciones);
  //   setFecha(fechaFormateada);
  // }, []);

  // const citas = [
  //   {
  //     nombre: "Ana López",
  //     hora: "09:00 AM",
  //     dentista: "Dr. Pérez",
  //     silla: "1",
  //   },
  //   {
  //     nombre: "Luis García",
  //     hora: "10:00 AM",
  //     dentista: "Dra. Martínez",
  //     silla: "2",
  //   },
  //   {
  //     nombre: "Valeria Méndez",
  //     hora: "11:30 AM",
  //     dentista: "Dr. Torres",
  //     silla: "3",
  //   },
  // ];

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6">
      {/* Encabezado */}
      <div className="text-center mb-4 flex justify-center items-center gap-3">
        <FaTooth className="text-4xl text-blue-700" />
        <h1 className="text-3xl font-bold uppercase tracking-wide text-blue-800">
          Clínica Dents
        </h1>
      </div>

      {/* Fecha */}
      <h2 className="text-4xl text-blue-900 font-bold mb-6 text-center">
        {fecha}
      </h2>

      {/* Botón Regresar */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => navigate("/Dashboard", { replace: false })}
          className="bg-blue-400 hover:bg-blue-500 text-white px-5 py-2 rounded-xl
                     transition-all shadow-md hover:scale-105"
        >
          Menú Principal
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {citas.map((cita) => (
          <div
            key={cita.id}
            className="bg-white text-black-900 rounded-xl p-6 shadow-md 
                       hover:shadow-xl transition duration-300 transform hover:scale-105"
            // className="bg-blue-100 text-blue-900 rounded-xl p-6 shadow-md 
            //            hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <h3 className="text-xl font-bold mb-2">{cita.paciente}</h3>
            <p>
              <span className="font-semibold">Descripción:</span>{" "}
              {cita.descripcion}
            </p>
            <p>
              <span className="font-semibold">Hora:</span> {cita.hora}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Dentista:</span> {cita.dentista}
            </p>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                className="flex-1 bg-green-200 text-green-900 px-4 py-2 rounded-lg 
                           text-sm font-medium transition duration-200 
                           hover:bg-green-300 hover:scale-105"
                onClick={() => mostrarAlerta("atendido", cita.paciente)}
              >
                Atendido
              </button>
              <button
                className="flex-1 bg-red-200 text-red-900 px-4 py-2 rounded-lg 
                           text-sm font-medium transition duration-200 
                           hover:bg-red-300 hover:scale-105"
                onClick={() => mostrarAlerta("no", cita.paciente)}
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
