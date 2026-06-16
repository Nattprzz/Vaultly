/**
 * useAdminCatalog.ts — CRUD del catálogo desde el panel de administración.
 *
 * Delega todas las operaciones al edge function admin-catalog, que aplica
 * las validaciones de acceso y genera los slugs automáticamente.
 * Expone el estado de carga y guardado por separado para que la UI pueda
 * deshabilitar acciones mientras se procesa una operación.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';
import { auditLog } from '@/lib/audit';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';

// ─── Constantes ───────────────────────────────────────────────────────────────

const EDGE_URL = edgeFunctionUrl('admin-catalog');

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Ítem del catálogo tal como lo devuelve el edge function admin-catalog. */
export interface CatalogItem {
  /** ID único del ítem */
  id: string;
  /** Título del ítem */
  title: string;
  /** Slug generado automáticamente por el backend */
  slug: string;
  /** Categoría del ítem (videojuegos, peliculas, etc.) */
  category: string;
  /** Fuente del ítem (igdb, tmdb, openlibrary, etc.) */
  source: string;
  /** ID del ítem en la fuente original */
  source_item_id: string;
  /** Descripción opcional del ítem */
  description?: string | null;
  /** URL de la imagen de portada, o null si no tiene */
  image_url: string | null;
  /** Fecha de lanzamiento (ISO parcial, solo año-mes-día), o null */
  release_date: string | null;
  /** Metadatos específicos de la categoría */
  metadata: Record<string, unknown>;
  /** Fecha de creación del registro (ISO) */
  created_at: string;
}

/** Datos del formulario de creación o edición de un ítem del catálogo. */
export interface CatalogItemFormData {
  /** Título del ítem */
  title: string;
  /** Categoría del ítem */
  category: string;
  /** Descripción opcional */
  description: string;
  /** URL de la imagen de portada */
  image_url: string;
  /** Fecha de lanzamiento en formato YYYY-MM-DD */
  release_date: string;
  /** JSON serializado de los metadatos adicionales */
  metadata_raw: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Valores iniciales vacíos para el formulario de creación de un ítem. */
export const EMPTY_CATALOG_FORM: CatalogItemFormData = {
  title: '',
  category: 'videojuegos',
  description: '',
  image_url: '',
  release_date: '',
  metadata_raw: '',
};

// ─── Funciones auxiliares ────────────────────────────────────────────────────

/**
 * Construye las cabeceras HTTP con el token de sesión del usuario autenticado.
 * Si no hay sesión activa, omite la cabecera Authorization.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Gestiona el CRUD del catálogo desde el panel de administración.
 *
 * Responsabilidades:
 * - Cargar ítems con paginación, búsqueda y filtro por categoría.
 * - Crear, actualizar y eliminar ítems vía el edge function admin-catalog.
 * - Registrar cada operación en admin_audit_logs via auditLog.
 * - Diferenciar el estado de carga inicial del estado de guardado.
 */
export function useAdminCatalog() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);

  // ─── Carga de datos ──────────────────────────────────────────────────────────

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('search', search);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);

      const res = await fetch(`${EDGE_URL}?${params}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setItems(json.data ?? []);
      setTotal(json.count ?? 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, page]);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Crea un nuevo ítem en el catálogo.
   *
   * @param form Datos del formulario de creación.
   * @returns true si la operación fue exitosa, false si hubo un error.
   */
  const createItem = async (form: CatalogItemFormData): Promise<boolean> => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      let metadata: Record<string, unknown> = {};
      if (form.metadata_raw.trim()) {
        metadata = JSON.parse(form.metadata_raw);
      }
      const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          description: form.description || null,
          image_url: form.image_url || null,
          release_date: form.release_date || null,
          metadata,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const created = await res.json().catch(() => ({}));
      await auditLog('create', 'catalog_items', created?.data?.id ?? 'unknown', {
        title: form.title,
        category: form.category,
      });
      await fetchItems();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Actualiza un ítem existente del catálogo vía el edge function admin-catalog.
   * Usa PATCH con el ID en query params, igual que DELETE.
   *
   * @param id ID del ítem a actualizar.
   * @param form Datos actualizados del formulario.
   * @returns true si la operación fue exitosa, false si hubo un error.
   */
  const updateItem = async (id: string, form: CatalogItemFormData): Promise<boolean> => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      let metadata: Record<string, unknown> = {};
      if (form.metadata_raw.trim()) {
        metadata = JSON.parse(form.metadata_raw);
      }

      const res = await fetch(`${EDGE_URL}?id=${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          title:        form.title,
          category:     form.category,
          description:  form.description || null,
          image_url:    form.image_url    || null,
          release_date: form.release_date || null,
          metadata,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      await auditLog('update', 'catalog_items', id, {
        title:    form.title,
        category: form.category,
      });
      await fetchItems();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Elimina un ítem del catálogo y actualiza la lista localmente.
   *
   * @param id ID del ítem a eliminar.
   * @returns true si la operación fue exitosa, false si hubo un error.
   */
  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const target = items.find(i => i.id === id);
      const res = await fetch(`${EDGE_URL}?id=${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await auditLog('delete', 'catalog_items', id, {
        title: target?.title ?? null,
        category: target?.category ?? null,
      });
      setItems(prev => prev.filter(i => i.id !== id));
      setTotal(prev => prev - 1);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  return {
    items, total, loading, saving, error,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    page, setPage,
    fetchItems,
    createItem, updateItem, deleteItem,
  };
}
