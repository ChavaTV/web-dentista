// server.js
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { createRequire } from "module";

// Permite importar JSON de manera estable (sin warnings)
const require = createRequire(import.meta.url);
const serviceAccount = require("./firebase/serviceAccountKey.json");

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar Firebase Admin con el archivo de credenciales
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * 🔹 GET /citas?fecha=YYYY-MM-DD
 * Devuelve citas de Firestore con datos de paciente y dentista
 */
app.get("/citas", async (req, res) => {
  try {
    const { fecha } = req.query;
    let q = db.collection("citas");

    if (fecha) {
      q = q.where("fecha", "==", fecha);
    }

    const snapshot = await q.get();
    const citas = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      let paciente = null;
      let dentista = null;

      // 🔹 Resolver paciente_ref
      if (data.paciente_ref?.referenceValue) {
        const pacientePath = data.paciente_ref.referenceValue.split("/documents/")[1];
        const pacienteDoc = await db.doc(pacientePath).get();
        if (pacienteDoc.exists) {
          paciente = { id: pacienteDoc.id, ...pacienteDoc.data() };
        }
      }

      // 🔹 Resolver dentista_ref
      if (data.dentista_ref?.referenceValue) {
        const dentistaPath = data.dentista_ref.referenceValue.split("/documents/")[1];
        const dentistaDoc = await db.doc(dentistaPath).get();
        if (dentistaDoc.exists) {
          dentista = { id: dentistaDoc.id, ...dentistaDoc.data() };
        }
      }

      citas.push({
        id: doc.id,
        ...data,
        paciente,
        dentista,
      });
    }

    res.json(citas);
  } catch (err) {
    console.error("❌ Error al obtener citas:", err);
    res.status(500).json({ error: "Error al obtener citas" });
  }
});

/**
 * 🔹 GET /pacientes
 * Devuelve todos los pacientes
 */
app.get("/pacientes", async (req, res) => {
  try {
    const snapshot = await db.collection("pacientes").get();
    const pacientes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(pacientes);
  } catch (err) {
    console.error("❌ Error al obtener pacientes:", err);
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
});

/**
 * 🔹 GET /dentistas
 * Devuelve todos los dentistas
 */
app.get("/dentistas", async (req, res) => {
  try {
    const snapshot = await db.collection("dentistas").get();
    const dentistas = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(dentistas);
  } catch (err) {
    console.error("❌ Error al obtener dentistas:", err);
    res.status(500).json({ error: "Error al obtener dentistas" });
  }
});

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
