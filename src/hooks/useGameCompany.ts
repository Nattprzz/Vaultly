/**
 * useGameCompany.ts — carga del perfil de una compañía de videojuegos.
 *
 * Consulta la tabla game_companies via el servicio gameCompanies
 * y mantiene un caché en memoria para evitar peticiones redundantes
 * durante la sesión de navegación.
 *
 * Garantía de consistencia: `company` siempre corresponde al `slug` actual.
 * Si el slug cambia antes de que el efecto haya corrido (stale render),
 * se devuelve company: null y loading: true para evitar mostrar datos obsoletos.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { getGameCompanyBySlug } from '@/services/gameCompanies';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { GameCompany } from '@/types/gameCompany';

/**
 * Valor de retorno del hook useGameCompany.
 */
interface UseGameCompanyResult {
  /** Datos de la compañía, o null mientras se carga o si no se encontró */
  company: GameCompany | null;
  /** true mientras se realiza la consulta */
  loading: boolean;
  /** Mensaje de error, o null si no hay error */
  error: string | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Caché en memoria por sesión, con clave = slug de la compañía. */
const memCache = new Map<string, GameCompany | null>();

// ─── Tipos internos ───────────────────────────────────────────────────────────

/**
 * Par slug+datos almacenado en estado.
 * Se actualiza de forma atómica para que `company` y su `slug` siempre sean coherentes.
 */
interface LoadedEntry {
  slug: string;
  data: GameCompany | null;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Carga el perfil de una compañía de videojuegos por su slug.
 *
 * Responsabilidades:
 * - Consultar el caché en memoria antes de hacer la petición a Supabase.
 * - Almacenar el resultado en caché (incluido null para compañías no encontradas).
 * - Cancelar la actualización de estado si el componente se desmonta.
 * - Evitar el flash inicial (loading arranca como true cuando hay slug válido).
 * - Evitar el flash de datos obsoletos al navegar entre slugs.
 *
 * @param slug Slug de la compañía a cargar (puede ser undefined durante la carga inicial de la URL).
 */
export function useGameCompany(slug: string | undefined): UseGameCompanyResult {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  /**
   * Par {slug, data} cargado. Inicializado desde caché en el primer render
   * para que las navegaciones a compañías ya visitadas no muestren skeleton.
   */
  const [loadedEntry, setLoadedEntry] = useState<LoadedEntry | null>(() => {
    const s = slug?.trim();
    if (!s || !memCache.has(s)) return null;
    return { slug: s, data: memCache.get(s) ?? null };
  });

  /**
   * true mientras no tengamos datos para el slug actual.
   * Inicializado como true cuando hay slug válido sin caché, false si hay caché o no hay slug.
   */
  const [loading, setLoading] = useState<boolean>(() => {
    const s = slug?.trim();
    return Boolean(s) && !memCache.has(s);
  });

  const [error, setError] = useState<string | null>(null);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const safeSlug = slug?.trim();

    if (!safeSlug) {
      setLoadedEntry(null);
      setLoading(false);
      setError('Compañía no encontrada');
      return;
    }

    if (memCache.has(safeSlug)) {
      setLoadedEntry({ slug: safeSlug, data: memCache.get(safeSlug) ?? null });
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getGameCompanyBySlug(safeSlug)
      .then(result => {
        if (cancelled) return;
        memCache.set(safeSlug, result);
        setLoadedEntry({ slug: safeSlug, data: result });
      })
      .catch(err => {
        if (!cancelled) setError((err as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ─── Return ───────────────────────────────────────────────────────────────────

  const safeCurrentSlug  = slug?.trim() ?? null;
  const isCurrent        = loadedEntry?.slug === safeCurrentSlug;
  const isStale          = Boolean(safeCurrentSlug) && !isCurrent;

  return {
    company: isCurrent ? (loadedEntry?.data ?? null) : null,
    loading: loading || isStale,
    error:   isStale ? null : error,
  };
}
