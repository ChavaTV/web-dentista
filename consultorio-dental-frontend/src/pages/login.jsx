import React from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import Swal from "sweetalert2";

const Login = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      Swal.fire({
        icon: "success",
        title: `Bienvenido ${user.displayName}`,
        text: "Has iniciado sesión con éxito",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};

export default Login;
