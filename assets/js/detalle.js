// Lógica de la ficha de detalle de una película: info, reparto y similares.

function obtenerIdDesdeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("id");
}

function obtenerDirector(equipo) {
  const director = (equipo || []).find((persona) => persona.job === "Director");
  return director ? director.name : "Desconocido";
}

function formatearDuracion(minutos) {
  if (!minutos) return "Duración desconocida";
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return `${horas}h ${minutosRestantes}m`;
}

function crearBotonAccion(pelicula, lista, icono, textoBase, textoActivo) {
  const estaActiva = () => almacen.estaEnLista(pelicula.id, lista);

  const etiquetaTexto = crearElemento("span", { texto: estaActiva() ? textoActivo : textoBase });

  const boton = crearElemento("button", {
    clase: estaActiva() ? "boton boton--activo" : "boton boton--secundario",
    atributos: { type: "button" },
  });
  boton.appendChild(crearIconoSvg(icono));
  boton.appendChild(etiquetaTexto);

  boton.addEventListener("click", () => {
    if (lista === "vistas") almacen.alternarVista(pelicula);
    if (lista === "pendientes") almacen.alternarPendiente(pelicula);
    if (lista === "favoritas") almacen.alternarFavorita(pelicula);

    const activaAhora = estaActiva();
    etiquetaTexto.textContent = activaAhora ? textoActivo : textoBase;
    boton.className = activaAhora ? "boton boton--activo" : "boton boton--secundario";
  });

  return boton;
}

function crearSeccionReparto(creditos) {
  const seccion = crearElemento("section", { clase: "seccion-detalle" }, [
    crearElemento("h2", { texto: "Reparto principal" }),
  ]);

  const reparto = (creditos.cast || []).slice(0, 10);

  if (reparto.length === 0) {
    seccion.appendChild(
      crearElemento("p", { clase: "mensaje-estado", texto: "No hay información de reparto disponible." })
    );
    return seccion;
  }

  const rejilla = crearElemento("div", { clase: "rejilla-reparto" });

  reparto.forEach((actor) => {
    const urlFoto = obtenerUrlPerfil(actor.profile_path);

    const imagen = crearElemento("img", {
      clase: "tarjeta-actor__foto",
      atributos: {
        src: urlFoto || "",
        alt: `Foto de ${actor.name}`,
        loading: "lazy",
      },
    });

    const nombre = crearElemento("p", { clase: "tarjeta-actor__nombre", texto: actor.name });
    const personaje = crearElemento("p", { clase: "tarjeta-actor__personaje", texto: actor.character || "" });

    const enlace = crearElemento("a", {
      clase: "tarjeta-actor",
      atributos: { href: `actor.html?id=${actor.id}` },
    });
    enlace.appendChild(imagen);
    enlace.appendChild(nombre);
    enlace.appendChild(personaje);

    rejilla.appendChild(enlace);
  });

  seccion.appendChild(rejilla);
  return seccion;
}

function crearSeccionSimilares(similares) {
  const seccion = crearElemento("section", { clase: "seccion-detalle" }, [
    crearElemento("h2", { texto: "Películas similares" }),
  ]);

  const peliculas = (similares.results || []).slice(0, 8);

  if (peliculas.length === 0) {
    seccion.appendChild(
      crearElemento("p", { clase: "mensaje-estado", texto: "No hay películas similares disponibles." })
    );
    return seccion;
  }

  const rejilla = crearElemento("div", { clase: "rejilla-peliculas" });
  peliculas.forEach((pelicula) => rejilla.appendChild(crearTarjetaPelicula(pelicula)));
  seccion.appendChild(rejilla);

  return seccion;
}

function pintarDetalle(datos) {
  const pagina = document.getElementById("pagina-detalle");
  vaciarElemento(pagina);

  const pelicula = normalizarPelicula(datos);
  const urlBackdrop = obtenerUrlBackdrop(datos.backdrop_path);
  const urlPoster = obtenerUrlPoster(datos.poster_path);
  const director = obtenerDirector(datos.credits ? datos.credits.crew : []);

  const cabecera = crearElemento("div", { clase: "detalle-cabecera" });
  if (urlBackdrop) {
    cabecera.style.backgroundImage = `linear-gradient(180deg, rgba(20,24,27,0.55), rgba(20,24,27,0.97)), url(${urlBackdrop})`;
  }

  const posterImg = crearElemento("img", {
    clase: "detalle-cabecera__poster",
    atributos: { src: urlPoster || "", alt: `Póster de ${pelicula.titulo}` },
  });

  const nivelValoracion =
    Number(pelicula.valoracion) >= 7.5 ? "alta" : Number(pelicula.valoracion) >= 5 ? "media" : "baja";

  const badgeValoracion = crearElemento(
    "div",
    { clase: `valoracion-destacada valoracion-destacada--${nivelValoracion}` },
    [
      crearElemento("span", { clase: "valoracion-destacada__numero", texto: pelicula.valoracion }),
      crearElemento("span", { clase: "valoracion-destacada__sobre", texto: "/ 10" }),
    ]
  );

  const etiquetasGeneros = crearElemento(
    "div",
    { clase: "detalle-cabecera__generos" },
    (datos.genres || []).map((genero) => crearElemento("span", { clase: "etiqueta", texto: genero.name }))
  );

  const info = crearElemento("div", { clase: "detalle-cabecera__info" }, [
    crearElemento("h1", { texto: pelicula.titulo }),
    crearElemento("p", {
      clase: "detalle-cabecera__meta",
      texto: `${pelicula.anio} · Dir. ${director} · ${formatearDuracion(datos.runtime)}`,
    }),
    etiquetasGeneros,
    crearElemento("h2", { clase: "detalle-cabecera__subtitulo", texto: "Sinopsis" }),
    crearElemento("p", { clase: "detalle-cabecera__sinopsis", texto: pelicula.sinopsis }),
  ]);

  const acciones = crearElemento("div", { clase: "detalle-cabecera__acciones" }, [
    crearBotonAccion(pelicula, "vistas", "ojo", "Marcar como vista", "Vista"),
    crearBotonAccion(pelicula, "pendientes", "reloj", "Añadir a pendientes", "En pendientes"),
    crearBotonAccion(pelicula, "favoritas", "corazon", "Añadir a favoritas", "Favorita"),
  ]);
  info.appendChild(acciones);

  const envoltorioPoster = crearElemento("div", { clase: "detalle-cabecera__poster-envoltorio" }, [
    posterImg,
    badgeValoracion,
  ]);

  const cuerpoCabecera = crearElemento("div", { clase: "detalle-cabecera__cuerpo contenedor" }, [
    envoltorioPoster,
    info,
  ]);
  cabecera.appendChild(cuerpoCabecera);

  const contenidoInferior = crearElemento("div", { clase: "contenedor" }, [
    crearSeccionReparto(datos.credits || {}),
    crearSeccionSimilares(datos.similar || {}),
  ]);

  pagina.className = "";
  pagina.appendChild(cabecera);
  pagina.appendChild(contenidoInferior);
}

async function inicializarPagina() {
  marcarNavegacionActiva("detalle");
  const pagina = document.getElementById("pagina-detalle");
  const id = obtenerIdDesdeUrl();

  if (!id) {
    mostrarMensajeEstado(pagina, "No se ha indicado ninguna película. Vuelve a la búsqueda para elegir una.", true);
    return;
  }

  try {
    const datos = await api.obtenerDetalle(id);
    pintarDetalle(datos);
  } catch (error) {
    mostrarMensajeEstado(pagina, error.message, true);
  }
}

inicializarPagina();
