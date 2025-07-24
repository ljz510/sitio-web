export function editarUtensilio(utensilioData = null, utensilioId = null, recetaId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <h3 class="text-xl font-bold mb-4">Editar Utensilio</h3>
        
        <form id="utensilio-form">
          <div class="mb-3">
            <label class="form-label">Nombre *</label>
            <input type="text" id="nombre" class="form-control" placeholder="Nombre del utensilio" required />
          </div>
          
          <div class="mb-3">
            <label class="form-label">Tipo *</label>
            <textarea id="tipo" class="form-control" rows="3" required></textarea>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Usos *</label>
            <input type="text" id="usos" class="form-control"  required />
          </div>

  
        </form>
        
        <div class="flex justify-end gap-2 mt-4">
          <button id="btnGuardar" class="btn btn-primary" disabled>
            Actualizar
          </button>
          <button id="btnCancelar" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    `;
  
    document.body.appendChild(modal);
  
    const form = modal.querySelector('#utensilio-form');
  
    const inputs = {
      nombre: modal.querySelector('#nombre'),
      tipo: modal.querySelector('#tipo'),
      usos: modal.querySelector('#usos'),
    };
    const btnGuardar = modal.querySelector('#btnGuardar');
  
    if (utensilioData) {
      inputs.nombre.value = utensilioData.nombre || '';
      inputs.tipo.value = utensilioData.tipo || '';
      inputs.usos.value = utensilioData.usos || '';
    }
  
    function validarFormulario() {
      const nombre = inputs.nombre.value.trim();
      const tipo = inputs.tipo.value.trim();
      const usos = inputs.usos.value.trim();
  
      const esValido = nombre && tipo && usos;
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
        btnGuardar.textContent = utensilioId ? 'Actualizando...' : 'Creando...';
  
        const datosUtensilio = {
          nombre: inputs.nombre.value.trim(),
          tipo: inputs.tipo.value.trim(),
          usos: inputs.usos.value.trim(),

        };
  
        let utensiliosResultado;
  
        if (utensilioId) {
          const url = `http://localhost:3000/api/utensilios/${utensilioId}`;
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUtensilio)
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
          }
  
          utensiliosResultado = await response.json();
        } 
 
        
        console.log('Ingrediente guardado exitosamente:', utensiliosResultado);
        alert(utensilioId ? 'Ingrediente actualizado exitosamente' : 'Ingrediente creado exitosamente');
        
        modal.remove();
        
        window.dispatchEvent(new CustomEvent('ingredienteGuardado', {
          detail: { 
            utensilioId: utensilioId || utensiliosResultado.id, 
            datos: utensiliosResultado,
            esNuevo: !utensilioId,
            recetaId: recetaId
          }
        }));
        
      } catch (error) {
        console.error('Error al guardar ingrediente:', error);
        alert(`Error: ${error.message}`);
        
        btnGuardar.disabled = false;
        btnGuardar.textContent =  'Actualizar';
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