CREATE TABLE Receta (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    tiempo_preparacion INT,
    porciones INT,
    dificultad VARCHAR(50) NOT NULL,
    imagen VARCHAR(100)
);

CREATE TABLE Pasos (
    receta_id INT REFERENCES Receta(id) ON DELETE CASCADE,
    cantidad_pasos INT,
    receta_entera VARCHAR NOT NULL,
    apto_para VARCHAR(100) NOT NULL
);

CREATE TABLE Ingrediente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    calorias INT,
    descripcion VARCHAR(150) NOT null,
    origen VARCHAR(100)
);

CREATE TABLE IngPorReceta (
    receta_id INT REFERENCES Receta(id) ON DELETE CASCADE,--Al borrar una receta, se borran automáticamente sus pasos e ingredientes.
    unidad VARCHAR(20),
    ingrediente_id INT REFERENCES Ingrediente(id),
    cantidad NUMERIC
);

CREATE TABLE utensilios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,              -- Nombre del utensilio (ej: Sartén)
    material VARCHAR(50) NOT NULL,             -- Material principal (ej: Acero, Silicona)
    tipo VARCHAR(50) NOT NULL,                 -- Tipo (ej: Eléctrico, Manual)
    usos TEXT NOT NULL,                        -- Breve descripción de usos (ej: Para freír, batir, etc.)
    apto_lavavajillas BOOLEAN DEFAULT false    -- Si puede meterse al lavavajillas o no
);

CREATE TABLE UtenPorReceta (
    receta_id INT REFERENCES Receta(id) ON DELETE CASCADE,--Al borrar una receta, se borran automáticamente sus ingredientes.
    utensilio_id INT REFERENCES Utensilios(id)
);


INSERT INTO Receta (nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen)
VALUES
('Pizza casera', 'Pizza con masa fermentada, salsa de tomate y queso.', 45, 4, 'Media', 'pizza.jpg'),
('Ensalada fresca', 'Mix de lechuga, rúcula y tomates cherry con oliva.', 10, 2, 'Fácil', 'ensalada.jpg'),
('Tortilla de papa con cebolla','Clásica tortilla española con papas y cebolla, ideal para cualquier comida del día.',30,2,'Media', '1753333049812.jpg'),
('Wok de pollo con verduras y salsa de soja','Salteado oriental con pechuga de pollo, vegetales crocantes y salsa de soja. Rápido, sano y lleno de sabor.',30,2,'Fácil','wok_verduras.jpg');

INSERT INTO Pasos (receta_id, cantidad_pasos, receta_entera, apto_para)
VALUES
(1, 4,'1. Mezclar harina con agua y levadura. 2. Amasar y dejar levar 30 min. 3. Estirar, colocar salsa y queso. 4. Hornear 15 min a 220°C.','No celíacos'),
(2, 3,'1. Lavar y cortar la lechuga. 2. Cortar tomates cherry. 3. Mezclar con oliva y sal.','Vegetarianos'),
(3,8,'Pelar y cortar en rodajas finas 2 papas medianas. Cortar 1 cebolla en juliana. En una sartén con aceite de oliva, freír las papas y la cebolla hasta que estén blandas. Batir 4 huevos en un bol, salpimentar a gusto. Agregar las papas y cebolla escurridas al bol con los huevos. Volcar la mezcla en una sartén antiadherente con un poco de aceite. Cocinar a fuego medio-bajo unos 5 minutos, luego dar vuelta la tortilla con ayuda de un plato y cocinar 5 minutos más del otro lado. Servir caliente o fría.','Vegetarianos, Celíacos (si se asegura que no hay contaminación cruzada), General'),
(4,7,'Cortar la pechuga de pollo en tiras. Cortar morrón, zanahoria, cebolla y zapallito en juliana. Calentar un wok o sartén con un poco de aceite. Saltear el pollo hasta dorar. Agregar los vegetales y saltear a fuego fuerte por 5 minutos. Incorporar salsa de soja y cocinar 2 minutos más. Servir caliente, con arroz blanco o fideos asiáticos.', 'Celíacos, General (si usás salsa de soja sin TACC)');


