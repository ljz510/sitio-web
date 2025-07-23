const { Pool } = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  port: 5432,
  host: 'localhost', 
  database: 'recetas',
  password: 'postgres',
});


// ------------------------------- GET -------------------------------

const getPasosByReceta= async (id) => {
    const pasosQuery = `
    SELECT p.receta_entera, p.cantidad_pasos, p.apto_para
    FROM pasos p
    WHERE p.receta_id = $1;
  `;
  const pasosResult = await dbClient.query(pasosQuery, [id]);
  return pasosResult.rows;
};


// Exportar el pool y funciones
module.exports = {
  getPasosByReceta
};