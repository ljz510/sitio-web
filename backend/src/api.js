const express = require('express');
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors())
app.use('/images', express.static('public/images'));

const PORT = process.env.PORT || 3000;

const {getAllRecetas, getOneReceta, deleteReceta} = require('./scripts/recetas.js')
app.get('/api/health', (req,res) => {
    res.json({ status: 'OK' });
});

app.get('/api/recetas', async (req, res)=>{
    const recetas = await getAllRecetas();
    res.json(recetas)
})

app.get('/api/recetas/:id', async (req, res)=>{
    const receta = await getOneReceta(req.params.id);
    res.json(receta)
})


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