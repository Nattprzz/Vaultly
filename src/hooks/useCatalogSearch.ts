/**
 * useCatalogSearch.ts — búsqueda paginada del catálogo de Vaultly.
 *
 * Gestiona las peticiones a la Edge Function catalog-search con soporte de
 * caché en memoria por sesión, deduplicación por slug, paginación incremental
 * y cancelación de peticiones obsoletas al iniciar una nueva búsqueda.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { supabase } from '@/lib/supabase';
import { SUPABASE_ANON_KEY } from '@/lib/supabaseConfig';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { CatalogItemMetadata } from '@/types/metadata';

/**
 * Ítem de catálogo tal como lo devuelve la Edge Function catalog-search.
 */
export interface CatalogItem {
  /** UUID del ítem en catalog_items */
  id: string;
  /** Identificador único normalizado para URLs y el tracker */
  slug: string;
  /** Título del ítem */
  title: string;
  /** Descripción breve */
  description: string | null;
  /** URL de la imagen de portada */
  image_url: string | null;
  /** Fecha de lanzamiento en formato ISO (o parcial: "2023") */
  release_date: string | null;
  /** Fuente de datos: igdb, tmdb, google_books, ticketmaster, manual */
  source: string;
  /** ID del ítem en la fuente de datos original */
  source_item_id: string;
  /** Metadatos estructurados según la categoría */
  metadata: CatalogItemMetadata;
}

/** Origen de los resultados de una búsqueda. */
export type CacheSource = 'cache' | 'external' | 'external_cached';

interface PageResult {
  data: CatalogItem[];
  source: CacheSource;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const EDGE_FN_URL = edgeFunctionUrl('catalog-search');
const PAGE_SIZE = 20;

/** Caché en memoria por sesión: clave = "categoría:query:página". */
const memoryCache = new Map<string, PageResult>();

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Realiza búsquedas paginadas en el catálogo de Vaultly.
 *
 * Responsabilidades:
 * - Buscar ítems por categoría y texto libre via Edge Function.
 * - Cachear resultados en memoria para evitar peticiones redundantes.
 * - Deduplicar resultados por slug al paginar.
 * - Cancelar peticiones al iniciar una nueva búsqueda.
 * - Exponer estados de carga separados para búsqueda inicial y carga adicional.
 */
export function useCatalogSearch() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [results, setResults] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<CacheSource | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const currentQueryRef = useRef<{ category: string; query: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ─── Funciones internas ──────────────────────────────────────────────────────

  const fetchPage = useCallback(
    async (category: string, query: string, pageNum: number, append: boolean) => {
      const cacheKey = `${category}:${query.toLowerCase()}:${pageNum}`;

      if (memoryCache.has(cacheKey)) {
        const cached = memoryCache.get(cacheKey)!;
        if (append) {
          setResults(prev => {
            const existingSlugs = new Set(prev.map(i => i.slug));
            const newItems = cached.data.filter(i => !existingSlugs.has(i.slug));
            return [...prev, ...newItems];
          });
        } else {
          setResults(cached.data);
          setSource(cached.source);
        }
        setHasMore(cached.data.length >= PAGE_SIZE);
        setPage(pageNum);
        return;
      }

      // Cancelar la búsqueda anterior solo en búsquedas nuevas, no en "cargar más"
      if (!append) {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
      }

      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          category,
          query: query.trim(),
          page: String(pageNum),
        });
        const { data: sessionData } = await supabase.auth.getSession();
        const bearerToken = sessionData.session?.access_token ?? SUPABASE_ANON_KEY;
        const res = await fetch(`${EDGE_FN_URL}?${params}`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            apikey: SUPABASE_ANON_KEY,
          },
          signal: append ? undefined : abortRef.current?.signal,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }

        const json: PageResult & { cache_error?: string } = await res.json();
        const pageResult: PageResult = { data: json.data ?? [], source: json.source };
        memoryCache.set(cacheKey, pageResult);

        if (append) {
          setResults(prev => {
            const existingSlugs = new Set(prev.map(i => i.slug));
            const newItems = pageResult.data.filter(i => !existingSlugs.has(i.slug));
            return [...prev, ...newItems];
          });
        } else {
          setResults(pageResult.data);
          setSource(pageResult.source);
        }

        setHasMore(pageResult.data.length >= PAGE_SIZE);
        setPage(pageNum);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message);
        if (!append) setResults([]);
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    },
    []
  );

  // ─── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Inicia una nueva búsqueda desde la página 1.
   * Reemplaza los resultados existentes.
   *
   * @param category Categoría a buscar.
   * @param query Texto de búsqueda.
   */
  const search = useCallback(
    (category: string, query: string) => {
      if (!category || !query.trim()) return;
      currentQueryRef.current = { category, query: query.trim() };
      fetchPage(category, query.trim(), 1, false);
    },
    [fetchPage]
  );

  /**
   * Carga la siguiente página y la añade a los resultados actuales.
   */
  const loadMore = useCallback(() => {
    const ctx = currentQueryRef.current;
    if (!ctx || loadingMore || !hasMore) return;
    fetchPage(ctx.category, ctx.query, page + 1, true);
  }, [fetchPage, page, loadingMore, hasMore]);

  /**
   * Limpia el estado de búsqueda y cancela peticiones en vuelo.
   */
  const clear = useCallback(() => {
    abortRef.current?.abort();
    currentQueryRef.current = null;
    setResults([]);
    setError(null);
    setSource(null);
    setLoading(false);
    setLoadingMore(false);
    setPage(1);
    setHasMore(false);
  }, []);

  return {
    results,
    loading,
    loadingMore,
    error,
    source,
    page,
    hasMore,
    search,
    loadMore,
    clear,
  };
}
