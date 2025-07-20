
CREATE TABLE Receta (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    tiempo_preparacion INT,
    porciones INT,
    dificultad VARCHAR(50) NOT NULL,
    imagen VARCHAR(100)
);

CREATE TABLE Ingrediente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    calorias INT,
    descripcion VARCHAR(150) NOT NULL
);

CREATE TABLE Pasos (
    id SERIAL PRIMARY KEY,
    receta_id INT REFERENCES Receta(id) ON DELETE CASCADE,
    cantidad_pasos INT,
    dificultad VARCHAR(50) NOT NULL,
    tiempo_estimado INT,
    receta_entera VARCHAR(300) NOT NULL,
    apto_para VARCHAR(100) NOT NULL
);

CREATE TABLE IngPorReceta (
    id SERIAL PRIMARY KEY,
    receta_id INT REFERENCES Receta(id) ON DELETE CASCADE,--Al borrar una receta, se borran automáticamente sus pasos e ingredientes.
    ingrediente_id INT REFERENCES Ingrediente(id),
    cantidad INT,
    unidad VARCHAR(20)
);

