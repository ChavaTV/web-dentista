/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        moradoOscuro: "#280F36",
        moradoMedio: "#632B6C",
        malva: "#C68B9B",
        rosa: "#F09F9C",
        durazno: "#FFC1A0",
      },
    },
  },
  plugins: [],
};
