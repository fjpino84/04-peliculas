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
    texto: "🗑️ Eliminar",
    atributos: { type: "button", title: "Quitar de la lista" },
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
  const biblioteca = almacen.obtenerBiblioteca();
  const totalPeliculas = new Set();

  Object.keys(biblioteca).forEach((lista) => {
    Object.keys(biblioteca[lista]).forEach((id) => totalPeliculas.add(id));
  });

  const total = totalPeliculas.size;
  const vistas = almacen.contarLista("vistas");
  const pendientes = almacen.contarLista("pendientes");
  const favoritas = almacen.contarLista("favoritas");

  document.getElementById("contador-vistas").textContent = vistas;
  document.getElementById("contador-pendientes").textContent = pendientes;
  document.getElementById("contador-favoritas").textContent = favoritas;

  const porcentajeVistas = total > 0 ? (vistas / total) * 100 : 0;
  const porcentajePendientes = total > 0 ? (pendientes / total) * 100 : 0;
  const porcentajeFavoritas = total > 0 ? (favoritas / total) * 100 : 0;

  document.getElementById("barra-vistas").style.width = `${porcentajeVistas}%`;
  document.getElementById("barra-pendientes").style.width = `${porcentajePendientes}%`;
  document.getElementById("barra-favoritas").style.width = `${porcentajeFavoritas}%`;
}

function generarCSV() {
  const biblioteca = almacen.obtenerBiblioteca();
  const todasLasPeliculas = [];

  Object.keys(biblioteca).forEach((lista) => {
    Object.values(biblioteca[lista]).forEach((pelicula) => {
      const indice = todasLasPeliculas.findIndex((p) => p.id === pelicula.id);
      if (indice === -1) {
        todasLasPeliculas.push({
          id: pelicula.id,
          titulo: pelicula.titulo,
          valoracion: pelicula.valoracion,
          anio: pelicula.anio,
          vistas: biblioteca.vistas[pelicula.id] ? "Sí" : "No",
          pendientes: biblioteca.pendientes[pelicula.id] ? "Sí" : "No",
          favoritas: biblioteca.favoritas[pelicula.id] ? "Sí" : "No",
        });
      } else {
        todasLasPeliculas[indice].vistas = biblioteca.vistas[pelicula.id] ? "Sí" : "No";
        todasLasPeliculas[indice].pendientes = biblioteca.pendientes[pelicula.id] ? "Sí" : "No";
        todasLasPeliculas[indice].favoritas = biblioteca.favoritas[pelicula.id] ? "Sí" : "No";
      }
    });
  });

  const encabezados = ["Nombre de la Película", "Puntuación", "Año", "Pendiente", "Vista", "Favorita"];
  const filas = todasLasPeliculas.map((p) => [
    `"${p.titulo.replace(/"/g, '""')}"`,
    p.valoracion,
    p.anio,
    p.pendientes === "Sí" ? "Sí" : "No",
    p.vistas === "Sí" ? "Sí" : "No",
    p.favoritas === "Sí" ? "Sí" : "No",
  ]);

  const contenidoCSV = [encabezados.join(","), ...filas.map((fila) => fila.join(","))].join("\n");

  // Agregar BOM (Byte Order Mark) para UTF-8 para que Excel lo reconozca correctamente
  const contenidoConBOM = "﻿" + contenidoCSV;

  descargarCSV("mi-biblioteca.csv", contenidoConBOM);
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

function inicializarBotonDescargar() {
  const botonDescargar = document.getElementById("boton-descargar-csv");
  if (botonDescargar) {
    botonDescargar.addEventListener("click", generarCSV);
  }
}

marcarNavegacionActiva("biblioteca");
inicializarPestanas();
inicializarBotonDescargar();
pintarPestanaActiva();
actualizarContadores();
