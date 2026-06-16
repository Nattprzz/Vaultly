/**
 * categoryConfig.ts — configuración estática de las cinco categorías de Vaultly.
 *
 * Define la forma CategoryConfig y el array CATEGORIES con los metadatos base
 * (icono, gradiente, imagen de hero, descripción) de cada categoría.
 * Los colores de acento se toman de categoryColors.ts para evitar duplicación;
 * usa useCategories() en lugar de este array cuando necesites el color resuelto
 * con las personalizaciones del usuario aplicadas.
 */

// ─── Librerías externas ──────────────────────────────────────────────────────

import { DEFAULT_CATEGORY_COLORS } from './categoryColors';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/**
 * Configuración visual y descriptiva de una categoría de Vaultly.
 * El campo `accent` refleja el color por defecto; para el color resuelto
 * con personalizaciones del usuario usa useCategories().
 */
export type CategoryConfig = {
  /** Identificador interno de la categoría */
  id: 'videojuegos' | 'peliculas' | 'series' | 'libros' | 'conciertos';
  /** Nombre legible para mostrar en la interfaz */
  label: string;
  /** Clase de icono remixicon */
  icon: string;
  /** Clases Tailwind para el gradiente de color */
  color: string;
  /** Color hexadecimal de acento (ver categoryColors.ts para overrides) */
  accent: string;
  /** Contador de ítems (se rellena dinámicamente en runtime) */
  count: number;
  /** Descripción breve de la categoría */
  description: string;
  /** URL de imagen de hero para la página de catálogo */
  image: string;
};

// ─── Constantes ───────────────────────────────────────────────────────────────

/**
 * Lista estática de las cinco categorías de Vaultly en el orden de visualización.
 * No usar directamente en componentes que deban reflejar colores personalizados;
 * importar useCategories() de @/hooks/useCategoryColors en su lugar.
 */
export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'videojuegos',
    label: 'Videojuegos',
    icon: 'ri-gamepad-line',
    color: 'from-blue-500 to-blue-700',
    accent: DEFAULT_CATEGORY_COLORS.videojuegos,
    count: 0,
    description: 'Juegos de todas las plataformas y generos',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'peliculas',
    label: 'Peliculas',
    icon: 'ri-film-line',
    color: 'from-orange-500 to-orange-700',
    accent: DEFAULT_CATEGORY_COLORS.peliculas,
    count: 0,
    description: 'Cine clasico, blockbusters e indie',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'series',
    label: 'Series',
    icon: 'ri-tv-2-line',
    color: 'from-violet-500 to-indigo-700',
    accent: DEFAULT_CATEGORY_COLORS.series,
    count: 0,
    description: 'Series de TV, streaming y anime',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'libros',
    label: 'Libros',
    icon: 'ri-book-open-line',
    color: 'from-amber-400 to-amber-600',
    accent: DEFAULT_CATEGORY_COLORS.libros,
    count: 0,
    description: 'Novelas, ensayos, comics y mas',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'conciertos',
    label: 'Conciertos',
    icon: 'ri-music-2-line',
    color: 'from-pink-500 to-fuchsia-700',
    accent: DEFAULT_CATEGORY_COLORS.conciertos,
    count: 0,
    description: 'Eventos en vivo, festivales y giras',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
  },
];
