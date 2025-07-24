import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

export function borrarReceta(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la receta permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:3000/api/recetas/${id}`, { method: "DELETE" })
        .then(() => {
          Swal.fire(
            'Eliminada',
            'La receta ha sido eliminada.',
            'success'
          ).then(() => {
            window.location.href = "ver_recetas.html";
          });
        })
        .catch((error) => {
          Swal.fire(
            'Error',
            'Ocurrió un problema al eliminar la receta.',
            'error'
          );
          console.error("Error al eliminar la receta:", error);
        });
    }
  });
}


  export function borrarIngrediente(receta_id, ingrediente_id) {
    Swal.fire({
      title: "¿Eliminar ingrediente?",
      text: "Elegí el tipo de eliminación",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Eliminar relacion",
      denyButtonText: "Eliminar completo",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/api/receta-ingrediente`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            receta_id: receta_id,
            ingrediente_id: ingrediente_id
          })
        })
          .then(() => {
            Swal.fire("Eliminado", "Se eliminó la relacion del ingrediente con recetas", "success")
              .then(() => location.reload());
          })
          .catch(() => {
            Swal.fire("Error", "No se pudo eliminar la relacion", "error");
          });
      } else if (result.isDenied) {
          fetch(`http://localhost:3000/api/ingredientes/${ingrediente_id}`, {
            method: "DELETE"
          })
            .then(() => {
              Swal.fire("Eliminado", "Se eliminó el ingrediente completo", "success")
              .then(() => location.reload());
            })
            .catch(() => {
              Swal.fire("Error", "No se pudo eliminar el ingrediente completo", "error");
            });
      }
    });
  }
  
  
  export function borrarUtensilio(receta_id, utensilio_id) {
    Swal.fire({
      title: "¿Eliminar ingrediente?",
      text: "Elegí el tipo de eliminación",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Eliminar relacion",
      denyButtonText: "Eliminar completo",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/api/receta-utensilio`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            receta_id: receta_id,
            utensilio_id: utensilio_id
          })
        })
          .then(() => {
            Swal.fire("Eliminado", "Se eliminó la relacion del utensilio con recetas", "success")
              .then(() => location.reload());
          })
          .catch(() => {
            Swal.fire("Error", "No se pudo eliminar la relacion", "error");
          });

      } else if (result.isDenied) {
        fetch(`http://localhost:3000/api/utensilios/${utensilio_id}`, {
          method: "DELETE"
        })
          .then(() => {
            Swal.fire("Eliminado", "Se eliminó el utensilio completo", "success")
            .then(() => location.reload());
          })
          .catch(() => {
            Swal.fire("Error", "No se pudo eliminar el utensilio completo", "error");
          });
      }
    });
  }
  
