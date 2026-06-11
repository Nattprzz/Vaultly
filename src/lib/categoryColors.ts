import type { AppCategoryId } from './categories';

/**
 * Centralised default accent colors per category.
 * These are the canonical "brand" colors for each content type — chosen to
 * read clearly in both light and dark mode and to stay distinguishable from
 * one another at a glance (badges, chips, active filters, progress bars…).
 *
 *   Videojuegos → azul   Películas → naranja   Series → violeta
 *   Libros      → ámbar  Conciertos → rosa/magenta
 *
 * NOTE: these are pure *accents* — chips, badges, icons, active filters.
 * They never define a page's primary color or background; the interface's
 * single primary color is the brand blue (`--brand-accent`).
 */
export const DEFAULT_CATEGORY_COLORS: Record<AppCategoryId, string> = {
  videojuegos: '#3b82f6', // blue-500
  peliculas: '#f97316',   // orange-500
  series: '#8b5cf6',      // violet-500
  libros: '#fbbf24',      // amber-400
  conciertos: '#ec4899',  // pink-500
};

export type CategoryColorMap = Partial<Record<AppCategoryId, string>>;

const HEX_RE = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i;

/** Validates a user-supplied color string (we only accept 3/6-digit hex). */
export function isValidHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_RE.test(value.trim());
}

/** Normalises a hex color to its 6-digit lowercase `#rrggbb` form. */
export function normalizeHexColor(value: string): string {
  const v = value.trim().toLowerCase();
  if (/^#([0-9a-f]{3})$/.test(v)) {
    return '#' + v.slice(1).split('').map(c => c + c).join('');
  }
  return v;
}

/** Appends an alpha suffix (00-ff) to a 6-digit hex color, e.g. withAlpha('#84cc16', 0x20) → '#84cc1620'. */
export function withAlpha(hex: string, alphaHex: string): string {
  return `${hex}${alphaHex}`;
}

/** Resolves the effective accent color for a category: user override → default. */
export function resolveCategoryColor(id: AppCategoryId, overrides: CategoryColorMap | null | undefined): string {
  const override = overrides?.[id];
  if (override && isValidHexColor(override)) return normalizeHexColor(override);
  return DEFAULT_CATEGORY_COLORS[id];
}

/** Sanitises a raw overrides object (e.g. coming from Supabase/localStorage JSON) into a safe color map. */
export function sanitizeCategoryColorMap(raw: unknown): CategoryColorMap {
  if (!raw || typeof raw !== 'object') return {};
  const out: CategoryColorMap = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (isValidHexColor(value) && key in DEFAULT_CATEGORY_COLORS) {
      out[key as AppCategoryId] = normalizeHexColor(value);
    }
  }
  return out;
}
