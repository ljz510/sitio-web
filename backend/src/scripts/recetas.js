const { Pool } = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  port: 5432,
  host: 'localhost', 
  database: 'recetas',
  password: 'postgres',
});

// Función para obtener todas las recetas
const getAllRecetas = async () => {
  const result = await dbClient.query('SELECT * FROM receta');
  return result.rows;
}; 

// Función para obtener una receta
const getOneReceta = async (id) => {
    const query = 'SELECT * FROM receta WHERE id = $1';
    const values = [id];
  
    const result = await dbClient.query(query, values);
    return result.rows[0]; 
  };
  
// Función para eliminar una receta
  const deleteReceta = async (id) => {
    const result = await dbClient.query('DELETE FROM receta WHERE id = $1', [id]);
  
    if (result.rowCount === 0) {
      throw new Error('Receta no encontrada');
    }
  
    return id; 
  };
  

// Exportar el pool y funciones
module.exports = {
  getAllRecetas,
  getOneReceta,
  deleteReceta
};
