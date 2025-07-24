const { Pool } = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  port: 5432,
  host: 'localhost', 
  database: 'recetas',
  password: 'postgres',
});


// ------------------------------- GET -------------------------------

// Función para los ingredientes de una receta
const getIngredientesByReceta= async (id) => {
    const ingredientesQuery = `
    SELECT i.id, i.nombre, i.tipo, i.calorias, i.descripcion, ipr.cantidad, ipr.unidad
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


// ------------------------------- POST -------------------------------

// Función para crear un ingrediente
const createIngrediente = async ({ nombre, tipo, calorias, descripcion, origen }) => {
  const result = await dbClient.query(
    "INSERT INTO ingrediente (nombre, tipo, calorias, descripcion, origen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [nombre, tipo, calorias, descripcion, origen]
  );
  return result.rows[0];
};


// ------------------------------- PUT -------------------------------

// Funcion para editar un ingrediente
const updateIngrediente = async (id, { nombre, tipo='test', calorias=100, descripcion, origen='local' }) => {
  const query = `UPDATE ingrediente
    SET nombre = $1, tipo = $2, calorias = $3, descripcion = $4, origen = $5
    WHERE id = $6 RETURNING *`;
  const result = await dbClient.query(query, [nombre, tipo, calorias, descripcion, origen, id]);
  if (result.rowCount === 0) {
    throw new Error('Ingrediente no encontrado');
  }
  return result.rows[0];
};

const updateIngDeReceta = async ({ receta_id, ingrediente_id, cantidad, unidad }) => {
  const query = `
    UPDATE IngPorReceta
    SET cantidad = $1, unidad = $2
    WHERE receta_id = $3 AND ingrediente_id = $4
    RETURNING *;
  `;
  const result = await dbClient.query(query, [cantidad, unidad, receta_id, ingrediente_id]);

  if (result.rowCount === 0) {
    throw new Error('No se encontró el ingrediente en la receta');
  }

  return result.rows[0];
};

// ------------------------------- DELETE -------------------------------

// Funcion para eliminar un ingrediente
const deleteIngrediente = async (id) => {
  try {
    await dbClient.query('BEGIN');
    await dbClient.query('DELETE FROM IngPorReceta WHERE ingrediente_id = $1', [id]);

    const result = await dbClient.query('DELETE FROM Ingrediente WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      await dbClient.query('ROLLBACK');
      throw new Error('Ingrediente no encontrado');
    }
    await dbClient.query('COMMIT');
    return result.rows[0].id;
  } catch (error) {
    await dbClient.query('ROLLBACK');
    throw error;
  }
};

const deleteRelacionIngReceta = async (recetaId, ingredienteId ) => {
  const query = `
    DELETE FROM IngPorReceta WHERE receta_id = $1 AND ingrediente_id = $2 RETURNING receta_id, ingrediente_id
  `;
  const result = await dbClient.query(query, [recetaId, ingredienteId]);
  if (result.rowCount === 0) {
    throw new Error('Relación no encontrada');
  }
  return result.rows[0];
};


// ----------------------------RELACIONES CON RECETA-------------------------------------------------------
async function findOrCreateIngrediente({ nombre, tipo, calorias, descripcion, origen}) {
  try {
      let result = await dbClient.query(
          "SELECT * FROM ingrediente WHERE LOWER(nombre) = LOWER($1)",
          [nombre]
      );
      
      if (result.rows.length > 0) {
          return result.rows[0];
      }
      
      // Si no existe, crearlo
      result = await dbClient.query(
          "INSERT INTO ingrediente (nombre, tipo, calorias, descripcion, origen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [nombre, tipo, calorias, descripcion, origen || `Ingrediente: ${nombre}`]
      );
      return result.rows[0];
  } catch (error) {
      console.error("Error al crear/encontrar ingrediente:", error);
      return undefined;
  }
}

async function createIngPorReceta({ receta_id, ingrediente_id, cantidad, unidad }) {
  try {
      const result = await dbClient.query(
          "INSERT INTO ingporreceta (receta_id, ingrediente_id, cantidad, unidad) VALUES ($1, $2, $3, $4) RETURNING *",
          [receta_id, ingrediente_id, cantidad, unidad]
      );
      return result.rows[0];
  } catch (error) {
      console.error("Error al crear ingrediente por receta:", error);
      return undefined;
  }
}

// Exportar el pool y funciones
module.exports = {
  getIngredientesByReceta,getAllIngredientes,
  createIngrediente, updateIngrediente, deleteIngrediente,
  findOrCreateIngrediente,  
  createIngPorReceta,
  deleteRelacionIngReceta,
  updateIngDeReceta
};