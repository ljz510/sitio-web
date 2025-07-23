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

async function findOrCreateIngrediente({ nombre, tipo = 'general', calorias = 0, descripcion }) {
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
          "INSERT INTO ingrediente (nombre, tipo, calorias, descripcion) VALUES ($1, $2, $3, $4) RETURNING *",
          [nombre, tipo, calorias, descripcion || `Ingrediente: ${nombre}`]
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
  getIngredientesByReceta,
  findOrCreateIngrediente,  
  createIngPorReceta  
};