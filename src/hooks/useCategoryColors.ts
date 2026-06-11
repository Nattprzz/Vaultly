import { createContext, useContext, useState, useCallback, useEffect, useMemo, createElement, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { CATEGORIES, type CategoryConfig } from '@/lib/categoryConfig';
import {
  DEFAULT_CATEGORY_COLORS,
  sanitizeCategoryColorMap,
  normalizeHexColor,
  isValidHexColor,
  type CategoryColorMap,
} from '@/lib/categoryColors';
import type { AppCategoryId } from '@/lib/categories';

export const CATEGORY_COLORS_STORAGE_KEY = 'vaultly-category-colors';

function loadLocalOverrides(): CategoryColorMap {
  try {
    const raw = localStorage.getItem(CATEGORY_COLORS_STORAGE_KEY);
    if (raw) return sanitizeCategoryColorMap(JSON.parse(raw));
  } catch { /* empty */ }
  return {};
}

function saveLocalOverrides(map: CategoryColorMap) {
  try {
    localStorage.setItem(CATEGORY_COLORS_STORAGE_KEY, JSON.stringify(map));
  } catch { /* empty */ }
}

export interface CategoryColorsValue {
  /** Resolved accent color per category (override → default). */
  colors: Record<AppCategoryId, string>;
  /** Raw user overrides only (no defaults). */
  overrides: CategoryColorMap;
  /** `CATEGORIES` with `accent` swapped for the resolved color — drop-in replacement. */
  categories: CategoryConfig[];
  loaded: boolean;
  setColor: (id: AppCategoryId, hex: string) => void;
  resetColor: (id: AppCategoryId) => void;
  resetAll: () => void;
  isCustomized: (id: AppCategoryId) => boolean;
}

const CategoryColorsContext = createContext<CategoryColorsValue | null>(null);

function useCategoryColorsState(): CategoryColorsValue {
  const { user, isLoggedIn } = useAuth();
  const [overrides, setOverrides] = useState<CategoryColorMap>(loadLocalOverrides);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setLoaded(true);
      return;
    }

    let cancelled = false;
    supabase
      .from('user_tracker_settings')
      .select('category_colors')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(
        ({ data }) => {
          if (cancelled) return;
          const remote = sanitizeCategoryColorMap(data?.category_colors);
          if (Object.keys(remote).length > 0) {
            setOverrides(remote);
            saveLocalOverrides(remote);
          }
          setLoaded(true);
        },
        () => { if (!cancelled) setLoaded(true); },
      );

    return () => { cancelled = true; };
  }, [isLoggedIn, user]);

  const persist = useCallback(async (next: CategoryColorMap) => {
    saveLocalOverrides(next);
    if (!user) return;
    await supabase
      .from('user_tracker_settings')
      .upsert(
        { user_id: user.id, category_colors: next, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      );
  }, [user]);

  const setColor = useCallback((id: AppCategoryId, hex: string) => {
    if (!isValidHexColor(hex)) return;
    const normalized = normalizeHexColor(hex);
    setOverrides(prev => {
      const next = { ...prev, [id]: normalized };
      void persist(next);
      return next;
    });
  }, [persist]);

  const resetColor = useCallback((id: AppCategoryId) => {
    setOverrides(prev => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      void persist(next);
      return next;
    });
  }, [persist]);

  const resetAll = useCallback(() => {
    setOverrides({});
    void persist({});
  }, [persist]);

  const colors = useMemo<Record<AppCategoryId, string>>(() => ({
    videojuegos: overrides.videojuegos ?? DEFAULT_CATEGORY_COLORS.videojuegos,
    peliculas: overrides.peliculas ?? DEFAULT_CATEGORY_COLORS.peliculas,
    series: overrides.series ?? DEFAULT_CATEGORY_COLORS.series,
    libros: overrides.libros ?? DEFAULT_CATEGORY_COLORS.libros,
    conciertos: overrides.conciertos ?? DEFAULT_CATEGORY_COLORS.conciertos,
  }), [overrides]);

  const categories = useMemo<CategoryConfig[]>(
    () => CATEGORIES.map(cat => ({ ...cat, accent: colors[cat.id] })),
    [colors],
  );

  // Mirror the resolved colors as CSS custom properties (`--cat-videojuegos`…)
  // so plain CSS / Tailwind arbitrary-value utilities (e.g. `bg-[var(--cat-series)]`)
  // can use them too, without every consumer needing the hook.
  useEffect(() => {
    const root = document.documentElement;
    (Object.keys(colors) as AppCategoryId[]).forEach(id => {
      root.style.setProperty(`--cat-${id}`, colors[id]);
    });
  }, [colors]);

  const isCustomized = useCallback((id: AppCategoryId) => Boolean(overrides[id]), [overrides]);

  return { colors, overrides, categories, loaded, setColor, resetColor, resetAll, isCustomized };
}

/**
 * Provides the resolved category accent colors (and editing actions) to the
 * whole app. Mount once near the root so every screen — navbar, catalog,
 * tracker, dashboard, settings, admin… — stays in sync the instant a user
 * changes a category color.
 *
 * Resolution order: Supabase `user_tracker_settings.category_colors` (signed
 * in) → localStorage (`vaultly-category-colors`, also the fallback for guests
 * / offline) → built-in defaults from `lib/categoryColors.ts`.
 */
export function CategoryColorsProvider({ children }: { children: ReactNode }) {
  const value = useCategoryColorsState();
  return createElement(CategoryColorsContext.Provider, { value }, children);
}

function useCategoryColorsContext(): CategoryColorsValue {
  const ctx = useContext(CategoryColorsContext);
  if (!ctx) {
    throw new Error('useCategoryColors must be used within a <CategoryColorsProvider>');
  }
  return ctx;
}

/** Full access: resolved colors, raw overrides, resolved categories array, and editing actions. */
export function useCategoryColors(): CategoryColorsValue {
  return useCategoryColorsContext();
}

/** Just the resolved accent map, e.g. `colors[item.category]`. */
export function useCategoryColorMap(): Record<AppCategoryId, string> {
  return useCategoryColorsContext().colors;
}

/** Drop-in replacement for the static `CATEGORIES` import — same shape, user-resolved `accent`. */
export function useCategories(): CategoryConfig[] {
  return useCategoryColorsContext().categories;
}
