/*
 * Proyecto: Conexión PostgreSQL con Node.js y Express
 * Estructura de archivos:
 *  - config/db.js    -> Configuración de la conexión a PostgreSQL
 *  - server.js       -> Servidor Express que utiliza la conexión
 */

// Archivo: config/db.js
// ---------------------
// Requiere: npm install pg dotenv

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,  
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ',#ST2025',
  database: process.env.DB_NAME || 'consultorio_db',
  max: 20,            // número máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // liberar conexión inactiva tras 30s
  connectionTimeoutMillis: 2000, // tiempo de espera para conectar
});

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente PostgreSQL', err);
  process.exit(-1);
});

module.exports = pool;


// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// module.exports = pool;
