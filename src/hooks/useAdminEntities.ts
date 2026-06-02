import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface AdminEntity {
  id: string;
  name: string;
  type: string;
  slug: string;
  image: string | null;
  bio: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  item_count: number;
}

export type SortField = 'created_at' | 'name' | 'item_count';
export type SortDir = 'asc' | 'desc';

export interface EntityFilters {
  search: string;
  type: string;
  minItems: number;
  sortField: SortField;
  sortDir: SortDir;
}

export const DEFAULT_FILTERS: EntityFilters = {
  search: '',
  type: 'all',
  minItems: 0,
  sortField: 'created_at',
  sortDir: 'desc',
};

const PAGE_SIZE = 25;

export function useAdminEntities() {
  const [entities, setEntities] = useState<AdminEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<EntityFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [filters.search]);

  // Fetch type counts (once, or when type filter changes)
  const fetchTypeCounts = useCallback(async () => {
    const { data } = await supabase
      .from('entities')
      .select('type');
    if (!data) return;
    const counts: Record<string, number> = {};
    data.forEach((r: { type: string }) => {
      counts[r.type] = (counts[r.type] ?? 0) + 1;
    });
    setTypeCounts(counts);
  }, []);

  useEffect(() => { fetchTypeCounts(); }, [fetchTypeCounts]);

  // Main fetch
  const fetchEntities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = page * PAGE_SIZE - 1;

      // Build base query
      let query = supabase
        .from('entities')
        .select('id, name, type, slug, image, bio, metadata, created_at', { count: 'exact' });

      // Filters
      if (filters.type !== 'all') query = query.eq('type', filters.type);
      if (debouncedSearch.trim()) query = query.ilike('name', `%${debouncedSearch.trim()}%`);

      // Sort
      if (filters.sortField !== 'item_count') {
        query = query.order(filters.sortField, { ascending: filters.sortDir === 'asc' });
      } else {
        // item_count sort: we'll sort client-side after enriching
        query = query.order('created_at', { ascending: false });
      }

      query = query.range(from, to);

      const { data, error: dbErr, count } = await query;
      if (dbErr) throw dbErr;

      const rows = data ?? [];

      // Fetch item counts for this page
      const ids = rows.map((e: any) => e.id);
      let counts: Record<string, number> = {};
      if (ids.length > 0) {
        const { data: countData } = await supabase
          .from('item_entities')
          .select('entity_id')
          .in('entity_id', ids);
        if (countData) {
          countData.forEach((r: { entity_id: string }) => {
            counts[r.entity_id] = (counts[r.entity_id] ?? 0) + 1;
          });
        }
      }

      let enriched: AdminEntity[] = rows.map((e: any) => ({
        ...e,
        item_count: counts[e.id] ?? 0,
      }));

      // Client-side item_count sort (only for current page)
      if (filters.sortField === 'item_count') {
        enriched = enriched.sort((a, b) =>
          filters.sortDir === 'desc'
            ? b.item_count - a.item_count
            : a.item_count - b.item_count
        );
      }

      // Filter by minItems client-side
      if (filters.minItems > 0) {
        enriched = enriched.filter(e => e.item_count >= filters.minItems);
      }

      setEntities(enriched);
      setTotal(count ?? 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, filters.type, filters.sortField, filters.sortDir, filters.minItems, debouncedSearch]);

  useEffect(() => { fetchEntities(); }, [fetchEntities]);

  const setFilter = useCallback(<K extends keyof EntityFilters>(key: K, value: EntityFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key !== 'search') setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const activeFilterCount = [
    filters.type !== 'all',
    filters.minItems > 0,
    filters.sortField !== 'created_at' || filters.sortDir !== 'desc',
    filters.search.trim().length > 0,
  ].filter(Boolean).length;

  return {
    entities, total, typeCounts, loading, error,
    filters, setFilter, resetFilters, activeFilterCount,
    page, setPage, totalPages, pageSize: PAGE_SIZE,
    fetchEntities, fetchTypeCounts,
  };
}
