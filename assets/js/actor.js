// Lógica de la página de perfil de actor: información básica y filmografía.

function obtenerIdDesdeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("id");
}

function calcularPromedioValoracion(peliculas) {
  const conValoracion = (peliculas || []).filter((p) => p.vote_average && p.vote_average > 0);
  if (conValoracion.length === 0) return "—";
  const suma = conValoracion.reduce((acc, p) => acc + p.vote_average, 0);
  return (suma / conValoracion.length).toFixed(1);
}

function crearSeccionFilmografia(creditos) {
  const seccion = crearElemento("section", { clase: "seccion-actor" }, [
    crearElemento("h2", { texto: "Filmografía" }),
  ]);

  const peliculas = (creditos.cast || [])
    .filter((p) => p.title)
    .sort((a, b) => new Date(b.release_date || "1900") - new Date(a.release_date || "1900"))
    .slice(0, 20);

  if (peliculas.length === 0) {
    seccion.appendChild(
      crearElemento("p", { clase: "mensaje-estado", texto: "No hay películas disponibles." })
    );
    return seccion;
  }

  const promedio = calcularPromedioValoracion(peliculas);
  const contadorPromedio = crearElemento("div", { clase: "filmografia-promedio" }, [
    crearElemento("span", { clase: "filmografia-promedio__label", texto: "Promedio de películas" }),
    crearElemento("span", { clase: "filmografia-promedio__valor", texto: `${promedio} / 10` }),
  ]);
  seccion.appendChild(contadorPromedio);

  const rejilla = crearElemento("div", { clase: "rejilla-peliculas" });
  peliculas.forEach((pelicula) => {
    rejilla.appendChild(crearTarjetaPelicula(pelicula));
  });
  seccion.appendChild(rejilla);

  return seccion;
}

function pintarActor(datos) {
  const pagina = document.getElementById("pagina-actor");
  vaciarElemento(pagina);

  const urlFoto = obtenerUrlPerfil(datos.profile_path);
  const biografia = datos.biography || "No hay biografía disponible.";
  const fechaNacimiento = datos.birthday || "Desconocida";
  const fechaMuerte = datos.deathday ? ` - ${datos.deathday}` : "";
  const lugarNacimiento = datos.place_of_birth || "Desconocido";

  const cabecera = crearElemento("div", { clase: "actor-cabecera" }, [
    crearElemento("img", {
      clase: "actor-cabecera__foto",
      atributos: {
        src: urlFoto || "",
        alt: `Foto de ${datos.name}`,
      },
    }),
    crearElemento("div", { clase: "actor-cabecera__info" }, [
      crearElemento("h1", { texto: datos.name }),
      crearElemento("p", { clase: "actor-cabecera__meta", texto: `${fechaNacimiento}${fechaMuerte}` }),
      crearElemento("p", { clase: "actor-cabecera__meta", texto: `${lugarNacimiento}` }),
      crearElemento("h2", { clase: "actor-cabecera__subtitulo", texto: "Biografía" }),
      crearElemento("p", { clase: "actor-cabecera__biografia", texto: biografia }),
    ]),
  ]);

  const contenidoInferior = crearElemento("div", { clase: "contenedor" }, [crearSeccionFilmografia(datos.movie_credits || {})]);

  while (pagina.firstChild) {
    pagina.removeChild(pagina.firstChild);
  }
  pagina.appendChild(cabecera);
  pagina.appendChild(contenidoInferior);
}

async function inicializarPagina() {
  const pagina = document.getElementById("pagina-actor");
  const id = obtenerIdDesdeUrl();

  if (!id) {
    mostrarMensajeEstado(pagina, "No se ha indicado ningún actor. Vuelve a una película para elegir uno.", true);
    return;
  }

  try {
    const datos = await api.obtenerActorDetalle(id);
    pintarActor(datos);
  } catch (error) {
    mostrarMensajeEstado(pagina, error.message, true);
  }
}

inicializarPagina();
