import { useState, useCallback, useRef } from 'react';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';

export interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  release_date: string | null;
  source: string;
  source_item_id: string;
  metadata: Record<string, unknown>;
}

export type CacheSource = 'cache' | 'external' | 'external_cached';

interface PageResult {
  data: CatalogItem[];
  source: CacheSource;
}

const EDGE_FN_URL = edgeFunctionUrl('catalog-search');
const PAGE_SIZE = 20;

// Per-page in-memory cache: key = "category:query:page"
const memoryCache = new Map<string, PageResult>();

export function useCatalogSearch() {
  const [results, setResults] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<CacheSource | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Track current search context so loadMore knows what to fetch
  const currentQueryRef = useRef<{ category: string; query: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (category: string, query: string, pageNum: number, append: boolean) => {
      const cacheKey = `${category}:${query.toLowerCase()}:${pageNum}`;

      if (memoryCache.has(cacheKey)) {
        const cached = memoryCache.get(cacheKey)!;
        if (append) {
          setResults(prev => {
            // Deduplicate by slug
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

      // Cancel previous request only on fresh search (not loadMore)
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
        const res = await fetch(`${EDGE_FN_URL}?${params}`, {
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

  /** Start a fresh search (page 1, replaces results) */
  const search = useCallback(
    (category: string, query: string) => {
      if (!category || !query.trim()) return;
      currentQueryRef.current = { category, query: query.trim() };
      fetchPage(category, query.trim(), 1, false);
    },
    [fetchPage]
  );

  /** Append next page to existing results */
  const loadMore = useCallback(() => {
    const ctx = currentQueryRef.current;
    if (!ctx || loadingMore || !hasMore) return;
    fetchPage(ctx.category, ctx.query, page + 1, true);
  }, [fetchPage, page, loadingMore, hasMore]);

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
