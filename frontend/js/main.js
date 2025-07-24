const API_URL = 'http://localhost:3000/api/recetas';

let recetasCargadas = [];// variable para almacenar las recetas cargadas

function mostrarRecetas(recetas) {
  const lista = document.getElementById('lista-recetas');
  lista.innerHTML = '';

  recetas.forEach(receta => {
    const li = document.createElement('li');
    li.className = 'flex justify-center';
    li.innerHTML = `
      <a href="receta.html?id=${receta.id}">
        <div class="w-64 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div>
            <img src="http://localhost:3000/images/${receta.imagen}" alt="${receta.nombre}" class="w-full h-48 object-cover" />
            <div class="absolute top-3 right-3">
              <span class="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-medium">
                ⏱️ ${receta.tiempo_preparacion}
              </span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-xl font-bold text-gray-800 mb-2 text-center">${receta.nombre}</h3>
            <p class="text-gray-600 text-sm mb-4 text-center">${receta.descripcion}</p>
          </div>
        </div>
      </a>
    `;
    lista.appendChild(li);
  });
}
// carga las recetas desde la API y las muestra
function obtenerYMostrarRecetas() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      recetasCargadas = data;
      mostrarRecetas(recetasCargadas);
    })
    .catch(err => console.error('Error cargando recetas:', err));
}
// aguarda a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
  obtenerYMostrarRecetas();
  // agrega el evento de búsqueda en tiempo real
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const valor = e.target.value.toLowerCase();
      const filtradas = recetasCargadas.filter(receta =>
        receta.nombre.toLowerCase().includes(valor)
      );
      mostrarRecetas(filtradas);
    });
  }
});



/*
CÓDIGO PARA SECCIÓN AGREGAR_RECETAS
*/ 


const form = document.getElementById("form");
const nombre = document.getElementById("nombre");
const descripcion = document.getElementById("descripcion");
const dificultad = document.getElementById("dificultad");
const porciones = document.getElementById("porciones");
const tiempo = document.getElementById("tiempo");
const utensiliosJson = document.getElementById("utensilios-json");
const ingredientesJson = document.getElementById("ingredientes-json");
const imagen = document.getElementById("imagen");

const receta_entera = document.getElementById("receta_entera");
const cantidad_pasos = document.getElementById("cantidad_pasos");
const apto_para = document.getElementById("apto_para");

const mensaje = document.getElementById("mensaje");


form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

function formValidation() {
  if (
    nombre.value.trim() === "" ||
    descripcion.value.trim() === "" ||
    dificultad.value.trim() === "" ||
    porciones.value.trim() === "" ||
    tiempo.value.trim() === "" ||
    utensiliosJson.value.trim() === "" ||
    ingredientesJson.value.trim() === ""
  ) {
    mensaje.innerText = "Todos los campos son obligatorios.";
    mensaje.style.color = "red";
    return;
  }

  createPost();
}

async function createPost() {
  const formData = new FormData();
  formData.append("nombre", nombre.value);
  formData.append("descripcion", descripcion.value);
  formData.append("dificultad", dificultad.value);
  formData.append("porciones", porciones.value);
  formData.append("tiempo_preparacion", tiempo.value);
  formData.append("utensilios", utensiliosJson.value);
  formData.append("ingredientes", ingredientesJson.value);

  formData.append("receta_entera", receta_entera.value);
  formData.append("cantidad_pasos", cantidad_pasos.value);
  formData.append("apto_para", apto_para.value);

  if (imagen.files.length > 0) {
    formData.append("imagen", imagen.files[0]);
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (res.status !== 201) {
      const txt = await res.text();
      throw new Error(txt || "Error al crear receta");
    }

    const receta = await res.json();

    Swal.fire({
        icon: "success",
        title: "¡Receta creada!",
        text: "La receta fue creada correctamente.",
      }).then(() => {
        form.reset();
      });
      
    // mensaje de receta creada
    mensaje.innerText = "Receta creada correctamente.";
    mensaje.style.color = "green";

    // limpieza de formulario
    form.reset();

    
  } catch (error) {
 console.error("Error al crear receta:", error);
    mensaje.innerText = "Error: " + error.message;
    mensaje.style.color = "red";
  }
}
