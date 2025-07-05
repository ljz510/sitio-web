# sitio-web

Sitio web de recetas de diferentes platos:

- Receta

id	
nombre
descripcion	
tiempo_preparacion
porciones
dificultad

---------------

- Ingrediente

Tabla de ingredientes individuales.


id	
nombre	
tipo	
calorias	
descripcion	

Relación:
Se conecta con IngredientesPorReceta para formar recetas.

-------------

- Pasos

El paso a paso cómo preparar la receta.

id	
receta_id	
numero_paso	
instruccion	
tiempo_estimado	

Relación:
Cada paso pertenece a una Receta (foreign key).

--------------

- IngredientesPorReceta

Para modelar la relación entre Receta e Ingrediente, indicando la cantidad usada.


id	
receta_id	
ingrediente_id	
cantidad	
unidad


Estructura de la base de datos:

backend:

frontend:
