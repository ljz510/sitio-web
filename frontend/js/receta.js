import { borrarReceta, borrarIngrediente, borrarUtensilio } from './delete_recetas.js';
import { editarIngrediente } from './update_ingredientes.js';
import { editarUtensilio } from './update_utensilios.js';

let receta = {}; // para uso global en edición

function Receta() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("detalle-receta").innerHTML =
      '<p class="text-center">No se indicó el ID de la receta.</p>';
    return;
  }

  const urlDetalleReceta = `http://localhost:3000/api/recetas/${id}`;

  fetch(urlDetalleReceta)
    .then((res) => res.json())
    .then((data) => {
      receta = data; // guardar para edición
      const contenedor = document.getElementById("detalle-receta");
      contenedor.innerHTML = `
        <div class="relative">
          <h1 class="text-4xl font-bold text-center mb-8 text-primary-blue">
            ${receta.nombre}
          </h1>
          <p class="text-center text-gray-600 mt-2 italic mb-8"> Descripción: ${receta.descripcion}</p>
          <div class="grid grid-cols-2 gap-8 mb-8">
            <div>
              <img src="http://localhost:3000/images/${receta.imagen}" alt="${receta.nombre}"
                   class="w-full h-80 object-cover rounded-2xl mb-4" />
              <div class="grid grid-cols-3 gap-4 text-center">
                <div><div class="font-bold text-2xl">${receta.tiempo_preparacion}</div><div>Minutos</div></div>
                <div><div class="font-bold text-2xl">${receta.porciones}</div><div>Porciones</div></div>
                <div><div class="font-bold text-2xl">${receta.dificultad}</div><div>Dificultad</div></div>
              </div>
            </div>
            <div>
              <h2 class="text-2xl font-bold mb-4">Ingredientes</h2>
              <div class="bg-white p-6 rounded-lg shadow">
                ${receta.ingredientes.map((ingrediente) => `
                  <div class="flex justify-between items-center border-b py-2">
                    <div>
                      <div class="font-semibold">${ingrediente.nombre}</div>
                      <div class="text-sm">${ingrediente.descripcion}</div>
                      <div class="text-sm font-bold">${ingrediente.cantidad} ${ingrediente.unidad}</div>
                      <div class="text-sm italic">Origen: ${ingrediente.origen}</div>
                      <div class="text-sm italic">Calorías: ${ingrediente.calorias}</div>
                      <div class="text-sm italic">Tipo: ${ingrediente.tipo}</div>
                    </div>
                    <div class="flex gap-1">
                      <button class="btnEditarIngrediente bg-blue-500 text-white px-2 rounded text-sm"
                        data-id-ingrediente="${ingrediente.id}"
                        data-nombre="${ingrediente.nombre}"
                        data-descripcion="${ingrediente.descripcion}"
                        data-cantidad="${ingrediente.cantidad}"
                        data-unidad="${ingrediente.unidad}"
                        data-origen="${ingrediente.origen}"
                        data-calorias="${ingrediente.calorias}"
                        data-tipo="${ingrediente.tipo}">✎</button>
                      <button class="btnEliminarIngrediente bg-red-500 text-white px-2 rounded text-sm"
                        data-id-ingrediente="${ingrediente.id}">×</button>
                    </div>
                  </div>`).join("")}
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">Preparación</h2>
            <p>${receta.pasos[0]?.receta_entera || ''}</p>
          </div>

          ${receta.utensilios && receta.utensilios.length > 0 ? `
            <div class="mb-8">
              <h2 class="text-2xl font-bold mb-4">Utensilios</h2>
              ${receta.utensilios.map((u) => `
                <div class="flex justify-between items-center border-b py-2">
                  <div>
                    <div class="font-semibold">${u.nombre}</div>
                    <div class="text-sm">${u.tipo} - ${u.usos}</div>
                    <div class="text-sm italic">Material: ${u.material}</div>
                  </div>
                  <div class="flex gap-1">
                    <button class="btnEditarUtensilio bg-blue-500 text-white px-2 rounded text-sm"
                      data-id-utensilio="${u.id}"
                      data-nombre="${u.nombre}"
                      data-tipo="${u.tipo}"
                      data-usos="${u.usos}"
                      data-material="${u.material}">✎</button>
                    <button class="btnEliminarUtensilio bg-red-500 text-white px-2 rounded text-sm"
                      data-id-utensilio="${u.id}">×</button>
                  </div>
                </div>`).join("")}
            </div>` : ''}

          <div class="text-center mt-6">
            <button id="btnEliminarReceta" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar Receta</button>
            <button id="btnEditarReceta" class="bg-yellow-500 text-white px-4 py-2 rounded ml-2">Editar Receta</button>
          </div>
        </div>
      `;

      // ---------------- Botones de edición ----------------
      document.querySelectorAll(".btnEditarIngrediente").forEach(btn => {
        btn.addEventListener("click", () => {
          const data = {
            nombre: btn.dataset.nombre,
            descripcion: btn.dataset.descripcion,
            cantidad: btn.dataset.cantidad,
            unidad: btn.dataset.unidad,
            origen: btn.dataset.origen,
            calorias: btn.dataset.calorias,
            tipo: btn.dataset.tipo,
          };
          editarIngrediente(data, btn.dataset.idIngrediente, id);
        });
      });

      document.querySelectorAll(".btnEditarUtensilio").forEach(btn => {
        btn.addEventListener("click", () => {
          const data = {
            nombre: btn.dataset.nombre,
            tipo: btn.dataset.tipo,
            usos: btn.dataset.usos,
            material: btn.dataset.material,
          };
          editarUtensilio(data, btn.dataset.idUtensilio, id);
        });
      });

      // ---------------- Botones de borrado ----------------
      document.getElementById("btnEliminarReceta").addEventListener("click", () => borrarReceta(id));
      document.querySelectorAll(".btnEliminarIngrediente").forEach(btn => {
        btn.addEventListener("click", () => borrarIngrediente(id, btn.dataset.idIngrediente));
      });
      document.querySelectorAll(".btnEliminarUtensilio").forEach(btn => {
        btn.addEventListener("click", () => borrarUtensilio(id, btn.dataset.idUtensilio));
      });

      // ---------------- Botón de edición receta ----------------
      const btnEditarReceta = document.getElementById("btnEditarReceta");
      btnEditarReceta.addEventListener("click", () => {
        document.getElementById("edit-nombre").value = receta.nombre;
        document.getElementById("edit-descripcion").value = receta.descripcion;
        document.getElementById("edit-tiempo").value = receta.tiempo_preparacion;
        document.getElementById("edit-porciones").value = receta.porciones;
        document.getElementById("edit-dificultad").value = receta.dificultad;

        document.getElementById("modalEditarReceta").classList.remove("hidden");
      });
    })
    .catch((err) => {
      console.error("Error cargando receta:", err);
      document.getElementById("detalle-receta").innerHTML =
        '<p class="text-center text-red-600">Error al cargar la receta.</p>';
    });
}

