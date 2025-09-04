import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // Necesario para estructura básica
import { useNavigate } from "react-router-dom";

const Calendario = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b68dfc] via-[#9ecfff] to-[#7ef0d9] p-6">
        {/* botón regreso */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="bg-[#5f6c5d] hover:bg-[#4b5849] text-white px-4 py-2 rounded-xl transition-all shadow-md hover:scale-105"
        >
          🏠 Menú Principal
        </button>
      </div>

        {/* calendario */}
        <div className="scale-125 ">
            <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-center text-[#6d5e8d] mb-4">
                📅 Calendario de Citas
                </h2>

                <div className="calendar-wrapper [&_button]:rounded-lg [&_button]:transition-all [&_button]:ease-in-out [&_.react-calendar__tile--active]:bg-purple-500 [&_.react-calendar__tile--active]:text-white [&_.react-calendar__tile--now]:bg-[#d0bcff] [&_.react-calendar__tile--now]:text-white [&_.react-calendar__tile:hover]:bg-[#c8f7c5] [&_.react-calendar__tile:hover]:scale-105">
                <Calendar
                    onChange={setDate}
                    value={date}
                    locale="es-ES"
                    className="rounded-xl w-full"
                />
            </div>

            <p className="mt-4 text-center text-[#5f6c5d]">
            Fecha seleccionada:{" "}
            <span className="font-semibold">{date.toLocaleDateString()}</span>
            </p>
        </div>
        </div>

    </div>
  );
};

export default Calendario;
