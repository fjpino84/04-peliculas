// Envoltorio de acceso a la API de TMDb.
// Todas las funciones devuelven promesas y lanzan un Error con un
// mensaje en español legible para mostrarlo directamente en el DOM.

async function peticionTMDb(ruta, parametros = {}) {
  const url = new URL(`${CONFIG.BASE_URL}${ruta}`);
  url.searchParams.set("api_key", CONFIG.API_KEY);
  url.searchParams.set("language", CONFIG.IDIOMA);

  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      url.searchParams.set(clave, valor);
    }
  });

  let respuesta;
  try {
    respuesta = await fetch(url.toString());
  } catch (error) {
    throw new Error(
      "No se ha podido conectar con el servidor de películas. Revisa tu conexión a internet."
    );
  }

  if (respuesta.status === 401) {
    throw new Error(
      "La clave de la API de TMDb no es válida o ha caducado. Revisa assets/js/config.js."
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      `Ha ocurrido un error al consultar las películas (código ${respuesta.status}).`
    );
  }

  return respuesta.json();
}

function obtenerUrlPoster(ruta, tamano = CONFIG.TAMANO_POSTER) {
  if (!ruta) return null;
  return `${CONFIG.IMG_URL}/${tamano}${ruta}`;
}

function obtenerUrlBackdrop(ruta) {
  return obtenerUrlPoster(ruta, CONFIG.TAMANO_BACKDROP);
}

function obtenerUrlPerfil(ruta) {
  return obtenerUrlPoster(ruta, CONFIG.TAMANO_PERFIL);
}

const api = {
  obtenerPopulares(pagina = 1) {
    return peticionTMDb("/movie/popular", { page: pagina });
  },

  obtenerGeneros() {
    return peticionTMDb("/genre/movie/list");
  },

  buscarPeliculas(consulta, pagina = 1) {
    return peticionTMDb("/search/movie", { query: consulta, page: pagina });
  },

  descubrirPeliculas(filtros = {}, pagina = 1) {
    const parametros = { page: pagina, sort_by: filtros.ordenarPor || "popularity.desc" };

    if (filtros.anioDesde) {
      parametros["primary_release_date.gte"] = `${filtros.anioDesde}-01-01`;
    }
    if (filtros.anioHasta) {
      parametros["primary_release_date.lte"] = `${filtros.anioHasta}-12-31`;
    }
    if (filtros.valoracionMinima) {
      parametros["vote_average.gte"] = filtros.valoracionMinima;
    }
    if (filtros.genero) {
      parametros.with_genres = filtros.genero;
    }

    return peticionTMDb("/discover/movie", parametros);
  },

  obtenerDetalle(id) {
    return peticionTMDb(`/movie/${id}`, {
      append_to_response: "credits,videos,similar",
    });
  },

  obtenerActorDetalle(id) {
    return peticionTMDb(`/person/${id}`, {
      append_to_response: "movie_credits",
    });
  },
};