INSERT INTO Ingrediente (nombre, tipo, calorias, descripcion,origen)
VALUES
('Harina', 'Seco', 364, 'Ingrediente usado en: Pizza Casera','Argentina'),
('Queso mozzarella', 'Lácteo', 280, 'Ingrediente usado en: Pizza Casera','Italia'),
('Tomate', 'Vegetal', 18, 'Ingrediente usado en: Pizza Casera','Argentina'),
('Lechuga', 'Vegetal', 14, 'Ingrediente usado en: Ensalada Fresca','Argentina'),
('Tomates cherry', 'Vegetal', 20, 'Ingrediente usado en: Ensalada Fresca','Argentina'),
('Aceite de oliva', 'Grasa', 884, 'Ingrediente usado en: Ensalada Fresca','España'),
('Papa','Vegetal',77,'Ingrediente usado en: Tortilla de papa con cebolla', 'Perú'),
('Cebolla','Vegetal',40,'Ingrediente usado en: Tortilla de papa con cebolla', 'Asia'),
('Huevo','Proteína',70,'Ingrediente usado en: Tortilla de papa con cebolla', 'Asia'),
('Pechuga','Carne',165,'Ingrediente usado en: Wok de pollo con verduras y salsa de soja', 'Argentina'),
('Morrón rojo','Vegetal',31,'Ingrediente usado en: Wok de pollo con verduras y salsa de soja', 'Perú'),
('Zanahoria','Vegetal',41,'Ingrediente usado en: Wok de pollo con verduras y salsa de soja', 'Argentina'),
('Zapallito','Vegetal',20,'Ingrediente usado en: Wok de pollo con verduras y salsa de soja', 'Argentina'),
('Salsa soja','Condimento',53,'Ingrediente usado en: Wok de pollo con verduras y salsa de soja', 'Japón');

INSERT INTO IngPorReceta (receta_id, unidad, ingrediente_id, cantidad)
VALUES
(1, 'taza', 1, 2),   -- Harina
(1, 'gramos', 2, 200),   -- Queso
(1, 'taza', 3, 1),   -- Tomate (salsa)
(2, 'taza', 4, 2),   -- Lechuga
(2, 'taza', 5, 1),    -- Tomates cherry
(2, 'cucharadas', 6, 2),  -- Aceite de oliva
(3,'unidad',7,2),  -- Papa
(3,'unidad',8,1),  -- Cebolla
(3,'unidad',9,4),  -- Huevo
(4,'g',10,200),  -- Pechuga
(4,'unidad',11,1),  -- Morrón rojo
(4,'unidad',12,1),  -- Zanahoria
(4,'unidad',13,1),  -- Zapallito
(4,'cucharadas',14,3);  -- Salsa de soja

INSERT INTO Utensilios (nombre, material, tipo, usos, apto_lavavajillas)
values
('Bowl', 'Plástico', 'Manual', 'Superficie para depositar ingredientes.', true),
('Batidora Eléctrica', 'Plástico y Metal', 'Eléctrico', 'Para mezclar ingredientes', false),
('Tabla de Picar', 'Madera', 'Manual', 'Superficie para cortar ingredientes', true),
('Cuchillo de Cocina', 'Acero Inoxidable', 'Manual', 'Para cortar ingredientes', true),
('Espátula de silicona','Silicona','Manual','Para mezclar, raspar y servir sin rayar recipientes',true),
('Cuchara de madera','Madera','Manual','Para revolver mezclas',true),
('Wok','Acero','Sartén','Para saaltear y/o freír ingredientes',true),
('Tabla','Madera','Corte','Superficie para cortar ingredientes',true),
('Cuchillo','Acero','Corte','Para cortar ingredientes',true);

insert into utenporreceta values
(1,1),
(2,1),
(2,4),
(4,7),
(4,8),
(4,9);
