// src/pages/Calendario.jsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Calendario = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [editing, setEditing] = useState(null);

  // Consultar las citas del backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/citas?fecha=${date.toISOString().split("T")[0]}`
        );
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error al obtener citas:", error);
      }
    };
    fetchAppointments();
  }, [date]);

  // Guardar cambios en cita editada
  const handleSave = async (id, updated) => {
    try {
      await fetch(`http://localhost:4000/api/citas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setEditing(null);
      // refrescar lista
      setAppointments((prev) =>
        prev.map((cita) => (cita.id_cita === id ? { ...cita, ...updated } : cita))
      );
    } catch (error) {
      console.error("Error al actualizar cita:", error);
    }
  };

  // usar router para navegar
  const navigate = useNavigate();

  // actualizar la hora de una cita en el array appointments sin mutar
  const handleTimeChange = (id_cita, timeValue) => {
    setAppointments(prev =>
      prev.map(it => it.id_cita === id_cita ? { ...it, hora: timeValue } : it)
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfcfa] p-6 flex flex-col items-center">
      {/* Botón Regresar */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate('/')}
          className="bg-[#6099ad] hover:bg-[#4b5849] text-white px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105"
        >
          Menú Principal
        </button>
      </div>
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#6d5e8d] mb-6 text-center">
        📅 Calendario de Citas
      </h1>
      <p className="text-lg text-[#5f6c5d] mb-6 text-center">
        Fecha seleccionada:{" "}
        <span className="font-semibold">
          {date.toLocaleDateString("es-ES")}
        </span>
      </p>

      {/* Calendario */}
      <div className="scale-125 md:scale-110 lg:scale-100 mb-10">
        <Calendar
          onChange={setDate}
          value={date}
          locale="es-ES"
          className="rounded-xl shadow-xl p-4 bg-white"
        />
      </div>

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
                key={cita.id_cita}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                {editing === cita.id_cita ? (
                  <>
                    <input
                      type="time"
                      value={ (cita.hora || "").slice(0,5) }   // "12:46:00" -> "12:46"
                      step="60"
                      onChange={(e) => handleTimeChange(cita.id_cita, e.target.value)}
                      className="w-full border rounded p-2 mb-2"
                    />

                    <textarea
                      defaultValue={cita.descripcion}
                      onChange={(e) => (cita.descripcion = e.target.value)}
                      className="w-full border rounded p-2 mb-2"
                    />
                    <button
                      onClick={() =>
                        handleSave(cita.id_cita, {
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
                      {new Date(cita.hora).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-gray-700">{cita.descripcion}</p>
                    <p className="text-sm text-[#6d5e8d]">
                      Paciente: {cita.paciente}
                    </p>
                    <p className="text-sm text-[#6d5e8d]">
                      Doctor: {cita.dentista}
                    </p>
                    <button
                      onClick={() => setEditing(cita.id_cita)}
                      className="mt-3 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      Editar
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendario;