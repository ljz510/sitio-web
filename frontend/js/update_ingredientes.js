export function editarIngrediente(ingredienteData = null, ingredienteId = null, recetaId) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
      <h3 class="text-xl font-bold mb-4">${ingredienteId ? 'Editar' : 'Crear'} Ingrediente</h3>
      
      <form id="ingrediente-form">
        <div class="mb-3">
          <label class="form-label">Nombre *</label>
          <input type="text" id="nombre" class="form-control" placeholder="Nombre del ingrediente" required />
        </div>
        
        <div class="mb-3">
          <label class="form-label">Descripción *</label>
          <textarea id="descripcion" class="form-control" rows="2" placeholder="Descripción del ingrediente" required></textarea>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Origen *</label>
          <input type="text" id="origen" class="form-control" placeholder="¿De dónde proviene?" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Calorías *</label>
          <input type="number" id="calorias" class="form-control" placeholder="Ej: 300, 500" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Tipo *</label>
          <input type="text" id="tipo" class="form-control" placeholder="Ej: Verdura, carne, fruta" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Cantidad *</label>
          <input type="text" id="cantidad" class="form-control" placeholder="Ej: 200, 1/2, 3" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Unidad *</label>
          <input type="text" id="unidad" class="form-control" placeholder="Ej: gramos, tazas, cucharadas" required />
        </div>
      </form>
      
      <div class="flex justify-end gap-2 mt-4">
        <button id="btnGuardar" class="btn btn-primary" disabled>
          ${ingredienteId ? 'Actualizar' : 'Crear'}
        </button>
        <button id="btnCancelar" class="btn btn-secondary">Cancelar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const form = modal.querySelector('#ingrediente-form');

  const inputs = {
    nombre: modal.querySelector('#nombre'),
    descripcion: modal.querySelector('#descripcion'),
    origen: modal.querySelector('#origen'),
    calorias: modal.querySelector('#calorias'),
    tipo: modal.querySelector('#tipo'),
    cantidad: modal.querySelector('#cantidad'),
    unidad: modal.querySelector('#unidad'),
  };
  const btnGuardar = modal.querySelector('#btnGuardar');

  if (ingredienteData) {
    inputs.nombre.value = ingredienteData.nombre || '';
    inputs.descripcion.value = ingredienteData.descripcion || '';
    inputs.origen.value = ingredienteData.origen || '';
    inputs.calorias.value = ingredienteData.calorias || '';
    inputs.tipo.value = ingredienteData.tipo || '';
    inputs.cantidad.value = ingredienteData.cantidad || '';
    inputs.unidad.value = ingredienteData.unidad || '';
  }

  function validarFormulario() {
    const esValido = Object.values(inputs).every(input => input.value.trim() !== '');
    btnGuardar.disabled = !esValido;
    return esValido;
  }

  Object.values(inputs).forEach(input => {
    input.addEventListener('input', validarFormulario);
  });

  async function guardarIngrediente() {
    if (!validarFormulario()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      btnGuardar.disabled = true;
      btnGuardar.textContent = ingredienteId ? 'Actualizando...' : 'Creando...';

      const datosIngrediente = {
        nombre: inputs.nombre.value.trim(),
        descripcion: inputs.descripcion.value.trim(),
        origen: inputs.origen.value.trim(),
        calorias: inputs.calorias.value.trim(),
        tipo: inputs.tipo.value.trim(),
      };

      let ingredienteResultado;

      if (ingredienteId) {
        const url = `http://localhost:3000/api/ingredientes/${ingredienteId}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosIngrediente)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        ingredienteResultado = await response.json();
      } else {
        const response = await fetch(`http://localhost:3000/api/ingredientes`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosIngrediente)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        ingredienteResultado = await response.json();
      }

      if (recetaId) {
        const relacionResponse = await fetch('http://localhost:3000/api/ing_por_receta', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            receta_id: recetaId,
            ingrediente_id: ingredienteId || ingredienteResultado.id,
            cantidad: inputs.cantidad.value.trim(),
            unidad: inputs.unidad.value.trim()
          })
        });

        if (!relacionResponse.ok) {
          const errorData = await relacionResponse.json();
          console.warn('Error al actualizar relación ingrediente-receta:', errorData);
        }
      }

      alert(ingredienteId ? 'Ingrediente actualizado exitosamente' : 'Ingrediente creado exitosamente');
      modal.remove();

      window.dispatchEvent(new CustomEvent('ingredienteGuardado', {
        detail: {
          ingredienteId: ingredienteId || ingredienteResultado.id,
          datos: ingredienteResultado,
          esNuevo: !ingredienteId,
          recetaId: recetaId
        }
      }));

    } catch (error) {
      console.error('Error al guardar ingrediente:', error);
      alert(`Error: ${error.message}`);
      btnGuardar.disabled = false;
      btnGuardar.textContent = ingredienteId ? 'Actualizar' : 'Crear';
    }
  }

  modal.querySelector('#btnCancelar').addEventListener('click', () => {
    modal.remove();
  });

  modal.querySelector('#btnGuardar').addEventListener('click', (e) => {
    e.preventDefault();
    guardarIngrediente();
  });

  validarFormulario();
}
