// import express from "express";
// import fetch from "node-fetch";
// import cors from "cors";

// const app = express();
// app.use(cors()); // 👈 permite CORS desde cualquier origen

// // Endpoint de prueba para obtener estados
// app.get("/api/estados", async (req, res) => {
//   try {
//     const response = await fetch(
//       `https://api.copomex.com/query/get_estados?token=${process.env.COPOMEX_APIKEY}`
//     );

//     if (!response.ok) {
//       throw new Error(`Error en Copomex: ${response.status}`);
//     }

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("❌ Error al consultar Copomex:", error);
//     res.status(500).json({ error: "Error al obtener estados" });
//   }
// });

// // Para Vercel: exportamos como handler
// export default app;

// prueba 3
// import express from "express";
// import fetch from "node-fetch";

// const app = express();

// // Middleware para permitir JSON y CORS
// app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*"); // o pon tu dominio de Firebase Hosting
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// // Endpoint para estados
// app.get("/api/estados", async (req, res) => {
//   try {
//     const response = await fetch("https://api.tau.com.mx/dipomex/v1/estados", {
//       headers: {
//         APIKEY: process.env.DIPOMEX_APIKEY
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! ${response.status}`);
//     }

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("❌ Error al obtener estados:", error);
//     res.status(500).json({ error: "Error al obtener estados" });
//   }
// });

// // Export para que Vercel lo use
// export default app;

// prueba 2
// import fetch from "node-fetch";

// app.get("/api/estados", async (req, res) => {
//   try {
//     const response = await fetch("https://api.tau.com.mx/dipomex/v1/estados", {
//       headers: {
//         APIKEY: process.env.DIPOMEX_APIKEY
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! ${response.status}`);
//     }

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("❌ Error al obtener estados:", error);
//     res.status(500).json({ error: "Error al obtener estados" });
//   }
// });

// prueba 1

// backend/index.js (o app.js)
import express from "express";
import fetch from "node-fetch"; // si usas Node 18+ puedes usar global fetch
//const express = require("express");
//const fetch = require("node-fetch");


const app = express();
const PORT = process.env.PORT || 3001;

// Endpoint que devuelve los estados
app.get("/api/estados", async (req, res) => {
  try {
    const response = await fetch("https://api.tau.com.mx/dipomex/v1/estados", {
      headers: { APIKEY: "272406fa9058c2494438c4872b8dba1450c0cbc1" },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Error al obtener estados" });
    }

    const data = await response.json();
    res.json(data); // devuelves la misma estructura que recibes
  } catch (err) {
    console.error("Error backend:", err);
    res.status(500).json({ error: err.message });
  }
});

// endpoint que consulta municipios por estado
// Obtener municipios de un estado
app.get("/api/municipios/:id_estado", async (req, res) => {
  const { id_estado } = req.params; // ejemplo: "09" para CDMX

  try {
    const response = await fetch(
      `https://api.tau.com.mx/dipomex/v1/municipios?id_estado=${id_estado}`,
      {
        headers: { APIKEY: "272406fa9058c2494438c4872b8dba1450c0cbc1" },
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Error al obtener municipios" });
    }

    const data = await response.json();
    res.json(data); // devuelve lo mismo que la API externa
  } catch (err) {
    console.error("Error backend:", err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener colonias de un municipio dentro de un estado
app.get("/api/colonias/:id_estado/:id_mun", async (req, res) => {
  const { id_estado, id_mun } = req.params; // ejemplo: "09" (CDMX) y "014" (Álvaro Obregón)

  try {
    const response = await fetch(
      `https://api.tau.com.mx/dipomex/v1/colonias?id_estado=${id_estado}&id_mun=${id_mun}`,
      {
        headers: { APIKEY: "272406fa9058c2494438c4872b8dba1450c0cbc1" },
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Error al obtener colonias" });
    }

    const data = await response.json();
    res.json(data); // devuelves la misma estructura
  } catch (err) {
    console.error("Error backend:", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
