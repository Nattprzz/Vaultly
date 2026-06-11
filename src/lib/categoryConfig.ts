import { DEFAULT_CATEGORY_COLORS } from './categoryColors';

export type CategoryConfig = {
  id: 'videojuegos' | 'peliculas' | 'series' | 'libros' | 'conciertos';
  label: string;
  icon: string;
  color: string;
  accent: string;
  count: number;
  description: string;
  image: string;
};

// NOTE: `accent` here is the *default* brand color for each category — the
// single source of truth lives in `src/lib/categoryColors.ts`
// (DEFAULT_CATEGORY_COLORS) so Settings can offer per-user overrides without
// duplicating the palette. Use `useCategories()` from `@/hooks/useCategoryColors`
// instead of this array directly wherever the resolved (user-customised) accent
// should be shown — it returns this same shape with `accent` swapped for the
// user's chosen color when one is set.
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
