// Helpers de creación de interfaz. Todo se construye con createElement/appendChild,
// nunca con innerHTML, según las normas de código del proyecto.

function crearElemento(etiqueta, opciones = {}, hijos = []) {
  const elemento = document.createElement(etiqueta);

  if (opciones.clase) elemento.className = opciones.clase;
  if (opciones.texto !== undefined) elemento.textContent = opciones.texto;
  if (opciones.atributos) {
    Object.entries(opciones.atributos).forEach(([nombre, valor]) => {
      elemento.setAttribute(nombre, valor);
    });
  }

  hijos.forEach((hijo) => {
    if (hijo) elemento.appendChild(hijo);
  });

  return elemento;
}

function normalizarPelicula(pelicula) {
  return {
    id: pelicula.id,
    titulo: pelicula.title,
    poster: pelicula.poster_path,
    backdrop: pelicula.backdrop_path,
    anio: (pelicula.release_date || "").slice(0, 4) || "—",
    valoracion: pelicula.vote_average ? pelicula.vote_average.toFixed(1) : "—",
    sinopsis: pelicula.overview || "Sin sinopsis disponible.",
  };
}

function crearTarjetaPelicula(peliculaOriginal) {
  const pelicula = normalizarPelicula(peliculaOriginal);
  const urlPoster = obtenerUrlPoster(pelicula.poster);

  const imagen = crearElemento("img", {
    clase: "tarjeta-pelicula__poster",
    atributos: {
      src: urlPoster || "",
      alt: `Póster de ${pelicula.titulo}`,
      loading: "lazy",
    },
  });

  const envoltorioPoster = crearElemento(
    "div",
    { clase: "tarjeta-pelicula__poster-envoltorio" },
    [
      imagen,
      crearElemento("span", {
        clase: "tarjeta-pelicula__valoracion",
        texto: `★ ${pelicula.valoracion}`,
      }),
    ]
  );

  const cuerpo = crearElemento("div", { clase: "tarjeta-pelicula__cuerpo" }, [
    crearElemento("h3", { clase: "tarjeta-pelicula__titulo", texto: pelicula.titulo }),
    crearElemento("p", { clase: "tarjeta-pelicula__meta", texto: pelicula.anio }),
  ]);

  const enlace = crearElemento("a", {
    clase: "tarjeta-pelicula",
    atributos: { href: `detalle.html?id=${pelicula.id}` },
  });
  enlace.appendChild(envoltorioPoster);
  enlace.appendChild(cuerpo);

  return enlace;
}

function pintarRejillaPeliculas(contenedor, peliculas) {
  vaciarElemento(contenedor);

  if (!peliculas || peliculas.length === 0) {
    contenedor.appendChild(
      crearElemento("p", {
        clase: "mensaje-estado",
        texto: "No se han encontrado películas con esos criterios.",
      })
    );
    return;
  }

  peliculas.forEach((pelicula) => {
    contenedor.appendChild(crearTarjetaPelicula(pelicula));
  });
}

function mostrarMensajeEstado(contenedor, texto, esError = false) {
  vaciarElemento(contenedor);
  contenedor.appendChild(
    crearElemento("p", {
      clase: esError ? "mensaje-estado mensaje-estado--error" : "mensaje-estado",
      texto,
    })
  );
}

function vaciarElemento(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

const RUTAS_ICONOS = {
  ojo: "M12 5c-5.5 0-9.6 3.8-11 7 1.4 3.2 5.5 7 11 7s9.6-3.8 11-7c-1.4-3.2-5.5-7-11-7zm0 11.5A4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 0 1 0 9zm0-7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  reloj: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13h-1.5v6l5.2 3.1.8-1.3-4.5-2.7V7z",
  corazon: "M12 21s-7.5-4.6-10.2-9.1C.3 9.1 1.4 5.6 4.6 4.6c1.9-.6 3.9.1 5.1 1.6l.8 1 .8-1c1.2-1.5 3.2-2.2 5.1-1.6 3.2 1 4.3 4.5 2.8 7.3C19.5 16.4 12 21 12 21z",
};

function crearIconoSvg(nombre, claseExtra = "") {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  if (claseExtra) svg.setAttribute("class", claseExtra);

  const trazo = document.createElementNS(NS, "path");
  trazo.setAttribute("d", RUTAS_ICONOS[nombre] || "");
  svg.appendChild(trazo);

  return svg;
}

function descargarCSV(nombre, contenido) {
  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const enlace = document.createElement("a");
  const url = URL.createObjectURL(blob);

  enlace.setAttribute("href", url);
  enlace.setAttribute("download", nombre);
  enlace.style.visibility = "hidden";

  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
}

function marcarNavegacionActiva(idPagina) {
  document.querySelectorAll(".navegacion__enlace").forEach((enlace) => {
    if (enlace.dataset.pagina === idPagina) {
      enlace.classList.add("navegacion__enlace--activo");
    }
  });
}
