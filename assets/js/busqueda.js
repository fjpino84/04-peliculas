// Lógica de la página de búsqueda: texto libre + filtros avanzados.

function leerParametroUrl(nombre) {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get(nombre) || "";
}

function leerFiltrosFormulario() {
  const formulario = document.getElementById("formulario-filtros");
  const datos = new FormData(formulario);

  return {
    genero: datos.get("genero"),
    anioDesde: datos.get("anioDesde"),
    anioHasta: datos.get("anioHasta"),
    valoracionMinima: datos.get("valoracionMinima"),
    ordenarPor: datos.get("ordenarPor"),
  };
}

async function cargarGeneros() {
  const selectGenero = document.getElementById("filtro-genero");

  try {
    const datos = await api.obtenerGeneros();
    datos.genres.forEach((genero) => {
      const opcion = crearElemento("option", { texto: genero.name, atributos: { value: genero.id } });
      selectGenero.appendChild(opcion);
    });
  } catch (error) {
    // Si fallan los géneros no bloqueamos el resto de la búsqueda,
    // el select simplemente queda con la opción "Todos".
  }
}

function mostrarContador(total, textoConsulta) {
  const contador = document.getElementById("contador-resultados");

  if (total === undefined) {
    contador.textContent = "";
    return;
  }

  contador.textContent = textoConsulta
    ? `${total} resultado(s) para "${textoConsulta}"`
    : `${total} película(s) encontradas`;
}

async function ejecutarBusqueda() {
  const rejilla = document.getElementById("rejilla-resultados");
  const texto = document.getElementById("entrada-busqueda").value.trim();
  const filtros = leerFiltrosFormulario();

  mostrarMensajeEstado(rejilla, "Buscando películas…");

  try {
    let datos;

    if (texto) {
      datos = await api.buscarPeliculas(texto);
    } else {
      datos = await api.descubrirPeliculas(filtros);
    }

    mostrarContador(datos.total_results, texto);
    pintarRejillaPeliculas(rejilla, datos.results);
  } catch (error) {
    mostrarContador(undefined);
    mostrarMensajeEstado(rejilla, error.message, true);
  }
}

function inicializarFormularios() {
  const formularioBusqueda = document.getElementById("formulario-busqueda");
  const formularioFiltros = document.getElementById("formulario-filtros");
  const botonReset = document.getElementById("boton-reset-filtros");

  formularioBusqueda.addEventListener("submit", (evento) => {
    evento.preventDefault();
    ejecutarBusqueda();
  });

  formularioFiltros.addEventListener("submit", (evento) => {
    evento.preventDefault();
    document.getElementById("entrada-busqueda").value = "";
    ejecutarBusqueda();
  });

  botonReset.addEventListener("click", () => {
    formularioFiltros.reset();
    ejecutarBusqueda();
  });
}

async function inicializarPagina() {
  marcarNavegacionActiva("busqueda");
  inicializarFormularios();
  await cargarGeneros();

  const consultaInicial = leerParametroUrl("q");
  if (consultaInicial) {
    document.getElementById("entrada-busqueda").value = consultaInicial;
  }

  ejecutarBusqueda();
}

inicializarPagina();
