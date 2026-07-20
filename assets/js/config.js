// Configuración de acceso a la API de TMDb (The Movie Database).
// En una app con backend esta clave nunca iría expuesta en el cliente,
// pero al ser un proyecto 100% estático sin servidor ni build step,
// se centraliza aquí para que sea el único punto a modificar.
const CONFIG = {
  API_KEY: "07c8288fcefbeaa0e2cb20895ff0d061",
  BASE_URL: "https://api.themoviedb.org/3",
  IMG_URL: "https://image.tmdb.org/t/p",
  IDIOMA: "es-ES",
  TAMANO_POSTER: "w342",
  TAMANO_BACKDROP: "w1280",
  TAMANO_PERFIL: "w185",
};
