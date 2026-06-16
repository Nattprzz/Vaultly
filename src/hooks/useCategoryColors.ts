/**
 * useCategoryColors.ts — contexto y hooks para colores de categoría personalizables.
 *
 * Provee los colores de acento resueltos (override del usuario → default) a toda
 * la aplicación a través de un Context. Los cambios se persisten en Supabase
 * (usuarios autenticados) y en localStorage (todos los usuarios).
 * También inyecta variables CSS personalizadas (--cat-videojuegos, etc.)
 * en el documento para uso directo desde Tailwind y CSS.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  createElement,
  type ReactNode,
} from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';

// ─── Configuración ───────────────────────────────────────────────────────────

import { CATEGORIES, type CategoryConfig } from '@/lib/categoryConfig';
import {
  DEFAULT_CATEGORY_COLORS,
  sanitizeCategoryColorMap,
  normalizeHexColor,
  isValidHexColor,
  type CategoryColorMap,
} from '@/lib/categoryColors';
import type { AppCategoryId } from '@/lib/categories';

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Clave de localStorage para los overrides de color del usuario. */
export const CATEGORY_COLORS_STORAGE_KEY = 'vaultly-category-colors';

// ─── Funciones auxiliares ────────────────────────────────────────────────────

function loadLocalOverrides(): CategoryColorMap {
  try {
    const raw = localStorage.getItem(CATEGORY_COLORS_STORAGE_KEY);
    if (raw) return sanitizeCategoryColorMap(JSON.parse(raw));
  } catch { /* ignore */ }
  return {};
}

function saveLocalOverrides(map: CategoryColorMap) {
  try {
    localStorage.setItem(CATEGORY_COLORS_STORAGE_KEY, JSON.stringify(map));
  } catch { /* ignore */ }
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

/**
 * Valor expuesto por el contexto de colores de categoría.
 */
export interface CategoryColorsValue {
  /** Color de acento resuelto para cada categoría (override → default). */
  colors: Record<AppCategoryId, string>;
  /** Overrides definidos por el usuario, sin incluir valores por defecto. */
  overrides: CategoryColorMap;
  /** Array CATEGORIES con el campo `accent` reemplazado por el color resuelto. */
  categories: CategoryConfig[];
  /** true cuando los colores han sido cargados (incluida la consulta a Supabase). */
  loaded: boolean;
  /**
   * Asigna un color personalizado a una categoría.
   * Solo acepta colores hex válidos (#rrggbb o #rgb).
   */
  setColor: (id: AppCategoryId, hex: string) => void;
  /** Elimina el override de una categoría, volviendo al color por defecto. */
  resetColor: (id: AppCategoryId) => void;
  /** Elimina todos los overrides, volviendo a los colores por defecto. */
  resetAll: () => void;
  /** Indica si una categoría tiene un color personalizado activo. */
  isCustomized: (id: AppCategoryId) => boolean;
}

// ─── Contexto ────────────────────────────────────────────────────────────────

const CategoryColorsContext = createContext<CategoryColorsValue | null>(null);

// ─── Estado interno del contexto ─────────────────────────────────────────────

function useCategoryColorsState(): CategoryColorsValue {
  const { user, isLoggedIn } = useAuth();
  const [overrides, setOverrides] = useState<CategoryColorMap>(loadLocalOverrides);
  const [loaded, setLoaded] = useState(false);

  // Sincronizar overrides desde Supabase al iniciar sesión
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

  // Persiste overrides en localStorage y Supabase
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

  // ─── Datos derivados ──────────────────────────────────────────────────────────

  const colors = useMemo<Record<AppCategoryId, string>>(() => ({
    videojuegos: overrides.videojuegos ?? DEFAULT_CATEGORY_COLORS.videojuegos,
    peliculas:   overrides.peliculas   ?? DEFAULT_CATEGORY_COLORS.peliculas,
    series:      overrides.series      ?? DEFAULT_CATEGORY_COLORS.series,
    libros:      overrides.libros      ?? DEFAULT_CATEGORY_COLORS.libros,
    conciertos:  overrides.conciertos  ?? DEFAULT_CATEGORY_COLORS.conciertos,
  }), [overrides]);

  const categories = useMemo<CategoryConfig[]>(
    () => CATEGORIES.map(cat => ({ ...cat, accent: colors[cat.id] })),
    [colors],
  );

  // Inyectar colores como variables CSS para uso desde Tailwind y CSS plano
  useEffect(() => {
    const root = document.documentElement;
    (Object.keys(colors) as AppCategoryId[]).forEach(id => {
      root.style.setProperty(`--cat-${id}`, colors[id]);
    });
  }, [colors]);

  const isCustomized = useCallback((id: AppCategoryId) => Boolean(overrides[id]), [overrides]);

  return { colors, overrides, categories, loaded, setColor, resetColor, resetAll, isCustomized };
}

// ─── Proveedor ───────────────────────────────────────────────────────────────

/**
 * Provee los colores de acento resueltos a toda la aplicación.
 * Debe montarse una única vez, cerca de la raíz del árbol de componentes,
 * por encima de cualquier componente que use colores de categoría.
 *
 * Orden de resolución de colores:
 * 1. Supabase user_tracker_settings.category_colors (usuarios autenticados).
 * 2. localStorage vaultly-category-colors (fallback para invitados y modo offline).
 * 3. Colores por defecto definidos en lib/categoryColors.ts.
 */
export function CategoryColorsProvider({ children }: { children: ReactNode }) {
  const value = useCategoryColorsState();
  return createElement(CategoryColorsContext.Provider, { value }, children);
}

// ─── Hooks consumidores ───────────────────────────────────────────────────────

function useCategoryColorsContext(): CategoryColorsValue {
  const ctx = useContext(CategoryColorsContext);
  if (!ctx) {
    throw new Error('useCategoryColors must be used within a <CategoryColorsProvider>');
  }
  return ctx;
}

/**
 * Acceso completo al sistema de colores: colores resueltos, overrides del usuario y acciones de edición.
 */
export function useCategoryColors(): CategoryColorsValue {
  return useCategoryColorsContext();
}

/**
 * Devuelve solo el mapa de colores resueltos por categoría.
 * Útil cuando únicamente se necesita el color, sin las acciones de edición.
 */
export function useCategoryColorMap(): Record<AppCategoryId, string> {
  return useCategoryColorsContext().colors;
}

/**
 * Reemplaza la importación estática de CATEGORIES con el array resuelto
 * con los colores personalizados del usuario aplicados.
 * Usar siempre que se necesite mostrar el color de acento de una categoría.
 */
export function useCategories(): CategoryConfig[] {
  return useCategoryColorsContext().categories;
}
