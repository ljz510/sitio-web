const { Pool } = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  port: 5432,
  host: 'localhost', 
  database: 'recetas',
  password: 'postgres',
});


// ------------------------------- GET -------------------------------

// Función para los utensilios de una receta
const getUtensiliosByReceta = async (id) => {
  const utensiliosQuery = `
    SELECT u.id, u.nombre, u.material, u.tipo, u.usos, u.apto_lavavajillas
    FROM utensilios u
    JOIN utenporreceta upr ON u.id = upr.utensilio_id
    WHERE upr.receta_id = $1
  `;
  const utensiliosResult = await dbClient.query(utensiliosQuery, [id]);
  return utensiliosResult.rows;
};


// Función para obtener todos los utensilios
const getAllUtensilios = async () => {
  const result = await dbClient.query('SELECT * FROM utensilios');
  if (result.rowCount === 0) {
    throw new Error('No hay datos en la tabla');
  }
  return result.rows;
}; 

// Función para obtener un utensilio
const getOneUtensilio = async (id) => {
  const query = 'SELECT * FROM utensilios WHERE id = $1';
  const result = await dbClient.query(query, [id]);
  if (result.rowCount === 0) {
    throw new Error('Utensilio no encontrada');
  }

  return result.rows[0];
};

const getUtensilioPorNombre = async (nombre) => {
  const result = await dbClient.query(
    "SELECT * FROM utensilios WHERE nombre = $1",
    [ nombre ]
  );
  return result.rows[0];  // Devuelve undefined si no existe
}



// ------------------------------- POST -------------------------------

// Función para crear un utensilio
const createUtensilio = async ({ nombre, material, tipo, usos, apto_lavavajillas }) => {
  const result = await dbClient.query(
    "INSERT INTO Utensilios (nombre, material, tipo, usos, apto_lavavajillas) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [nombre, material, tipo, usos, apto_lavavajillas]
  );
  return result.rows[0];
};

async function createUtensilioPorReceta({ receta_id, utensilio_id }) {
  try {
      const result = await dbClient.query(
          "INSERT INTO UtenPorReceta (receta_id, utensilio_id) VALUES ($1, $2) RETURNING *",
          [receta_id, utensilio_id]
      );
      return result.rows[0];
  } catch (error) {
      console.error("Error al crear utensilio por receta:", error);
      return undefined;
  }
}

// ------------------------------- PUT -------------------------------

// Funcion para editar un utensilio
const updateUtensilio = async (id, { nombre, material, tipo, usos, apto_lavavajillas }) => {
  const query = "UPDATE utensilios SET nombre = $1, material = $2, tipo = $3, usos = $4, apto_lavavajillas = $5 WHERE id = $6 RETURNING *";
  const result = await dbClient.query(query, [nombre, material, tipo, usos, apto_lavavajillas, id]);
  
  if (result.rowCount === 0) {
    throw new Error('Utensilio no encontrado');
  }
  return result.rows[0];
};

// // ------------------------------- DELETE -------------------------------

// Funcion para eliminar un utensilio
const deleteUtensilio = async (id) => {
  await dbClient.query('BEGIN'); 

  await dbClient.query('DELETE FROM UtenPorReceta WHERE utensilio_id = $1', [id]);

  const result = await dbClient.query('DELETE FROM Utensilios WHERE id = $1 RETURNING id', [id]);

  if (result.rowCount === 0) {
    await dbClient.query('ROLLBACK');
    throw new Error('Utensilio no encontrado');
  }
  await dbClient.query('COMMIT');
  return result.rows[0].id;
};

const deleteRelacionUtensilioReceta = async (recetaId, utensilioId) => {
  const query = `
    DELETE FROM UtenPorReceta WHERE receta_id = $1 AND utensilio_id = $2 RETURNING receta_id, utensilio_id
  `;
  const result = await dbClient.query(query, [recetaId, utensilioId]);
  if (result.rowCount === 0) {
    throw new Error('Relación no encontrada');
  }
  return result.rows[0];
};



// Exportar el pool y funciones
module.exports = {
  getAllUtensilios,
  getOneUtensilio,
  getUtensilioPorNombre,
  createUtensilio,
  deleteUtensilio,
  updateUtensilio,
  createUtensilioPorReceta,
  getUtensiliosByReceta,
  deleteRelacionUtensilioReceta
};
