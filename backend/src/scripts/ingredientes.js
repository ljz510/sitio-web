const { Pool } = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  port: 5432,
  host: 'localhost', 
  database: 'recetas',
  password: 'postgres',
});


// Función para los ingredientes de una receta
const getIngredientesByReceta= async (id) => {
    const ingredientesQuery = `
    SELECT i.nombre, i.tipo, i.calorias, i.descripcion, ipr.cantidad, ipr.unidad
    FROM ingrediente i
    JOIN ingporreceta ipr ON i.id = ipr.ingrediente_id
    WHERE ipr.receta_id = $1
  `;
  const ingredientesResult = await dbClient.query(ingredientesQuery, [id]);
  return ingredientesResult.rows;
};

// Función para obtener todos los ingredientes
const getAllIngredientes = async () => {
  const result = await dbClient.query('SELECT * FROM ingrediente');
  return result.rows;
}; 
// Función para crear un ingrediente
const createIngrediente = async ({ nombre, tipo, calorias, descripcion, origen }) => {
  const result = await dbClient.query(
    "INSERT INTO ingrediente (nombre, tipo, calorias, descripcion, origen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [nombre, tipo, calorias, descripcion, origen]
  );
  return result.rows[0];
};

// Funcion para editar un ingrediente
const updateIngrediente = async (id, { nombre, tipo, calorias, descripcion, origen }) => {
  const query = `UPDATE ingrediente
    SET nombre = $1, tipo = $2, calorias = $3, descripcion = $4, origen = $5
    WHERE id = $6 RETURNING *`;
  const result = await dbClient.query(query, [nombre, tipo, calorias, descripcion, origen, id]);
  if (result.rowCount === 0) {
    throw new Error('Ingrediente no encontrado');
  }
  return result.rows[0];
};

// Funcion para eliminar un ingrediente
const deleteIngrediente = async (id) => {
  const query = 'DELETE FROM ingrediente WHERE id = $1 RETURNING id';
  const result = await dbClient.query(query, [id]);
  if (result.rowCount === 0) {
    throw new Error('Ingrediente no encontrado');
  }
  return result.rows[0].id;
};

// Exportar el pool y funciones
module.exports = {
  getIngredientesByReceta,getAllIngredientes,
  createIngrediente, updateIngrediente, deleteIngrediente
};