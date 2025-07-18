const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const {getAllRecetas, getOneReceta, createReceta, deleteReceta, getRecetaPorNombre} = require('./scripts/recetas.js')
app.get('/api/health', (req,res) => {
    res.json({ status: 'OK' });
});

// Get All
app.get('/api/recetas', async (req, res)=>{
    const recetas = await getAllRecetas();
    res.json(recetas);
})

// Get One
app.get('/api/recetas/:id', async (req, res)=>{
    const receta = await getOneReceta(req.params.id);
    res.json(receta);
})

//Post
app.post("/api/recetas", async (req, res) => {
    const {
        nombre,
        descripcion,
        tiempo_preparacion,
        porciones,
        dificultad,
        imagen = null } = req.body;

    
    console.log(nombre,
        descripcion,
        tiempo_preparacion,
        porciones,
        dificultad,
        imagen);
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

    res.status(201).json({ id, ...nuevaReceta });
});


// Delete
app.delete('/api/recetas/:id', async (req, res) => {
      const recetaEliminada = await deleteReceta(req.params.id);
      res.json({ mensaje: 'Receta eliminada', receta: recetaEliminada });
      if(!recetaEliminada){
        return res.status(404).json({error : " Receta id: " + req.params.id + " not found"})
      }
      res.json({status: 'OK', id: recetaEliminada})
 
});



app.listen(PORT, () => {
    console.log("Server Listening on PORT:",PORT)
})