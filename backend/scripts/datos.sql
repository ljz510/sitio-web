-- Insertar recetas
INSERT INTO Receta (nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen)
VALUES
('Pizza casera', 'Pizza con masa casera, salsa de tomate y queso mozzarella.', 30, 4, 'Media', 'pizza.jpg'),
('Ensalada fresca', 'Mezcla de hojas verdes con tomates cherry y aderezo suave.', 10, 2, 'Fácil', 'ensalada.jpg');

-- Insertar ingredientes
INSERT INTO Ingrediente (nombre, tipo, calorias, descripcion)
VALUES
('Harina', 'Seco', 364, 'Harina de trigo refinada'),
('Queso mozzarella', 'Lácteo', 280, 'Queso fresco especial para fundir'),
('Tomate', 'Vegetal', 18, 'Tomate rojo maduro'),
('Lechuga', 'Vegetal', 14, 'Hojas verdes frescas'),
('Tomates cherry', 'Vegetal', 20, 'Tomates pequeños y dulces'),
('Aceite de oliva', 'Grasa', 884, 'Aceite prensado en frío');

-- Insertar pasos para Pizza casera (id receta = 1)
INSERT INTO Pasos (receta_id, numero_paso, instruccion, tiempo_estimado)
VALUES
(1, 1, 'Mezclar harina con agua, sal y levadura.', 10),
(1, 2, 'Amasar y dejar reposar la masa durante 20 minutos.', 20),
(1, 3, 'Estirar la masa, colocar salsa de tomate y queso.', 5),
(1, 4, 'Hornear a 220°C por 15 minutos.', 15);

-- Insertar pasos para Ensalada fresca (id receta = 2)
INSERT INTO Pasos (receta_id, numero_paso, instruccion, tiempo_estimado)
VALUES
(2, 1, 'Lavar bien la lechuga y los tomates cherry.', 5),
(2, 2, 'Cortar los tomates por la mitad.', 2),
(2, 3, 'Mezclar en un bowl con aceite de oliva.', 3);

-- Relacionar ingredientes con la Pizza (receta_id = 1)
INSERT INTO IngPorReceta (receta_id, ingrediente_id, cantidad, unidad)
VALUES
(1, 1, 500, 'g'),    -- Harina
(1, 2, 200, 'g'),    -- Queso mozzarella
(1, 3, 100, 'g');    -- Tomate (salsa)

-- Relacionar ingredientes con la Ensalada (receta_id = 2)
INSERT INTO IngPorReceta (receta_id, ingrediente_id, cantidad, unidad)
VALUES
(2, 4, 100, 'g'),    -- Lechuga
(2, 5, 50, 'g'),     -- Tomates cherry
(2, 6, 10, 'ml');    -- Aceite de oliva
