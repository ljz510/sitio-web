//Imports
const express = require('express');
var cors = require('cors');
const path = require('path');
const multer = require('multer');

//Asignaciones para que se forme la App
const app = express();
app.use(express.json());
app.use(cors())
app.use('/images', express.static(path.join(__dirname, '..','public','images')));

// Define carpeta de destino y nombre de archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + ext;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

//Puerto donde Trabaja
const PORT = process.env.PORT || 3000;

//Import funciones
const {getAllRecetas, getOneReceta, createReceta, deleteReceta, getRecetaPorNombre, updateReceta} = require('./scripts/recetas.js')
const {getIngredientesByReceta, getAllIngredientes, createIngrediente, updateIngrediente, deleteIngrediente} = require('./scripts/ingredientes.js');

//Endpoints

//* Health
app.get('/api/health', (req,res) => {
    res.json({ status: 'OK' });
});

//* Get All
app.get('/api/recetas', async (req, res)=>{
    const recetas = await getAllRecetas();
    res.json(recetas);
})

//* Get One
app.get('/api/recetas/:id', async (req, res)=>{
    const receta = await getOneReceta(req.params.id);
    res.json(receta);
})

//* Post
app.post("/api/recetas", upload.single('imagen'), async (req, res) => {
    const { nombre, descripcion, tiempo_preparacion, porciones, dificultad } = req.body;

    const imagen = req.file ? req.file.filename: null;

    // Errores principales
    if (!req.body) {
        return res.status(400).send("No se recibió ningún parámetro");
    }

    if (!nombre) {
        return res.status(400).send("No se recibió un 'Nombre'");
    }
    if (!descripcion) {
        return res.status(400).send("No se recibió una 'Descripción'");
    }
    if (!tiempo_preparacion) {
        return res.status(400).send("No se recibió un 'Tiempo'");
    }
    if (!porciones) {
        return res.status(400).send("No se recibieron las 'Porciones'");
    }
    if (!dificultad) {
        return res.status(400).send("No se recibió la 'Dificultad'");
    }

    // Verificar si la receta ya existe (por nombre)
    const recetaExistente = await getRecetaPorNombre(nombre);
    if (recetaExistente !== undefined && recetaExistente !== null) {
        return res.status(409).send("La receta ya existe");
    }

    // Crear receta 
    const nuevaReceta = {
        nombre,
        descripcion,
        tiempo_preparacion,
        porciones,
        dificultad,
        imagen
    };

    const id = await createReceta(nuevaReceta);

    if (!id) {
        return res.sendStatus(500);
    }

    res.status(201).json({ id });
});


//* Delete
app.delete("/api/recetas/:id", async (req, res) => {
  try {
    const recetaEliminada = await deleteReceta(req.params.id);
    if (!recetaEliminada) {
      return res.status(404).json({ error: "Receta id: ${req.params.id} no encontrada" });
    }
    res.json({ mensaje: "Receta eliminada", id: recetaEliminada });
  } catch (error) {
    console.error("Error en DELETE", error);
    res.sendStatus(500);
  }
});

//* Put
app.put("/api/recetas/:id", async (req, res) => {
    let receta = await getOneReceta[req.params.id];

    if (!req.body) {
        return res.status(400).send("No se recibió ningún parámetro");
    }

    const nombre = req.body.nombre
    const descripcion = req.body.descripcion
    const tiempo_preparacion = req.body.tiempo_preparacion
    const porciones = req.body.porciones
    const dificultad = req.body.dificultad
    const imagen = req.body.imagen

    // Errores principales
    
    if (!nombre) {
        return res.status(400).send("No se recibió un 'Nombre'");
    }
    if (!descripcion) {
        return res.status(400).send("No se recibió una 'Descripción'");
    }
    if (!tiempo_preparacion) {
        return res.status(400).send("No se recibió un 'Tiempo'");
    }
    if (!porciones) {
        return res.status(400).send("No se recibieron las 'Porciones'");
    }
    if (!dificultad) {
        return res.status(400).send("No se recibió la 'Dificultad'");
    }
    
    receta = await updateReceta(req.params.id, nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen);
    res.json(receta);
});
// rutas crud para ingredientes

// Obtener todos los ingredientes
app.get('/api/ingredientes', async (req, res) => {
  try {
    const ingredientes = await getAllIngredientes();
    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener ingredientes por receta
app.get('/api/recetas/:id/ingredientes', async (req, res) => {
  try {
    const ingredientes = await getIngredientesByReceta(req.params.id);
    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo ingrediente
app.post('/api/ingredientes', async (req, res) => {
  try {
    const nuevo = await createIngrediente(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar ingrediente
app.put('/api/ingredientes/:id', async (req, res) => {
  try {
    const actualizado = await updateIngrediente(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Eliminar ingrediente
app.delete('/api/ingredientes/:id', async (req, res) => {
  try {
    const eliminado = await deleteIngrediente(req.params.id);
    res.json({ id: eliminado });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});





// Mensaje al abrir Backend
app.listen(PORT, () => {
    console.log("Server Listening on PORT:",PORT)
})