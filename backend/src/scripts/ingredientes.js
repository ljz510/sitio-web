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

  

// Exportar el pool y funciones
module.exports = {
  getIngredientesByReceta
};