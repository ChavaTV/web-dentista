import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/estados", async (req, res) => {
  try {
    const apiKey = process.env.DIPOMEX_APIKEY;
    console.log("🔑 APIKEY en backend:", apiKey ? "Sí existe" : "NO existe");

    const response = await fetch("https://api.tau.com.mx/dipomex/v1/estados", {
      method: "GET",
      headers: {
        APIKEY: apiKey,
      },
    });

    console.log("🌐 Respuesta status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en fetch DIPOMEX:", errorText);
      return res.status(500).json({ error: "Fallo en llamada a DIPOMEX", detalle: errorText });
    }

    const data = await response.json();
    console.log("✅ Estados recibidos:", data);

    res.json(data);
  } catch (error) {
    console.error("🔥 Error general:", error);
    res.status(500).json({ error: "Error al obtener estados", detalle: error.message });
  }
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
