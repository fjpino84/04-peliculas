// Persistencia local de la biblioteca del usuario (vistas, pendientes, favoritas).
// Todo se guarda en localStorage bajo una única clave, sin dependencias externas.

const CLAVE_BIBLIOTECA = "cinequest_biblioteca";

function obtenerBiblioteca() {
  const datosGuardados = localStorage.getItem(CLAVE_BIBLIOTECA);

  if (!datosGuardados) {
    return { vistas: {}, pendientes: {}, favoritas: {} };
  }

  try {
    return JSON.parse(datosGuardados);
  } catch (error) {
    return { vistas: {}, pendientes: {}, favoritas: {} };
  }
}

function guardarBiblioteca(biblioteca) {
  localStorage.setItem(CLAVE_BIBLIOTECA, JSON.stringify(biblioteca));
}

function alternarEnLista(pelicula, lista) {
  const biblioteca = obtenerBiblioteca();
  const id = String(pelicula.id);

  if (biblioteca[lista][id]) {
    delete biblioteca[lista][id];
  } else {
    biblioteca[lista][id] = {
      id: pelicula.id,
      titulo: pelicula.titulo,
      poster: pelicula.poster,
      anio: pelicula.anio,
      valoracion: pelicula.valoracion,
    };
  }

  guardarBiblioteca(biblioteca);
  return biblioteca;
}

const almacen = {
  obtenerBiblioteca,

  estaEnLista(id, lista) {
    const biblioteca = obtenerBiblioteca();
    return Boolean(biblioteca[lista][String(id)]);
  },

  alternarVista(pelicula) {
    return alternarEnLista(pelicula, "vistas");
  },

  alternarPendiente(pelicula) {
    return alternarEnLista(pelicula, "pendientes");
  },

  alternarFavorita(pelicula) {
    return alternarEnLista(pelicula, "favoritas");
  },

  quitarDeLista(id, lista) {
    const biblioteca = obtenerBiblioteca();
    delete biblioteca[lista][String(id)];
    guardarBiblioteca(biblioteca);
    return biblioteca;
  },

  contarLista(lista) {
    return Object.keys(obtenerBiblioteca()[lista]).length;
  },
};
