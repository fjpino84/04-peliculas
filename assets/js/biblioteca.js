// Lógica de la página Mi Biblioteca: pestañas Vistas / Pendientes / Favoritas.

let listaActiva = "vistas";

function crearTarjetaBiblioteca(pelicula, lista) {
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

  const enlaceTitulo = crearElemento("a", {
    clase: "tarjeta-pelicula__titulo",
    texto: pelicula.titulo,
    atributos: { href: `detalle.html?id=${pelicula.id}` },
  });

  const botonQuitar = crearElemento("button", {
    clase: "boton boton--secundario boton-quitar",
    texto: "Quitar de la lista",
    atributos: { type: "button" },
  });

  botonQuitar.addEventListener("click", () => {
    almacen.quitarDeLista(pelicula.id, lista);
    pintarPestanaActiva();
    actualizarContadores();
  });

  const cuerpo = crearElemento("div", { clase: "tarjeta-pelicula__cuerpo" }, [
    enlaceTitulo,
    crearElemento("p", { clase: "tarjeta-pelicula__meta", texto: pelicula.anio }),
    botonQuitar,
  ]);

  return crearElemento("article", { clase: "tarjeta-pelicula" }, [envoltorioPoster, cuerpo]);
}

function pintarPestanaActiva() {
  const rejilla = document.getElementById("rejilla-biblioteca");
  const biblioteca = almacen.obtenerBiblioteca();
  const peliculas = Object.values(biblioteca[listaActiva]);

  vaciarElemento(rejilla);

  if (peliculas.length === 0) {
    rejilla.appendChild(
      crearElemento("p", {
        clase: "mensaje-estado",
        texto: "Todavía no has añadido ninguna película a esta lista.",
      })
    );
    return;
  }

  peliculas.forEach((pelicula) => {
    rejilla.appendChild(crearTarjetaBiblioteca(pelicula, listaActiva));
  });
}

function actualizarContadores() {
  document.getElementById("contador-vistas").textContent = almacen.contarLista("vistas");
  document.getElementById("contador-pendientes").textContent = almacen.contarLista("pendientes");
}

function inicializarPestanas() {
  const botones = document.querySelectorAll(".biblioteca-pestanas [data-lista]");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      listaActiva = boton.dataset.lista;

      botones.forEach((otro) => {
        otro.classList.remove("boton--activo");
        otro.classList.add("boton--secundario");
      });
      boton.classList.remove("boton--secundario");
      boton.classList.add("boton--activo");

      pintarPestanaActiva();
    });
  });
}

marcarNavegacionActiva("biblioteca");
inicializarPestanas();
pintarPestanaActiva();
actualizarContadores();
