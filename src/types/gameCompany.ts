/**
 * gameCompany.ts — tipos para compañías de videojuegos.
 *
 * Define la estructura de datos que proviene de la tabla `game_companies`,
 * enriquecida con información de IGDB. Se utiliza en la página de compañía
 * y en el hook useGameCompany.
 */

// ─── Tipos ─────────────────────────────────────────────────────────────
/**
 * Juego representativo dentro del catálogo de una compañía.
 */
export interface GameCompanyGame {
  /** ID interno de IGDB */
  igdb_id?: number | null;
  /** Slug normalizado para navegación interna */
  slug?: string | null;
  /** Título del juego */
  title: string;
  /** URL de la portada */
  cover_url?: string | null;
  /** Año de lanzamiento */
  release_year?: number | string | null;
  /** Géneros asociados */
  genres: string[];
  /** Plataformas en las que está disponible */
  platforms: string[];
  /** Puntuación media de IGDB */
  rating?: number | null;
  /** Número de puntuaciones en IGDB */
  rating_count?: number | null;
}

/**
 * Compañía relacionada con la compañía principal.
 */
export interface RelatedGameCompany {
  /** ID interno de IGDB */
  igdb_id?: number | null;
  /** Slug para navegación interna */
  slug?: string | null;
  /** Nombre de la compañía relacionada */
  name: string;
  /** Tipo de relación (subsidiaria, publicadora, etc.) */
  relation?: string | null;
  /** Roles que desempeña esta compañía */
  roles?: string[];
  /** Número de juegos compartidos con la compañía principal */
  shared_games_count?: number | null;
}

/**
 * Elemento de una lista de facetas (géneros, plataformas) con conteo opcional.
 */
export interface GameCompanyFacet {
  /** Nombre del elemento */
  name: string;
  /** Número de juegos asociados a esta faceta */
  count?: number | null;
}

/**
 * URLs de presencia en redes y sitios externos de la compañía.
 */
export interface GameCompanyLinks {
  /** Página web oficial */
  website: string | null;
  /** Perfil de Twitter / X */
  twitter: string | null;
  /** Servidor de Discord */
  discord: string | null;
  /** Artículo de Wikipedia */
  wikipedia: string | null;
  /** Perfil de LinkedIn */
  linkedin: string | null;
}

/**
 * Compañía de videojuegos completa, tal como se almacena en Vaultly.
 * Combina datos de IGDB con enriquecimiento propio (descripción en español, sincronización).
 */
export interface GameCompany {
  /** ID interno de Vaultly (UUID) */
  id?: string;
  /** ID numérico de IGDB */
  igdb_id: number;
  /** Identificador URL normalizado */
  slug: string;
  /** Nombre oficial de la compañía */
  name: string;
  /** Descripción en inglés */
  description: string | null;
  /** Descripción traducida al español */
  description_es: string | null;
  /** URL del logotipo */
  logo_url: string | null;
  /** País de origen */
  country: string | null;
  /** Estado actual (activa, cerrada, etc.) */
  status: string | null;
  /** Fecha de fundación */
  start_date: string | null;
  /** Fecha del último cambio de estado */
  changed_date: string | null;
  /** ID de IGDB de la empresa matriz, si la tiene */
  parent_company_id: number | null;
  /** Nombre de la empresa matriz */
  parent_company_name: string | null;
  /** Número de juegos desarrollados */
  developed_count: number;
  /** Número de juegos publicados */
  published_count: number;
  /** Número de ports realizados */
  ported_count: number;
  /** Número de juegos apoyados (soporte técnico) */
  supported_count: number;
  /** Número de DLCs publicados */
  dlc_count: number;
  /** Número de juegos cancelados */
  cancelled_count: number;
  /** Puntuación media de todos sus juegos */
  average_rating: number | null;
  /** Total de puntuaciones recibidas */
  rating_count: number;
  /** Juegos más populares de la compañía */
  popular_games: GameCompanyGame[];
  /** Compañías con las que ha colaborado o que están relacionadas */
  related_companies: RelatedGameCompany[];
  /** Géneros más frecuentes en su catálogo */
  genres: GameCompanyFacet[];
  /** Plataformas en las que ha publicado */
  platforms: GameCompanyFacet[];
  /** Presencia en redes sociales y sitios externos */
  links: GameCompanyLinks;
  /** Datos adicionales no estructurados */
  metadata: Record<string, unknown>;
  /** Fecha de la última sincronización con IGDB */
  last_synced_at: string | null;
}
