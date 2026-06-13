/**
 * tracker-statuses.ts — fuente de verdad del sistema de estados de Vaultly.
 *
 * Todo lo relacionado con estados vive aquí: valores, etiquetas, colores,
 * iconos y helpers. Nada más en el proyecto debe repetir esta información.
 */

// ─── Categorías disponibles ───────────────────────────────────────────────────

export const CATEGORY_IDS = [
  'videojuegos',
  'peliculas',
  'series',
  'libros',
  'conciertos',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

// ─── Estados por categoría ────────────────────────────────────────────────────

export const CATEGORY_STATUSES = {
  videojuegos: ['wishlist', 'pending', 'playing',  'played',  'completed', 'platinum', 'abandoned'],
  peliculas:   ['wishlist', 'pending', 'watching', 'watched',  'abandoned'],
  series:      ['wishlist', 'pending', 'watching', 'watched',  'waiting_season', 'waiting_episode', 'abandoned'],
  libros:      ['wishlist', 'pending', 'reading',  'read'],
  conciertos:  ['wishlist', 'attended', 'missed'],
} as const satisfies Record<CategoryId, readonly string[]>;

export type CategoryStatus =
  (typeof CATEGORY_STATUSES)[CategoryId][number];

// ─── Grupos semánticos (para estadísticas cross-categoría) ────────────────────

export const SEMANTIC_GROUPS = {
  /** Estados que equivalen a "completado" en cualquier categoría */
  completed: ['completed', 'platinum', 'watched', 'read', 'played', 'attended'] as CategoryStatus[],
  /** Estados que equivalen a "en progreso" */
  active:    ['playing', 'watching', 'reading'] as CategoryStatus[],
  /** Estados que equivalen a "pendiente / wishlist" */
  pending:   ['wishlist', 'pending'] as CategoryStatus[],
  /** Estados que equivalen a "abandonado" */
  abandoned: ['abandoned', 'missed'] as CategoryStatus[],
} as const;

// ─── Tipo auxiliar de info de estado ─────────────────────────────────────────

export interface StatusInfo {
  /** Etiqueta española por defecto */
  label: string;
  /** Clase de remixicon */
  icon: string;
  /** Color principal (hex) */
  color: string;
  /** Color glow para efectos (rgba) */
  glow: string;
  /** Fondo tenue para badges (rgba) */
  bg: string;
  /** Clase Tailwind para el punto de color en tarjeta */
  dot: string;
  /** Clases Tailwind para el badge completo (cls + dot) */
  badge: { cls: string; dot: string };
}

// ─── Config maestra por estado ────────────────────────────────────────────────

export const STATUS_CONFIG: Record<CategoryStatus, StatusInfo> = {

  wishlist: {
    label: 'Wishlist',
    icon:  'ri-heart-line',
    color: '#64748b',
    glow:  'rgba(100,116,139,0.45)',
    bg:    'rgba(100,116,139,0.10)',
    dot:   'bg-slate-400',
    badge: { cls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400', dot: 'bg-slate-400' },
  },

  pending: {
    label: 'Pendiente',
    icon:  'ri-bookmark-line',
    color: '#f59e0b',
    glow:  'rgba(245,158,11,0.45)',
    bg:    'rgba(245,158,11,0.10)',
    dot:   'bg-amber-400',
    badge: { cls: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400', dot: 'bg-amber-400' },
  },

  playing: {
    label: 'Jugando',
    icon:  'ri-gamepad-line',
    color: '#3b82f6',
    glow:  'rgba(59,130,246,0.45)',
    bg:    'rgba(59,130,246,0.10)',
    dot:   'bg-blue-500',
    badge: { cls: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  },

  played: {
    label: 'Jugado',
    icon:  'ri-check-line',
    color: '#22c55e',
    glow:  'rgba(34,197,94,0.45)',
    bg:    'rgba(34,197,94,0.10)',
    dot:   'bg-green-400',
    badge: { cls: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400', dot: 'bg-green-400' },
  },

  completed: {
    label: 'Completado',
    icon:  'ri-checkbox-circle-line',
    color: '#16a34a',
    glow:  'rgba(22,163,74,0.45)',
    bg:    'rgba(22,163,74,0.10)',
    dot:   'bg-emerald-600',
    badge: { cls: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-600' },
  },

  platinum: {
    label: 'Platinado',
    icon:  'ri-trophy-line',
    color: '#d97706',
    glow:  'rgba(217,119,6,0.50)',
    bg:    'rgba(217,119,6,0.10)',
    dot:   'bg-amber-600',
    badge: { cls: 'bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-600' },
  },

  watching: {
    label: 'Viendo',
    icon:  'ri-film-line',
    color: '#3b82f6',
    glow:  'rgba(59,130,246,0.45)',
    bg:    'rgba(59,130,246,0.10)',
    dot:   'bg-blue-500',
    badge: { cls: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  },

  watched: {
    label: 'Vista',
    icon:  'ri-eye-line',
    color: '#22c55e',
    glow:  'rgba(34,197,94,0.45)',
    bg:    'rgba(34,197,94,0.10)',
    dot:   'bg-green-400',
    badge: { cls: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400', dot: 'bg-green-400' },
  },

  waiting_season: {
    label: 'Esperando temporada',
    icon:  'ri-calendar-todo-line',
    color: '#8b5cf6',
    glow:  'rgba(139,92,246,0.45)',
    bg:    'rgba(139,92,246,0.10)',
    dot:   'bg-violet-500',
    badge: { cls: 'bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
  },

  waiting_episode: {
    label: 'Esperando capítulo',
    icon:  'ri-time-line',
    color: '#a78bfa',
    glow:  'rgba(167,139,250,0.45)',
    bg:    'rgba(167,139,250,0.10)',
    dot:   'bg-violet-400',
    badge: { cls: 'bg-violet-100 dark:bg-violet-950/40 text-violet-500 dark:text-violet-300', dot: 'bg-violet-400' },
  },

  reading: {
    label: 'Leyendo',
    icon:  'ri-book-open-line',
    color: '#3b82f6',
    glow:  'rgba(59,130,246,0.45)',
    bg:    'rgba(59,130,246,0.10)',
    dot:   'bg-blue-500',
    badge: { cls: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  },

  read: {
    label: 'Leído',
    icon:  'ri-check-double-line',
    color: '#22c55e',
    glow:  'rgba(34,197,94,0.45)',
    bg:    'rgba(34,197,94,0.10)',
    dot:   'bg-green-400',
    badge: { cls: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400', dot: 'bg-green-400' },
  },

  abandoned: {
    label: 'Abandonado',
    icon:  'ri-close-circle-line',
    color: '#ef4444',
    glow:  'rgba(239,68,68,0.45)',
    bg:    'rgba(239,68,68,0.10)',
    dot:   'bg-red-500',
    badge: { cls: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  },

  attended: {
    label: 'Asistido',
    icon:  'ri-checkbox-circle-line',
    color: '#22c55e',
    glow:  'rgba(34,197,94,0.45)',
    bg:    'rgba(34,197,94,0.10)',
    dot:   'bg-green-500',
    badge: { cls: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  },

  missed: {
    label: 'No asistido',
    icon:  'ri-close-circle-line',
    color: '#b91c1c',
    glow:  'rgba(185,28,28,0.45)',
    bg:    'rgba(185,28,28,0.10)',
    dot:   'bg-red-700',
    badge: { cls: 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-600', dot: 'bg-red-700' },
  },
};

// ─── Overrides por categoría (label e icono) ──────────────────────────────────

type CategoryOverride = Partial<Pick<StatusInfo, 'label' | 'icon'>>;

const CATEGORY_OVERRIDES: Partial<Record<CategoryId, Partial<Record<CategoryStatus, CategoryOverride>>>> = {
  peliculas: {
    abandoned: { label: 'Abandonada' },
    watched:   { label: 'Vista' },
  },
  series: {
    watching:  { icon: 'ri-tv-2-line' },
    watched:   { label: 'Al día' },
    abandoned: { label: 'Abandonada' },
  },
};

// ─── Helpers públicos ─────────────────────────────────────────────────────────

/**
 * Devuelve los estados válidos para una categoría, en orden de UI.
 */
export function getCategoryStatuses(category: string): CategoryStatus[] {
  return [...((CATEGORY_STATUSES as Record<string, readonly CategoryStatus[]>)[category] ?? [])];
}

/**
 * Todos los valores de estado únicos en el sistema.
 */
export function getAllStatuses(): CategoryStatus[] {
  const seen = new Set<CategoryStatus>();
  for (const statuses of Object.values(CATEGORY_STATUSES)) {
    for (const s of statuses) seen.add(s as CategoryStatus);
  }
  return [...seen];
}

/**
 * Devuelve la info completa de un estado, aplicando overrides de categoría.
 */
export function getStatusInfo(status: CategoryStatus, category?: string): StatusInfo {
  const base = STATUS_CONFIG[status];
  if (!category || !CATEGORY_OVERRIDES[category as CategoryId]) return base;
  const override = CATEGORY_OVERRIDES[category as CategoryId]?.[status];
  if (!override) return base;
  return { ...base, ...override };
}

/**
 * Etiqueta española de un estado, con override de categoría si aplica.
 */
export function getStatusLabel(status: string, category?: string): string {
  if (!(status in STATUS_CONFIG)) return status;
  return getStatusInfo(status as CategoryStatus, category).label;
}

/**
 * Icono remixicon de un estado, con override de categoría si aplica.
 */
export function getStatusIcon(status: string, category?: string): string {
  if (!(status in STATUS_CONFIG)) return 'ri-question-line';
  return getStatusInfo(status as CategoryStatus, category).icon;
}

/**
 * Valida que un string sea un estado válido para una categoría concreta.
 */
export function isValidStatus(status: string, category: string): boolean {
  const valid = CATEGORY_STATUSES[category as CategoryId] as readonly string[] | undefined;
  return valid?.includes(status) ?? false;
}

/**
 * Estado inicial por defecto al añadir un ítem al tracker.
 * Para conciertos no hay 'pending', empieza en 'wishlist'.
 */
export function getDefaultStatus(category: string): CategoryStatus {
  if (category === 'conciertos') return 'wishlist';
  return 'pending';
}

/**
 * Texto de acción para la línea de tiempo de actividad reciente.
 */
export function getActionText(status: string): string {
  const map: Record<string, string> = {
    wishlist:        'Añadiste a wishlist',
    pending:         'Añadiste a pendientes',
    playing:         'Empezaste a jugar',
    played:          'Jugaste',
    completed:       'Completaste al 100%',
    platinum:        'Platinaste',
    watching:        'Empezaste a ver',
    watched:         'Viste',
    reading:         'Empezaste a leer',
    read:            'Leíste',
    waiting_season:  'Esperas temporada de',
    waiting_episode: 'Esperas capítulo de',
    abandoned:       'Abandonaste',
    attended:        'Asististe a',
    missed:          'No pudiste asistir a',
  };
  return map[status] ?? 'Actualizaste';
}
