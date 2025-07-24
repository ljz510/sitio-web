import { borrarReceta, borrarIngrediente, borrarUtensilio } from './delete_recetas.js';
import {editarIngrediente} from './update_ingredientes.js'
import { editarUtensilio } from './update_utensilios.js';
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
    .then((receta) => {
      const contenedor = document.getElementById("detalle-receta");
      contenedor.innerHTML = `
        <div class="relative">
          <!-- Decoración de fondo -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
          
          <h1 class="text-4xl font-bold text-center mb-8 text-primary-blue relative">
            ${receta.nombre}
          </h1>
      
          <div class="grid grid-cols-2 gap-8 mb-8">
            <div>
              <div class="relative overflow-hidden rounded-2xl mb-4">
                <img src="http://localhost:3000/images/${receta.imagen}"
                     alt="${receta.nombre}"
                     class="w-full h-80 object-cover transition-transform duration-300 hover:scale-105" />
              </div>
               
              <div class="grid grid-cols-3 gap-4 text-center">
                <div class="bg-white p-4 border border-orange-100 rounded-xl shadow-lg  hover:shadow-xl transition-shadow">
                  <div class="font-bold text-2xl text-primary-blue">${
                    receta.tiempo_preparacion
                  }</div>
                  <div class="text-sm text-gray-600">Minutos</div>
                </div>
                <div class="bg-white p-4 border border-orange-100 rounded-xl shadow-lg  hover:shadow-xl transition-shadow">
                  <div class="font-bold text-2xl text-primary-blue">${
                    receta.porciones
                  }</div>
                  <div class="text-sm text-gray-600">Porciones</div>
                </div>
                <div class="bg-white p-4 border border-orange-100 rounded-xl shadow-lg  hover:shadow-xl transition-shadow">
                  <div class="font-bold text-2xl text-primary-blue">${
                    receta.dificultad
                  }</div>
                  <div class="text-sm text-gray-600">Dificultad</div>
                </div>
              </div>
            </div>

    
            <div>
              <h2 class="text-2xl font-bold mb-4 text-primary-blue relative">
                Ingredientes
              </h2>
              <div class="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
                ${receta.ingredientes
                  .map(
                    (ingrediente, index) => `
                    <div class="flex justify-between items-center  border-b border-gray-100 last:border-b-0 rounded-lg">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-accent-red rounded-full flex items-center justify-center text-white text-sm font-bold">
                          ${index + 1}
                        </div>
                        <div>
                          <div class="font-semibold text-primary-blue">${ingrediente.nombre}</div>
                          <div class="text-sm text-gray-600">${ingrediente.descripcion}</div>
                        </div>
                      </div>
                      
                      <div class="text-right">
                        <div class="flex justify-end gap-1 mb-2">
                        <button data-id-ingrediente="${ingrediente.id}" 
                        data-nombre="${ingrediente.nombre}" 
                        data-descripcion="${ingrediente.descripcion}"
                        data-cantidad="${ingrediente.cantidad}"
                        data-unidad="${ingrediente.unidad}"

                        class="btnEditarIngrediente w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors">
                          ✎
                        </button>
                          <button data-id-ingrediente="${ingrediente.id}" 
                                  class="btnEliminarIngrediente w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors">
                            ×
                          </button>
                        </div>
                        <!-- Cantidad abajo -->
                        <div class="font-bold text-primary-blue">${ingrediente.cantidad} ${ingrediente.unidad}</div>
                      </div>
                    </div>
                    `
                  )
                  .join("")}
              </div>
            </div>
          </div>

        
          <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4 text-primary-blue relative">
            Preparación
          </h2>
          <div class="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -translate-y-8 translate-x-8 opacity-40"></div>
            
            <p class="text-gray-700 leading-relaxed text-lg relative z-10">${
              receta.pasos[0].receta_entera
            }</p>
            
            <div class="mt-6 flex gap-3 relative z-10">
              ${
                receta.pasos[0].apto_para
                  ? `<span class="bg-gradient-to-r from-orange-400 to-accent-red text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                      ${receta.pasos[0].apto_para}
                    </span>`
                  : ''
              }
              ${
                receta.pasos[0].cantidad_pasos
                  ? `<span class="bg-gradient-to-r from-primary-blue to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                      ${receta.pasos[0].cantidad_pasos} pasos
                    </span>`
                  : ''
              }
            </div>
          </div>
        </div>
        
        
          ${receta.utensilios && receta.utensilios.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-primary-blue relative">
              Utensilios Necesarios
            </h2>
            <div class="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
              <div class="grid grid-cols-2 gap-4">
                ${receta.utensilios
                  .map(
                    (utensilio, index) => `
                    <div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                      <div class="flex items-center gap-3">
                        <div class="w-6 h-6 bg-gradient-to-br from-blue-400 to-primary-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                          ${index + 1}
                        </div>
                        <div>
                          <div class="font-semibold text-primary-blue text-sm">${utensilio.nombre}</div>
                          <div class="text-xs text-gray-600">${utensilio.tipo} • ${utensilio.usos}</div>
                        </div>
                      </div>

                      <div class="flex justify-end gap-1 mb-2">
                      <button data-id-utensilio="${utensilio.id}" 
                      data-nombre="${utensilio.nombre}" 
                      data-tipo="${utensilio.tipo}"
                      data-usos="${utensilio.usos}"
                      class="btnEditarUtensilio w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors">
                        ✎
                      </button>
                      <button  data-id-utensilio="${utensilio.id}" class=" btnEliminarUtensilio w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors">
                        ×
                      </button>
                      </div>
                    </div>
                  `
                  )
                  .join("")}
              </div>
            </div>

          </div>
          ` : ''}

          <div class="text-center mt-8">
          <button id="btnEliminarReceta" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg">
            Eliminar Receta
          </button>
        </div>

        </div>
      `;

document.querySelectorAll(".btnEditarUtensilio").forEach(btn => {
  btn.addEventListener("click", () => {
    const utensilioId = btn.getAttribute("data-id-utensilio");
    const nombre = btn.getAttribute("data-nombre");
    const tipo = btn.getAttribute("data-tipo");
    const usos = btn.getAttribute("data-usos");

    const recetaId = id

    const utensilioData = {
      nombre: nombre,
      tipo: tipo,
      usos: usos,

    };
    
    editarUtensilio(utensilioData, utensilioId, recetaId);
  });
});


document.querySelectorAll(".btnEditarIngrediente").forEach(btn => {
  btn.addEventListener("click", () => {
    const ingredienteId = btn.getAttribute("data-id-ingrediente");
    const nombre = btn.getAttribute("data-nombre");
    const descripcion = btn.getAttribute("data-descripcion");
    const cantidad = btn.getAttribute("data-cantidad");
    const unidad = btn.getAttribute("data-unidad");
    const recetaId = id

    const ingredienteData = {
      nombre: nombre,
      descripcion: descripcion,
      cantidad: cantidad,
      unidad: unidad,

    };
    
    editarIngrediente(ingredienteData, ingredienteId, recetaId);
  });
});


// --------------------------------ELIMINAR---------------------------------------------------
      const btnEliminarReceta = document.getElementById("btnEliminarReceta");
      if (btnEliminarReceta) {
        btnEliminarReceta.addEventListener("click", () => {
          borrarReceta(id); 
        });
      }

      document.querySelectorAll(".btnEliminarUtensilio").forEach(btn => {
        btn.addEventListener("click", () => {
          const idUtensilio = btn.getAttribute("data-id-utensilio");
          borrarUtensilio(id, idUtensilio);
        });
      })
     
      document.querySelectorAll(".btnEliminarIngrediente").forEach(btn => {
        btn.addEventListener("click", () => {
          const idIngrediente = btn.getAttribute("data-id-ingrediente");
          borrarIngrediente(id, idIngrediente);
        });
      })


    })
    .catch((err) => {
      console.error("Error cargando receta:", err);
      document.getElementById("detalle-receta").innerHTML =
        '<p class="text-center text-red-600">Error al cargar la receta.</p>';
    });

}
Receta();
