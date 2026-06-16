/**
 * itemDetail.ts — tipos para la vista de detalle de un ítem del catálogo.
 *
 * Define la forma normalizada que consumen los componentes de detalle
 * (ItemHero, ItemInfo, ItemGallery, etc.) independientemente de la categoría.
 * Los campos específicos de cada categoría son opcionales.
 */

// ─── Tipos ─────────────────────────────────────────────────────────────
import type { CategoryStatus } from '@/constants/tracker-statuses';

/** Estado actual del ítem en el tracker del usuario, o null si no está añadido. */
export type TrackerStatus = CategoryStatus | null;

/**
 * Imagen de la galería de un ítem (capturas, carteles, etc.).
 */
export interface GalleryImage {
  /** Identificador único de la imagen */
  id: string;
  /** URL de la imagen */
  url: string;
  /** Texto descriptivo opcional */
  caption: string;
}

/**
 * Trailer normalizado para vistas de detalle.
 */
export interface ItemTrailer {
  /** Titulo visible del trailer */
  title?: string;
  /** URL externa del trailer */
  url: string;
  /** Miniatura opcional */
  thumbnail_url?: string;
  /** Fuente de reproduccion */
  source?: 'youtube' | 'vimeo' | 'igdb' | 'other';
}

/**
 * Miembro del reparto con su personaje asociado.
 */
export interface CastMember {
  /** Nombre real del actor o actriz */
  name: string;
  /** Personaje que interpreta */
  character: string;
  /** URL de la foto de perfil, o null si no está disponible */
  photo: string | null;
}

/**
 * Miembro del equipo técnico (director, guionista, compositor, etc.).
 */
export interface CrewMember {
  /** Nombre del profesional */
  name: string;
  /** Rol desempeñado en el proyecto */
  job: string;
}

/**
 * Detalle completo de un ítem del catálogo de Vaultly.
 *
 * Unifica en una sola interfaz los campos de todas las categorías.
 * Los campos marcados como opcionales solo se incluyen cuando la categoría lo requiere.
 */
export interface ItemDetail {
  /** Imágenes de la galería */
  gallery?: GalleryImage[];
  /** ID único del ítem */
  id: string;
  /** Categoría a la que pertenece */
  category: string;
  /** Título principal */
  title: string;
  /** URL de la portada o imagen principal */
  cover: string;
  /** URL de la imagen de fondo */
  backdrop: string;
  /** Puntuación de la API de origen (0-10) */
  rating: number;
  /** Año de lanzamiento */
  year: number;
  /** Género principal */
  genre: string;
  /** Descripción o sinopsis */
  description: string;
  /** Etiquetas adicionales de clasificación */
  tags: string[];

  // ─── Videojuegos ────────────────────────────────────────────────────────────
  /** Estudio desarrollador */
  developer?: string;
  /** Publisher o distribuidora */
  publisher?: string;
  /** Plataformas disponibles */
  platforms?: string[];

  // ─── Películas y series ─────────────────────────────────────────────────────
  /** Director o directora principal */
  director?: string;
  /** Lista de actores principales (nombres) */
  cast?: string[];
  /** Reparto detallado con personajes */
  cast_detailed?: CastMember[];
  /** Equipo técnico detallado */
  crew_detailed?: CrewMember[];
  /** Duración formateada (ej. "1h 58min") */
  duration?: string;
  /** Número de temporadas (series) */
  seasons?: number;
  /** Número total de episodios (series) */
  episodes?: number;
  /** Cadena o plataforma de emisión */
  network?: string;
  /** Idioma original */
  original_language?: string;
  /** País de origen */
  origin_country?: string;
  /** Productoras asociadas */
  production_companies?: string[];
  /** Palabras clave de TMDB */
  keywords?: string[];
  /** Clave del tráiler en YouTube */
  trailer_key?: string;
  /** Trailers completos disponibles para futuras galerias de video */
  trailers?: ItemTrailer[];
  /** URLs de imágenes de fondo adicionales */
  backdrops?: string[];
  /** Fecha del último episodio emitido */
  last_air_date?: string;
  /** Estado de la serie (en emisión, finalizada, etc.) */
  series_status?: string;

  // ─── Videojuegos (campos extendidos) ────────────────────────────────────────
  /** Puntuación de Metacritic */
  metacritic?: number;
  /** URL del sitio oficial */
  website?: string;
  /** Enlace externo a un mapa interactivo curado manualmente */
  interactive_map_url?: string;
  /** Fuente visible del mapa interactivo */
  interactive_map_source?: string;
  /** Clasificación ESRB de contenido */
  esrb?: string;
  /** Horas de juego estimadas */
  playtime?: number;
  /** Número de logros disponibles */
  achievements_count?: number;

  // ─── Libros ─────────────────────────────────────────────────────────────────
  /** Autor principal */
  author?: string;
  /** Lista de autores */
  authors?: string[];
  /** Número de páginas */
  pages?: number;
  /** ISBN del libro */
  isbn?: string;
  /** Idioma de la edición */
  language?: string;

  // ─── Conciertos ─────────────────────────────────────────────────────────────
  /** Nombre del recinto */
  venue?: string;
  /** Ciudad del evento */
  city?: string;
  /** País del evento */
  country?: string;
  /** Artista o banda principal */
  artist?: string;
  /** Lista de canciones del setlist */
  setlist?: string[];
  /** Fecha del evento */
  event_date?: string;
  /** Hora de inicio del evento */
  event_time?: string;

  // ─── Comunidad ──────────────────────────────────────────────────────────────
  /** Puntuación media de la comunidad de Vaultly */
  community_rating: number;
  /** Total de puntuaciones registradas en Vaultly */
  total_ratings: number;
  /** Total de reseñas escritas en Vaultly */
  total_reviews: number;
}
