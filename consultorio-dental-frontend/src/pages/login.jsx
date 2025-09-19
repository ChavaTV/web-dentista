import React from 'react';
import { auth, provider } from '../firebaseConfig';
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      // Mostrar loading
      Swal.fire({
        title: "Autenticando...",
        text: "Por favor espere",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Éxito: cerrar loading y mostrar bienvenida
      Swal.fire({
        icon: "success",
        title: "Autenticado",
        text: `Bienvenido, ${user.email}`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error al iniciar sesión con Google:", error);
      // Error: mostrar alerta
      Swal.fire({
        icon: "error",
        title: "Correo no autenticado",
        text: "Hubo un problema al iniciar sesión con Google.",
      });
    }
  };

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

        {/* Botón de Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 text-white text-lg rounded-xl bg-gradient-to-l from-[#003A74] to-[#006AD5] shadow-md mt-3"
        >
          Ingresar con Google
        </button>
      </div>
    </div>
  );
};

export default Login;
