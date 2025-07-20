const { Pool } = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  port: 5432,
  host: 'localhost', 
  database: 'recetas',
  password: 'postgres',
});


// Función para obtener los pasos de una receta
const getPasosByReceta = async (id) => {
    const pasosQuery = `
      SELECT id, receta_id, cantidad_pasos, dificultad, tiempo_estimado, receta_entera, apto_para
      FROM pasos
      WHERE receta_id = $1
      ORDER BY id ASC
    `;
    const pasosResult = await dbClient.query(pasosQuery, [id]);
    return pasosResult.rows;
  };
  

  

// Exportar el pool y funciones
module.exports = {
  getPasosByReceta
};