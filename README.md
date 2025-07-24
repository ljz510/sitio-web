# 🍽️ Recetisimas - Proyecto Final

El siguiente proyecto conforma la fase final de la materia introducción al desarrollo de software de la cátedra Camejo, FIUBA. El mismo permite al usuario informarse acerca de diferentes recetas de comida, gestionarlas y agregar la que más le guste.
---

## 📸 Capturas de pantalla


### Vista principal
![Vista principal](frontend/img/pag_principal.png)

### Recetario (aca se puede buscar la receta que más le guste)
![Recetario](frontend/img/recetario.png)

## Información y gestión de la receta (en esta sección se podra informar y gestionar parte de la receta)
![Detalle](frontend/img/receta_ej1_1.png)
![Detalle](frontend/img/receta_ej1_2.png)

## Formulario para agregar una receta 
![Formulario](frontend/img/formulario_receta.png)

---

## 🚀 Cómo levantar el sistema

---

### 🔧 Configuración rápida

## 1. Clonación del repositorio:

```bash
git clone https://github.com/ljz510/sitio-web.git
cd sitio-web
```

## 2. Levantar la base de datos y el backend
```bash
cd backend
npm install
npm run start-all
```
Esto ejecuta, que esta definido en el Json:
```bash
docker-compose up -d: levanta PostgreSQL

node ./src/api.js: corre el backend
```
también es posible correrlos por separado:
```bash
npm run start-db → luego npm run run-backend
```

## 3. Levantar el frontend
En otra terminal:

```bash
cd <direccion_local_repo_front>
npm install
npm start
```
Esto lanza el servidor en http://localhost:8080