// Archivo: server.js
const express = require('express');
const pool = require('./config/db');
require('dotenv').config();
console.log('Conectando a DB con usuario:', process.env.DB_USER);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // solo permite peticiones desde tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


// Ruta de prueba: verifica conexión con la base de datos
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      databaseTime: result.rows[0].now,
      serverTime: new Date(),
    });
  } catch (err) {
    console.error('Error al verificar la conexión:', err);
    res.status(500).json({ error: 'Error de conexión a la base de datos' });
  }
});

// Ejemplo de ruta para obtener pacientes
app.get('/pacientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.pacientes');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener pacientes:', err);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

// Obtener citas por fecha
app.get('/citas', async (req, res) => {
  try {
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({ error: "Debe enviar una fecha en formato YYYY-MM-DD" });
    }

    const query = `
      SELECT 
        C.id_cita,
        P.nombre AS paciente,
        D.nombre AS dentista,
        C.fecha,
        TO_CHAR(C.hora, 'HH24:MI') AS hora,
        C.descripcion
      FROM public.citas AS C
      INNER JOIN public.dentistas AS D ON D.id_dentista = C.id_dentista
      INNER JOIN public.pacientes AS P ON P.id_paciente = C.id_paciente
      WHERE C.fecha = $1
      ORDER BY C.hora ASC
    `;

    const result = await pool.query(query, [fecha]);

    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener las citas:", err);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});


// Ejemplo de ruta para obtener dentistas
// app.get('/dentistas', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM public.dentistas');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error al obtener dentistas:', err);
//     res.status(500).json({ error: 'Error al obtener dentistas' });
//   }
// });

// Obtiene los estados
app.get('/estados', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_estado, clave, nombre, abrev, activo FROM public.estados');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener estados:', error);
    res.status(500).json({ error: 'Error al obtener estados' });
  }
});

