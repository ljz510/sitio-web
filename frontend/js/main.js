function mostrarRecetas() {
  const url = 'http://localhost:3000/api/recetas/';
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('lista-recetas');
      lista.innerHTML = '';
      
      data.forEach(receta => {
        const li = document.createElement('li');
        li.className = 'flex justify-center';
        li.innerHTML = `
          <div class="w-60 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div >
              <img src="http://localhost:3000/images/${receta.imagen}"
                   alt="${receta.nombre}"
                   class="w-full h-48 object-cover" />
              <div class="absolute top-3 right-3">
                <span class="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ⏱️ 25 min
                </span>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-xl font-bold text-gray-800 mb-2 text-center">${receta.nombre}</h3>
              <p class="text-gray-600 text-sm mb-4 text-center">${receta.descripcion}</p>
              <div class="flex items-center justify-center">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Ver Receta
                </button>
              </div>
            </div>
          </div>
        `;
        
        lista.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Error cargando recetas:', err);
    });
}

mostrarRecetas();