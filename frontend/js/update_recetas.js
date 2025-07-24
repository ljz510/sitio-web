document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnEditarReceta");
  const modal = document.getElementById("modalEditarReceta");

  if (btn && modal) {
    btn.addEventListener("click", () => {
      document.getElementById("edit-nombre").value = receta.nombre;
      document.getElementById("edit-descripcion").value = receta.descripcion;
      document.getElementById("edit-tiempo").value = receta.tiempo_preparacion;
      document.getElementById("edit-porciones").value = receta.porciones;
      document.getElementById("edit-dificultad").value = receta.dificultad;

      modal.classList.remove("hidden");
    });

    document.getElementById("cancelarEdicion").addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }
});
