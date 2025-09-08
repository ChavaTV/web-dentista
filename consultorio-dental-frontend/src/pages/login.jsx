import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen bg-[#282A36] flex items-center justify-center font-sans">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">Acceder</h2>

        <form className="w-full flex flex-col">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="mb-4 px-4 py-2 rounded-md border border-[#DDDDDD] text-[#A0A6A3] font-mono shadow-md"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="mb-2 px-4 py-2 rounded-md border border-[#DDDDDD] text-[#A0A6A3] font-mono shadow-md"
          />
        </form>

        <a href="#" className="w-full text-[#5881D0] text-sm mb-4 text-left">
          ¿Olvidó su contraseña?
        </a>

        <button
          type="button"
          className="w-full py-2 text-white text-lg rounded-xl bg-gradient-to-l from-[#003A74] to-[#006AD5] shadow-md"
        >
          Ingresar
        </button>
      </div>
    </div>
  );
};

export default Login;
