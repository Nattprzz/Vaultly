/**
 * useAdminEntities.ts — gestión paginada de entidades desde el panel de administración.
 *
 * Carga la lista de entidades (personas, estudios, compañías) con soporte
 * para búsqueda con debounce, filtros por tipo y mínimo de ítems vinculados,
 * y ordenación. El campo item_count se calcula en dos pasos: la query principal
 * obtiene los registros y una segunda consulta a item_entities cuenta las asociaciones.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Fila de entidad tal como la consume el panel de administración. */
export interface AdminEntity {
  /** ID único de la entidad */
  id: string;
  /** Nombre visible */
  name: string;
  /** Tipo de entidad (person, studio, company, etc.) */
  type: string;
  /** Slug para enlazar al perfil de la entidad */
  slug: string;
  /** URL de la imagen de perfil, o null si no tiene */
  image: string | null;
  /** Biografía corta, o null si no tiene */
  bio: string | null;
  /** Metadatos adicionales de la entidad */
  metadata: Record<string, unknown> | null;
  /** Fecha de creación (ISO) */
  created_at: string;
  /** Número de ítems del catálogo que tienen esta entidad vinculada */
  item_count: number;
}

/** Campos por los que se puede ordenar la lista de entidades. */
export type SortField = 'created_at' | 'name' | 'item_count';

/** Dirección de ordenación. */
export type SortDir = 'asc' | 'desc';

/** Estado completo de los filtros del panel de entidades. */
export interface EntityFilters {
  /** Término de búsqueda por nombre (con debounce) */
  search: string;
  /** Tipo de entidad a mostrar, o 'all' para todos */
  type: string;
  /** Número mínimo de ítems vinculados (0 = sin filtro) */
  minItems: number;
  /** Campo por el que ordenar */
  sortField: SortField;
  /** Dirección de ordenación */
  sortDir: SortDir;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Valores por defecto de todos los filtros del panel de entidades. */
export const DEFAULT_FILTERS: EntityFilters = {
  search: '',
  type: 'all',
  minItems: 0,
  sortField: 'created_at',
  sortDir: 'desc',
};

const PAGE_SIZE = 25;

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Gestiona la lista paginada de entidades en el panel de administración.
 *
 * Responsabilidades:
 * - Cargar entidades con filtros combinados y paginación.
 * - Calcular item_count por entidad enriqueciendo con item_entities.
 * - Aplicar el ordenamiento por item_count en el cliente cuando sea necesario.
 * - Aplicar debounce de 350ms a la búsqueda por nombre.
 * - Mantener contadores por tipo para los filtros de categoría.
 */
export function useAdminEntities() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [entities, setEntities] = useState<AdminEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<EntityFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [filters.search]);

  // ─── Carga de datos ──────────────────────────────────────────────────────────

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

  const fetchEntities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = page * PAGE_SIZE - 1;

      let query = supabase
        .from('entities')
        .select('id, name, type, slug, image, bio, metadata, created_at', { count: 'exact' });

      if (filters.type !== 'all') query = query.eq('type', filters.type);
      if (debouncedSearch.trim()) query = query.ilike('name', `%${debouncedSearch.trim()}%`);

      if (filters.sortField !== 'item_count') {
        query = query.order(filters.sortField, { ascending: filters.sortDir === 'asc' });
      } else {
        // item_count no existe en la tabla: se ordena en el cliente tras enriquecer
        query = query.order('created_at', { ascending: false });
      }

      query = query.range(from, to);

      const { data, error: dbErr, count } = await query;
      if (dbErr) throw dbErr;

      const rows = data ?? [];

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

      if (filters.sortField === 'item_count') {
        enriched = enriched.sort((a, b) =>
          filters.sortDir === 'desc'
            ? b.item_count - a.item_count
            : a.item_count - b.item_count
        );
      }

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

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const setFilter = useCallback(<K extends keyof EntityFilters>(key: K, value: EntityFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key !== 'search') setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  // ─── Datos derivados ──────────────────────────────────────────────────────────

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
