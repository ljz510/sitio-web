const { Pool } = require('pg');
const {getIngredientesByReceta} = require("./ingredientes")
const {getPasosByReceta} = require("./pasos")

const dbClient = new Pool({
  user: 'postgres',
  port: 5432,
  host: 'localhost', 
  database: 'recetas',
  password: 'postgres',
});


// ------------------------------- GET -------------------------------

// Función para obtener todas las recetas
const getAllRecetas = async () => {
  const result = await dbClient.query('SELECT * FROM receta');
  return result.rows;
}; 

// Función para obtener una receta
const getOneReceta = async (id) => {
  const query = 'SELECT * FROM receta WHERE id = $1';
  const result = await dbClient.query(query, [id]);

  if (result.rowCount === 0) {
    throw new Error('Receta no encontrada');
  }

  const receta = result.rows[0];

  // Llamamos a la función importada
  const ingredientes = await getIngredientesByReceta(id);
  const pasos = await getPasosByReceta(id);
  receta.ingredientes = ingredientes;
  receta.pasos = pasos

  return receta;
};

// Funcion para verificar receta a partir del nombre asi puedo terminar de hacer el post
// src/scripts/recetas.js
async function getRecetaPorNombre(nombre) {
    const result = await dbClient.query(
      "SELECT * FROM receta WHERE nombre = $1",
      [ nombre ]
    );
    return result.rows[0];  // devuelve undefined si no existe
}


// ------------------------------- POST -------------------------------

async function createReceta({ nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen }) {
    let result;
    try {
        if (imagen != undefined) {
            result = await dbClient.query(
                "INSERT INTO receta (nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen]
            );
        } else {
            result = await dbClient.query(
                "INSERT INTO receta (nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen) VALUES ($1, $2, $3, $4, $5, NULL) RETURNING *",
                [nombre, descripcion, tiempo_preparacion, porciones, dificultad]
            );
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error al crear receta:", error); // Agregá esto para ayudarte a debuggear
        return undefined;
    }
}


// ------------------------------- DELETE -------------------------------

// Función para eliminar una receta
const deleteReceta = async (id) => {
    const result = await dbClient.query('DELETE FROM receta WHERE id = $1', [id]);
  
    if (result.rowCount === 0) {
      throw new Error('Receta no encontrada');
    }
  
    return id; 
};


// ------------------------------- PUT -------------------------------

// Función para actualizar una receta
async function updateReceta(id, nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen) {
  await dbClient.query(
    "UPDATE receta SET nombre = $2, descripcion = $3, tiempo_preparacion = $4, porciones = $5, dificultad = $6, imagen = $7 WHERE id = $1",
    [ id, nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen ]
  );
  return {id, nombre, descripcion,
    tiempo_preparacion, porciones, dificultad,
    imagen};
}



// Exportar el pool y funciones
module.exports = {
  getAllRecetas,
  getOneReceta,
  createReceta,
  getRecetaPorNombre,
  deleteReceta,
  updateReceta
};