Receta();

// -------------------- Modal de edición receta (formulario superior) --------------------

document.getElementById("cancelarEdicion").addEventListener("click", () => {
  document.getElementById("modalEditarReceta").classList.add("hidden");
});

document.getElementById("formEditarReceta").addEventListener("submit", (e) => {
  e.preventDefault();

  const id = new URLSearchParams(window.location.search).get("id");
  const datosActualizados = {
    nombre: document.getElementById("edit-nombre").value,
    descripcion: document.getElementById("edit-descripcion").value,
    tiempo_preparacion: document.getElementById("edit-tiempo").value,
    porciones: document.getElementById("edit-porciones").value,
    dificultad: document.getElementById("edit-dificultad").value,
     
    imagen: receta.imagen, // Mantiene la misma imagen
  };

  fetch(`http://localhost:3000/api/recetas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosActualizados),
  })
    .then(() => {
      Swal.fire("¡Actualizado!", "La receta fue modificada con éxito.", "success");
      document.getElementById("modalEditarReceta").classList.add("hidden");
      Receta(); // Refresca la vista completa
    })
    .catch(err => {
      console.error("Error al actualizar la receta:", err);
      alert("Ocurrió un error al actualizar.");
    });
});

// -------------------- Recarga automática tras cambios --------------------

window.addEventListener("ingredienteGuardado", () => {
  const scrollY = window.scrollY;
  Receta();
  setTimeout(() => window.scrollTo(0, scrollY), 100);
});

window.addEventListener("utensilioGuardado", () => {
  const scrollY = window.scrollY;
  Receta();
  setTimeout(() => window.scrollTo(0, scrollY), 100);
});
