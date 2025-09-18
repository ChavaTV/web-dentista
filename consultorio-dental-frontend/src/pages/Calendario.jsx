// src/pages/Calendario.jsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// CONEXIN FIREBASE PRODUCTIVO
import { db } from "../firebaseConfig"; 
import { collection, query, where, getDocs, getDoc, doc, updateDoc} from "firebase/firestore";

const Calendario = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [editing, setEditing] = useState(null);

  // Consultar las citas del backend
  useEffect(() => {
  const fetchAppointments = async () => {
      try {
        const formattedDate = date.toISOString().split("T")[0];
        const q = query(collection(db, "citas"), where("fecha", "==", formattedDate));
        const querySnapshot = await getDocs(q);

        const citas = [];

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();

          let paciente = null;
          let dentista = null;

          if (data.paciente_ref) {
            const pacienteDoc = await getDoc(data.paciente_ref);
            paciente = pacienteDoc.exists() ? { id: pacienteDoc.id, ...pacienteDoc.data() } : null;
          }

          if (data.dentista_ref) {
            const dentistaDoc = await getDoc(data.dentista_ref);
            dentista = dentistaDoc.exists() ? { id: dentistaDoc.id, ...dentistaDoc.data() } : null;
          }

          citas.push({ id: docSnap.id, ...data, paciente, dentista });
        }

        // Ordenar por fecha y hora
        citas.sort((a, b) => {
          const dateA = new Date(`${a.fecha}T${a.hora}`);
          const dateB = new Date(`${b.fecha}T${b.hora}`);
          return dateA - dateB; // menor → mayor
        });

        setAppointments(citas);
      } catch (error) {
        console.error("Error al obtener citas:", error);
      }
    };

    // fetchAppointments();
  }, [date]);
 
  // Guardar cambios en cita editada local
  // const handleSave = async (id, updated) => {
  //   try {
  //     await fetch(`http://localhost:4000/api/citas/${id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(updated),
  //     });
  //     setEditing(null);
  //     // refrescar lista
  //     setAppointments((prev) =>
  //       prev.map((cita) => (cita.id === id ? { ...cita, ...updated } : cita))
  //     );
  //   } catch (error) {
  //     console.error("Error al actualizar cita:", error);
  //   }
  // };

  // guardar cambios en cita editada en Firestore
  const handleSave = async (id, updated) => {
      try {
    // 1️⃣ Confirmación antes de actualizar
    const result = await Swal.fire({
      title: "¿Actualizar cita?",
      text: "Se guardarán los cambios de fecha y hora.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    // 2️⃣ Actualizar cita en Firestore
    const citaRef = doc(db, "citas", id);
    await updateDoc(citaRef, {
      fecha: updated.fecha,
      hora: updated.hora,
      descripcion: updated.descripcion || "",
    });

    // 3️⃣ Éxito con alerta
    Swal.fire({
      icon: "success",
      title: "✅ Cita actualizada",
      text: "Los cambios se guardaron correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });

    // salir del modo edición
    setEditing(null);

    // 4️⃣ Actualizar lista de citas (llamar la función fetchAppointments)
    fetchAppointments();
  } catch (error) {
    console.error("❌ Error al actualizar cita:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo actualizar la cita",
    });
  }
    // try {
    //   // referencia a la cita en Firestore
    //   const citaRef = doc(db, "citas", id);

    //   // actualizar en Firestore
    //   await updateDoc(citaRef, {
    //     fecha: updated.fecha, // formato "2025-09-22"
    //     hora: updated.hora,   // formato "10:30"
    //     descripcion: updated.descripcion || "",
    //   });

    //   // salir del modo edición
    //   setEditing(null);

    //   // refrescar estado en React
    //   setAppointments((prev) =>
    //     prev.map((cita) =>
    //       cita.id === id ? { ...cita, ...updated } : cita
    //     )
    //   );

    //   console.log(`✅ Cita ${id} actualizada en Firestore`);
    // } catch (error) {
    //   console.error("❌ Error al actualizar cita:", error);
    // }
  };


  // usar router para navegar
  const navigate = useNavigate();

  // actualizar la hora de una cita en el array appointments sin mutar
  const handleTimeChange = (id, timeValue) => {
    setAppointments(prev =>
      prev.map(it => it.id === id ? { ...it, hora: timeValue } : it)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b68dfc] via-[#9ecfff] to-[#7ef0d9] p-6 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#6d5e8d] mb-6 text-center">
        📅 Calendario de Citas
      </h1>
      {/* Botón Regresar */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => navigate("/Dashboard")}
          className="bg-blue-400 hover:bg-blue-500 text-white px-5 py-2 rounded-xl
                     transition-all shadow-md hover:scale-105"
        >
          Menú Principal
        </button>
      </div>

      <p className="text-lg text-[#5f6c5d] mb-6 text-center">
        Fecha seleccionada:{" "}
        <span className="font-semibold">
          {date.toLocaleDateString("es-ES")}
        </span>
      </p>

      {/* Calendario */}
      <div className="w-full max-w-md mx-auto mb-10 px-4">
        <Calendar
          onChange={setDate}
          value={date}
          locale="es-ES"
          className="rounded-xl shadow-xl p-4 bg-white text-sm md:text-base"
        />
      </div>
      {/* <div className="scale-125 md:scale-110 lg:scale-100 mb-10">
        <Calendar
          onChange={setDate}
          value={date}
          locale="es-ES"
          className="rounded-xl shadow-xl p-4 bg-white"
        />
      </div> */}

      {/* Grid de citas */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-4 text-[#6d5e8d]">
          Citas del día
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center">No hay citas para este día</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((cita) => (
              <div
                key={cita.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                {editing === cita.id ? (
                  <>
                  {/* Fecha */}
                    <input
                      type="date"
                      value={cita.fecha || ""}
                      onChange={(e) =>
                        setAppointments((prev) =>
                          prev.map((c) =>
                            c.id === cita.id ? { ...c, fecha: e.target.value } : c
                          )
                        )
                      }
                      className="w-full border rounded p-2 mb-2"
                    />

                    {/* Hora */}
                    <input
                      type="time"
                      value={(cita.hora || "").slice(0, 5)} // formato hh:mm
                      step="60"
                      onChange={(e) =>
                        setAppointments((prev) =>
                          prev.map((c) =>
                            c.id === cita.id ? { ...c, hora: e.target.value } : c
                          )
                        )
                      }
                      className="w-full border rounded p-2 mb-2"
                    />

                    {/* Descripción */}
                    <textarea
                      value={cita.descripcion || ""}
                      onChange={(e) =>
                        setAppointments((prev) =>
                          prev.map((c) =>
                            c.id === cita.id ? { ...c, descripcion: e.target.value } : c
                          )
                        )
                      }
                      className="w-full border rounded p-2 mb-2"
                    />

                    {/* Botones */}
                    <button
                      onClick={() =>
                        handleSave(cita.id, {
                          fecha: cita.fecha,
                          hora: cita.hora,
                          descripcion: cita.descripcion,
                        })
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-[#5f6c5d]">
                      {cita.fecha} – {cita.hora}
                    </p>
                    <p className="text-gray-700">{cita.descripcion}</p>
                    <p className="text-sm text-[#6d5e8d]">
                      Paciente: {cita.paciente?.nombre || "Desconocido"}
                    </p>
                    <p className="text-sm text-[#6d5e8d]">
                      Doctor: {cita.dentista?.nombre || "Desconocido"}
                    </p>
                    <button
                      onClick={() => setEditing(cita.id)}
                      className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                  </>
                )}
                    {/* <input
                      type="time"
                      value={ (cita.hora || "").slice(0,5) }   // "12:46:00" -> "12:46"
                      step="60"
                      // onChange={(e) => handleTimeChange(cita.id, e.target.value)}
                      className="w-full border rounded p-2 mb-2"
                    />

                    <textarea
                      defaultValue={cita.descripcion}
                      onChange={(e) => (cita.descripcion = e.target.value)}
                      className="w-full border rounded p-2 mb-2"
                    />
                    <button
                      onClick={() =>
                        handleSave(cita.id, {
                          hora: cita.hora,
                          descripcion: cita.descripcion,
                        })
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                    >
                      Guardar
                    </button>
                    <button
                      // onClick={() => setEditing(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-[#5f6c5d]">
                      Hora: {cita.hora}
                    </p>
                    <p className="text-gray-700">{cita.descripcion}</p>
                    <p className="text-sm text-[#6d5e8d]">
                     Paciente: {cita.paciente?.nombre || "Desconocido"}
                    </p>
                    <p className="text-sm text-[#6d5e8d]">
                      Doctor: {cita.dentista?.nombre || "Desconocido"}
                    </p>
                    <button
                      onClick={() => setEditing(cita.id)}
                      className="mt-3 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      Editar
                    </button>
                  </>
                )} */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendario;
