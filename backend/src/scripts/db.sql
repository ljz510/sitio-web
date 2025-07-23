
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
    descripcion VARCHAR(150) NOT NULL,
    origen VARCHAR(100) NOT NULL -- Nuevo campo para origen del ingrediente
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

-- Nueva tabla para utensilios de cocina
CREATE TABLE Utensilio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,              -- Nombre del utensilio (ej: Sartén)
    material VARCHAR(50) NOT NULL,             -- Material principal (ej: Acero, Silicona)
    tipo VARCHAR(50) NOT NULL,                 -- Tipo (ej: Eléctrico, Manual)
    usos TEXT NOT NULL,                        -- Breve descripción de usos (ej: Para freír, batir, etc.)
    apto_lavavajillas BOOLEAN DEFAULT true     -- Si puede meterse al lavavajillas o no
);

CREATE TABLE UtenPorReceta (
    receta_id INT REFERENCES Receta(id) ON DELETE CASCADE,
    utensilio_id INT REFERENCES Utensilio(id));

CREATE TABLE IngPorReceta (
    id SERIAL PRIMARY KEY,
    receta_id INT REFERENCES Receta(id) ON DELETE CASCADE,--Al borrar una receta, se borran automáticamente sus pasos e ingredientes.
    ingrediente_id INT REFERENCES Ingrediente(id),
    cantidad INT,
    unidad VARCHAR(20)
);