// Obtiene los municipios filtrados por estadoId
app.get('/municipios', async (req, res) => {
  const estadoId = parseInt(req.query.estadoId, 10);

  if (isNaN(estadoId)) {
    return res.status(400).json({ error: 'Parámetro estadoId inválido' });
  }

  try {
    const result = await pool.query(
      `SELECT id_municipio, estado_id, clave, nombre, activo
       FROM public.municipios
       WHERE estado_id = $1
       ORDER BY nombre`,
      [estadoId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los municipios:', error);
    res.status(500).json({ error: 'Error al obtener municipios' });
  }
});

// Colonias / Localidades filtradas por municipio
app.get('/colonias', async (req, res) => {
  const municipioId = parseInt(req.query.municipioId, 10);

  if (isNaN(municipioId)) {
    return res.status(400).json({ error: 'Parámetro municipioId inválido' });
  }

  try {
    const result = await pool.query(
      `SELECT id_localidad, municipio_id, nombre, clave, activo
       FROM public.localidades
       WHERE municipio_id = $1
       ORDER BY nombre`,
      [municipioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las colonias:', error);
    res.status(500).json({ error: 'Error al obtener colonias' });
  }
});

// obtiene las ciudades
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

// ================================
// ========= INSERTAR =============
// ================================

//inserta pacientes
app.post('/pacientes', async (req, res) => {
  try {
    const {
      nombre,
      edad,
      genero,
      lugar_nacimiento,
      fecha_nacimiento,
      ocupacion,
      escolaridad,
      estado_civil,
      calle,
      numero_ext,
      numero_int,
      telefono_casa,
      telefono_celular,
      religion,
      motivo_consulta,
      padecimiento_actual,
      id_localidad,
      id_dentista,
      enfermedades,
      alergias
    } = req.body;

    // Validación mínima
    if (!nombre || !id_localidad) {
      return res.status(400).json({ error: 'El nombre y la localidad son obligatorios' });
    }

    const query = `
      INSERT INTO pacientes (
        nombre, edad, genero, lugar_nacimiento, fecha_nacimiento,
        ocupacion, escolaridad, estado_civil, calle, numero_ext,
        numero_int, telefono_casa, telefono_celular, religion,
        motivo_consulta, padecimiento_actual, id_localidad,
        id_dentista, enfermedades, alergias
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20
      ) RETURNING id_paciente;
    `;

    const values = [
      nombre,
      edad ? parseInt(edad, 10) : null,
      genero,
      lugar_nacimiento,
      fecha_nacimiento || null,
      ocupacion,
      escolaridad,
      estado_civil,
      calle,
      numero_ext,
      numero_int,
      telefono_casa,
      telefono_celular,
      religion,
      motivo_consulta,
      padecimiento_actual,
      id_localidad ? parseInt(id_localidad, 10) : null,
      id_dentista ? parseInt(id_dentista, 10) : null,
      JSON.stringify(enfermedades), // convertir objeto JS a JSON
      JSON.stringify(alergias)      // convertir objeto JS a JSON
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Paciente registrado exitosamente',
      id_paciente: result.rows[0].id_paciente
    });
  } catch (error) {
    console.error('Error al insertar paciente:', error);
    res.status(500).json({ error: 'Error al registrar paciente' });
  }
});

// Registrar nueva cita
app.post('/citas', async (req, res) => {
  try {
    const { id_paciente, id_dentista, fecha, hora, descripcion } = req.body;

    // Validación mínima
    if (!id_paciente || !id_dentista || !fecha || !hora) {
      return res.status(400).json({ error: "Paciente, dentista, fecha y hora son obligatorios" });
    }

    const query = `
      INSERT INTO citas (id_paciente, id_dentista, fecha, hora, descripcion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_cita;
    `;

    const values = [
      parseInt(id_paciente, 10),
      parseInt(id_dentista, 10),
      fecha,      // formato: "YYYY-MM-DD"
      hora,       // formato: "HH:MM"
      descripcion || null
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Cita registrada exitosamente",
      id_cita: result.rows[0].id_cita
    });

  } catch (error) {
    console.error("Error al registrar cita:", error);
    res.status(500).json({ error: "Error al registrar la cita" });
  }
});



// app.post('/pacientes', async (req, res) => {
//   console.log('BODY RECIBIDO:', req.body);
//   try {
//     const {
//       nombre,
//       edad,
//       genero,
//       lugarNacimiento,
//       fechaNacimiento,
//       ocupacion,
//       escolaridad,
//       estadoCivil,
//       calle,
//       numeroExt,
//       numeroInt,
//       localidadId,
//       telefonoCasa,
//       telefonoCelular,
//       religion,
//       motivoConsulta,
//       padecimientoActual,
//       enfermedades,
//       alergias,
//       id_dentista
//     } = req.body;

//     const result = await pool.query(`
//       INSERT INTO pacientes (
//         nombre, edad, genero, lugar_nacimiento, fecha_nacimiento,
//         ocupacion, escolaridad, estado_civil, calle, numero_ext, numero_int,
//         id_localidad, telefono_casa, telefono_celular, religion,
//         motivo_consulta, padecimiento_actual, diabetes, hipertension,
//         otras_enfermedades, alergia_medicamentos, alergia_anestesicos,
//         alergia_alimentos, detalles_alergias, id_dentista
//       )
//       VALUES (
//         $1, $2, $3, $4, $5,
//         $6, $7, $8, $9, $10, $11,
//         $12, $13, $14, $15,
//         $16, $17, $18, $19,
//         $20, $21, $22,
//         $23, $24, $25
//       )
//       RETURNING id_paciente
//     `, [
//       nombre, edad, genero, lugarNacimiento, fechaNacimiento,
//       ocupacion, escolaridad, estadoCivil, calle, numeroExt, numeroInt,
//       localidadId, telefonoCasa, telefonoCelular, religion,
//       motivoConsulta, padecimientoActual,
//       enfermedades.diabetes, enfermedades.hipertension, enfermedades.otras,
//       alergias.medicamentos, alergias.anestesicos, alergias.alimentos,
//       alergias.detalles, id_dentista
//     ]);

//     res.status(201).json({
//       message: 'Paciente registrado con éxito',
//       id: result.rows[0].id_paciente
//     });
//   } catch (error) {
//     console.error('Error al insertar paciente:', error);
//     res.status(500).json({ error: 'Error al guardar el paciente' });
//   }
// });


//parte  1
// // Archivo: server.js
// // ------------------
// // Requiere: npm install express dotenv

// const express = require('express');
// const pool = require('./config/db');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(express.json());

// // Ruta de prueba para verificar conexión
// globalThis.healthCheck = async () => {
//   const client = await pool.connect();
//   try {
//     const res = await client.query('SELECT NOW()');
//     return res.rows[0];
//   } finally {
//     client.release();
//   }
// };

// app.get('/health', async (req, res) => {
//   try {
//     const dbTime = await healthCheck();
//     res.json({
//       status: 'OK',
//       databaseTime: dbTime.now,
//       serverTime: new Date(),
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error de conexión a la base de datos' });
//   }
// });

// // Ejemplo de endpoint que lee pacientes
// a.ppository = async () => {
//   const client = await pool.connect();
//   try {
//     const result = await client.query('SELECT * FROM pacientes LIMIT 10');
//     return result.rows;
//   } finally {
//     client.release();
//   }
// };

// app.get('/pacientes', async (req, res) => {
//   try {
//     const pacientes = await a.ppository();
//     res.json(pacientes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error al obtener pacientes' });
//   }
// });

// // Iniciar servidor
// app.listen(PORT, () => {
//   console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
// });


// const express = require('express');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(express.json());

// // Aquí van las rutas
// app.get('/', (req, res) => {
//   res.send('API del Consultorio Dental funcionando ✅');
// });

// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
