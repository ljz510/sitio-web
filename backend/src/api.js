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
// permite servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, '../../frontend')));


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

const {getAllRecetas, getOneReceta, createReceta, deleteReceta, getRecetaPorNombre, updateReceta, createPasos} = require('./scripts/recetas.js')
const {getIngredientesByReceta, getAllIngredientes, createIngrediente, updateIngrediente, deleteIngrediente, findOrCreateIngrediente, createIngPorReceta, deleteRelacionIngReceta, updateIngDeReceta} = require('./scripts/ingredientes.js');
const { getAllUtensilios, getOneUtensilio, getUtensilioPorNombre, getUtensilioByReceta, createUtensilio, updateUtensilio, deleteUtensilio, createUtensilioPorReceta, deleteRelacionUtensilioReceta} = require('./scripts/utensilios.js');

// Health
app.get('/api/health', (req,res) => {
    res.json({ status: 'OK' });
});


//ENDPOINTS ------------------------------- RECETAS -------------------------------

//* GET ALL
app.get('/api/recetas', async (req, res)=>{
    const recetas = await getAllRecetas();
    res.json(recetas);
})

//* GET ONE
app.get('/api/recetas/:id', async (req, res)=>{
    const receta = await getOneReceta(req.params.id);
    res.json(receta);
})

