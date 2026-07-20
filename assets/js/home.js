// Lógica de la página de inicio: hero destacado + tendencias.

function crearHero(peliculaOriginal) {
  const pelicula = normalizarPelicula(peliculaOriginal);
  const urlBackdrop = obtenerUrlBackdrop(pelicula.backdrop);

  const hero = crearElemento("div", { clase: "hero__interior" });
  if (urlBackdrop) {
    hero.style.backgroundImage = `linear-gradient(180deg, rgba(20,24,27,0.4), rgba(20,24,27,0.97)), url(${urlBackdrop})`;
  }

  const contenido = crearElemento("div", { clase: "hero__contenido" }, [
    crearElemento("span", { clase: "etiqueta", texto: `★ ${pelicula.valoracion}  ·  ${pelicula.anio}` }),
    crearElemento("h1", { clase: "hero__titulo", texto: pelicula.titulo }),
    crearElemento("p", { clase: "hero__sinopsis", texto: pelicula.sinopsis }),
  ]);

  const acciones = crearElemento("div", { clase: "hero__acciones" });
  const enlaceDetalle = crearElemento("a", {
    clase: "boton boton--primario",
    texto: "Ver ficha",
    atributos: { href: `detalle.html?id=${pelicula.id}` },
  });

  const botonPendiente = crearElemento("button", {
    clase: "boton boton--secundario",
    texto: almacen.estaEnLista(pelicula.id, "pendientes")
      ? "En pendientes ✓"
      : "+ Añadir a pendientes",
    atributos: { type: "button" },
  });

  botonPendiente.addEventListener("click", () => {
    almacen.alternarPendiente(pelicula);
    botonPendiente.textContent = almacen.estaEnLista(pelicula.id, "pendientes")
      ? "En pendientes ✓"
      : "+ Añadir a pendientes";
  });

  acciones.appendChild(enlaceDetalle);
  acciones.appendChild(botonPendiente);
  contenido.appendChild(acciones);
  hero.appendChild(contenido);

  return hero;
}

async function cargarHero() {
  const contenedorHero = document.getElementById("hero");

  try {
    const datos = await api.obtenerPopulares();
    const destacada = datos.results && datos.results[0];

    if (!destacada) {
      mostrarMensajeEstado(contenedorHero, "No hay ninguna película destacada disponible ahora mismo.");
      return;
    }

    vaciarElemento(contenedorHero);
    contenedorHero.appendChild(crearHero(destacada));
  } catch (error) {
    mostrarMensajeEstado(contenedorHero, error.message, true);
  }
}

async function cargarTendencias() {
  const rejilla = document.getElementById("rejilla-tendencias");

  try {
    const datos = await api.obtenerPopulares();
    pintarRejillaPeliculas(rejilla, datos.results);
  } catch (error) {
    mostrarMensajeEstado(rejilla, error.message, true);
  }
}

function inicializarBusquedaRapida() {
  const formulario = document.getElementById("formulario-busqueda-rapida");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = document.getElementById("busqueda-rapida").value.trim();
    const destino = texto
      ? `busqueda.html?q=${encodeURIComponent(texto)}`
      : "busqueda.html";
    window.location.href = destino;
  });
}

marcarNavegacionActiva("home");
inicializarBusquedaRapida();
cargarHero();
cargarTendencias();
