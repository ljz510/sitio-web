const { Pool } = require('pg');

// Crear el pool de conexiones
const dbClient = new Pool({
  user: 'postgres',
  host: 'localhost', // o 'postgres' si estás en Docker
  database: 'recetas',
  password: 'postgres',
  port: 5432,
});

// Función para obtener todas las recetas
const getAllRecetas = async () => {
  const result = await dbClient.query('SELECT * FROM receta');
  return result.rows;
};

// Función para crear una nueva receta
// const crearReceta = async ({ nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen }) => {
//   const query = `
//     INSERT INTO receta (nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen)
//     VALUES ($1, $2, $3, $4, $5, $6)
//     RETURNING *;
//   `;
//   const values = [nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen];
//   const result = await pool.query(query, values);
//   return result.rows[0];
// };

// Exportar el pool y funciones
module.exports = {
  pool,
  getRecetas,
  crearReceta
};