//* POST
app.post("/api/recetas", upload.single('imagen'), async (req, res) => {
    const { 
        nombre, descripcion, porciones, tiempo_preparacion, dificultad,
        receta_entera, cantidad_pasos, apto_para,
        ingredientes, utensilios
    } = req.body;
    
    const imagen = req.file ? req.file.filename: null;

    // Errores principales
    if (!req.body) {
        return res.status(400).send("No se recibió ningún parámetro");
    }

    if (!nombre) {
        return res.status(400).send("No se recibió un 'Nombre'");
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

    if (!receta_entera) {
      return res.status(400).send("No se recibió la 'Receta entera'");
  }
    if(!ingredientes){
      return res.status(400).send("No se recibió los 'ingredientes'");
    }

    // Verificar si la receta ya existe (por nombre)
    const recetaExistente = await getRecetaPorNombre(nombre);
    if (recetaExistente !== undefined && recetaExistente !== null) {
        return res.status(409).send("La receta ya existe");
    }

    const recetaData = {
        nombre,
        descripcion: descripcion || 'no hay descripción',
        tiempo_preparacion: parseInt(tiempo_preparacion),
        porciones: parseInt(porciones),
        dificultad,
        imagen
    };


    const nuevaReceta = await createReceta(recetaData);

    const pasosData = {
      receta_id: nuevaReceta.id,
      cantidad_pasos: cantidad_pasos ? parseInt(cantidad_pasos) : null,
      receta_entera,
      apto_para: apto_para || 'general'
    };
  
    const nuevosPasos = await createPasos(pasosData);
    if (!nuevosPasos) {
        return res.status(500).json({ error: "Error al crear los pasos" });
    }

    if(utensilios){
      const utensilioArray = JSON.parse(utensilios);
      for (const u of utensilioArray) {
     
        const utensilios = await createUtensilio({
           nombre: u.nombre.trim(),
           material: u.material,
           tipo:u.tipo,
           usos: u.usos,
           apto_lavavajillas: u.apto_lavavajillas === "true" || u.apto_lavavajillas === true
        });

        if (utensilios) {
            // Crear la relación
            await createUtensilioPorReceta({
                receta_id: nuevaReceta.id,
                utensilio_id: utensilios.id,
            });
        }
    }
    }

        const ingredientesArray = JSON.parse(ingredientes);
        
        for (const ing of ingredientesArray) {
            if (!ing.nombre || !ing.tipo || !ing.calorias || !ing.cantidad || !ing.unidad || !ing.origen ) {
                continue; 
            }
            const ingrediente = await findOrCreateIngrediente({
                nombre: ing.nombre.trim(),
                tipo: ing.tipo,
                calorias: ing.calorias,
                descripcion: `Ingrediente usado en: ${nombre}`,
                origen: ing.origen
            });

            if (ingrediente) {
                // Crear la relación
                await createIngPorReceta({
                    receta_id: nuevaReceta.id,
                    ingrediente_id: ingrediente.id,
                    cantidad: parseFloat(ing.cantidad),
                    unidad: ing.unidad.trim()
                });
            }
        }
    

    res.status(201).json({
        message: "Receta creada exitosamente",
        receta: nuevaReceta,
        pasos: nuevosPasos
    });
});

//* DELETE
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

//* PUT
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


//ENDPOINTS ------------------------------- INGREDIENTES -------------------------------

// *GET ALL
app.get('/api/ingredientes', async (req, res) => {
  try {
    const ingredientes = await getAllIngredientes();
    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// *GET ONE
app.get('/api/ingredientes/:id', async (req,res) => {
  try {
    const ingrediente = await getOneIngrediente();
    res.json(ingrediente);
  } catch (error){
    res.status(500).json({ error: error.message });
  }
});

// *GET From RECETA 
app.get('/api/recetas/:id/ingredientes', async (req, res) => {
  try {
    const ingredientes = await getIngredientesByReceta(req.params.id);
    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// *POST
app.post('/api/ingredientes', async (req, res) => {
  try {
    const nuevo = await createIngrediente(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// *PUT
app.put('/api/ingredientes/:id', async (req, res) => {
  try {
    const actualizado = await updateIngrediente(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.put('/api/ing_por_receta', async (req, res) => {
  try {
    const actualizado = await updateIngDeReceta(req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// *DELETE
app.delete('/api/ingredientes/:id', async (req, res) => {
  try {
    const eliminado = await deleteIngrediente(req.params.id);
    res.json({ id: eliminado });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete('/api/receta-ingrediente', async (req, res) => {
  const { receta_id, ingrediente_id } = req.body;
  try {
    const relacion = await deleteRelacionIngReceta(receta_id, ingrediente_id);
    res.json({ mensaje: "Relación eliminada con éxito", relacion });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


//ENDPOINTS ------------------------------- UTENSILIOS -------------------------------

// *GET ALL
app.get('/api/utensilios', async (req, res) => {
  try {
    const utensilios = await getAllUtensilios();
    res.json(utensilios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// *GET ONE
app.get('/api/utensilios/:id', async (req,res) => {
  try {
    const utensilio = await getOneUtensilio(req.params.id);
    res.json(utensilio);
  } catch (error){
    res.status(500).json({ error: error.message });
  }
});


// *GET From RECETA
app.get('/api/recetas/:id/utensilios', async (req, res) => {
  try {
    const utensilios = await getUtensilioByReceta(req.params.id);
    res.json(utensilios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// *POST
app.post("/api/utensilios", async (req, res) => {
    const { nombre, material, tipo, usos, apto_lavavajillas } = req.body;

    // Errores principales
    if (!req.body) {
        return res.status(400).send("No se recibió ningún parámetro");
    }

    if (!nombre) {
        return res.status(400).send("No se recibió un 'Nombre'");
    }
    if (!material) {
        return res.status(400).send("No se recibió el 'Material'");
    }
    if (!tipo) {
        return res.status(400).send("No se recibió el 'Tipo'");
    }
    if (!usos) {
        return res.status(400).send("No se recibieron los 'Usos'");
    }
    if (!apto_lavavajillas) {
        return res.status(400).send("No se recibió si es apto o no para Lavavajillas");
    }

    // Verificar si el utensilio ya existe
    const utensilioExistente = await getUtensilioPorNombre(nombre);
    if (utensilioExistente !== undefined && utensilioExistente !== null) {
        return res.status(409).send("El utensilio ya existe");
    }

    // Crear utensilio 
    const nuevoUtensilio = {
        nombre, material, tipo,
        usos, apto_lavavajillas
    };
    const id = await createUtensilio(nuevoUtensilio);

    if (!id) {
      return res.status(500).json({ mensaje: "Error interno", error: error.message });
    }
    res.status(201).json({ mensaje: "Utensilio creado", id });
});


// *PUT
app.put('/api/utensilios/:id', async (req, res) => {
  try {
    const utensilio = await updateUtensilio(req.params.id, req.body);
    res.json(utensilio);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// *DELETE
app.delete('/api/utensilios/:id', async (req, res) => {
  try {
    const utensilio = await deleteUtensilio(req.params.id);
    res.json({ mensaje:"Utensilio eliminado", utensilio });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete('/api/receta-utensilio', async (req, res) => {
  const { receta_id, utensilio_id } = req.body;

  try {
    const relacion = await deleteRelacionUtensilioReceta(receta_id, utensilio_id);
    res.json({ mensaje: "Relación eliminada con éxito", relacion });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});



// Mensaje al abrir Backend
app.listen(PORT, () => {
    console.log("Server Listening on PORT:",PORT)
})