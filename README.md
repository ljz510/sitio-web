# sitio-web

Nuestro proyecto consiste en una pagina web que permita al usuario informarse acerca de diferentes recetas
de comida, con la posibilidad de agregar la receta que mas le guste.
---------------
Modelo de bbdd:

create table Receta{
id	serial primary key,
nombre varchar(100),
descripcion	varchar(200),
tiempo_preparacion int,
porciones int,
dificultad varchar(50)
}
---------------
create table Ingrediente {

id	serial primary key,
nombre	varchar(100),
tipo varchar(100),
calorias	int,
descripcion	varchar(150)

}
-------------

create table Pasos {
id	serial primary key,
receta_id	int REFERENCES Receta (id),
numero_paso	int,
instruccion	varchar (250),
tiempo_estimado	int
}
--------------
create table IngPorReceta {
id serial primary key.	
receta_id	int REFERENCES Receta(id)
ingrediente_id	int REFERENCES Ingrediente(id)
cantidad int,
unidad int
}

backend:

frontend:
