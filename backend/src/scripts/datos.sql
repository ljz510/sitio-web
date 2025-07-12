-- Insertar recetas
INSERT INTO Receta (nombre, descripcion, tiempo_preparacion, porciones, dificultad, imagen)
VALUES
('Pizza casera', 'Pizza con masa fermentada, salsa de tomate y queso.', 45, 4, 'Media', 'pizza.jpg'),
('Ensalada fresca', 'Mix de lechuga, rúcula y tomates cherry con oliva.', 10, 2, 'Fácil', 'ensalada.jpg');

-- Insertar ingredientes
INSERT INTO Ingrediente (nombre, tipo, calorias, descripcion)
VALUES
('Harina', 'Seco', 364, 'Harina de trigo refinada para masa'),
('Queso mozzarella', 'Lácteo', 280, 'Queso fresco ideal para fundir'),
('Tomate', 'Vegetal', 18, 'Tomate rojo maduro'),
('Lechuga', 'Vegetal', 14, 'Hojas verdes frescas'),
('Tomates cherry', 'Vegetal', 20, 'Tomates pequeños y dulces'),
('Aceite de oliva', 'Grasa', 884, 'Aceite prensado en frío');

-- Insertar pasos para Pizza
INSERT INTO Pasos (receta_id, cantidad_pasos, dificultad, tiempo_estimado, receta_entera, apto_para)
VALUES
(1, 4, 'Media', 45, 
'1. Mezclar harina con agua y levadura. 2. Amasar y dejar levar 30 min. 3. Estirar, colocar salsa y queso. 4. Hornear 15 min a 220°C.',
'No celíacos');

-- Insertar pasos para Ensalada
INSERT INTO Pasos (receta_id, cantidad_pasos, dificultad, tiempo_estimado, receta_entera, apto_para)
VALUES
(2, 3, 'Fácil', 10,
'1. Lavar y cortar la lechuga. 2. Cortar tomates cherry. 3. Mezclar con oliva y sal.',
'Vegetarianos');

-- Relacionar ingredientes con Pizza
INSERT INTO IngPorReceta (receta_id, ingrediente_id, cantidad, unidad)
VALUES
(1, 1, 500, 'g'),   -- Harina
(1, 2, 200, 'g'),   -- Queso
(1, 3, 100, 'g');   -- Tomate (salsa)

-- Relacionar ingredientes con Ensalada
INSERT INTO IngPorReceta (receta_id, ingrediente_id, cantidad, unidad)
VALUES
(2, 4, 100, 'g'),   -- Lechuga
(2, 5, 50, 'g'),    -- Tomates cherry
(2, 6, 10, 'ml');   -- Aceite de oliva
