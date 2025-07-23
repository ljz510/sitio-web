function detalleReceta() {
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
                  <div class="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0 rounded-lg px-2">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-accent-red rounded-full flex items-center justify-center text-white text-sm font-bold">
                        ${index + 1}
                      </div>
                      <div>
                        <div class="font-semibold text-primary-blue">${
                          ingrediente.nombre
                        }</div>
                        <div class="text-sm text-gray-600">${
                          ingrediente.descripcion
                        }</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-bold text-primary-blue">${
                        ingrediente.cantidad
                      } ${ingrediente.unidad}</div>
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
                <span class="bg-gradient-to-r from-orange-400 to-accent-red text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                 ${receta.pasos[0].apto_para}
                </span>
                <span class="bg-gradient-to-r from-primary-blue to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                 ${receta.pasos[0].cantidad_pasos} pasos
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .catch((err) => {
      console.error("Error cargando receta:", err);
      document.getElementById("detalle-receta").innerHTML =
        '<p class="text-center text-red-600">Error al cargar la receta.</p>';
    });
}

detalleReceta();
