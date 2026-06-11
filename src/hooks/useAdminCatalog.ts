import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { auditLog } from '@/lib/audit';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';

const EDGE_URL = edgeFunctionUrl('admin-catalog');

export interface CatalogItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  source: string;
  source_item_id: string;
  image_url: string | null;
  release_date: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CatalogItemFormData {
  title: string;
  category: string;
  description: string;
  image_url: string;
  release_date: string;
  metadata_raw: string;
}

export const EMPTY_CATALOG_FORM: CatalogItemFormData = {
  title: '',
  category: 'videojuegos',
  description: '',
  image_url: '',
  release_date: '',
  metadata_raw: '',
};

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useAdminCatalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);

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

  useEffect(() => { fetchItems(); }, [fetchItems]);

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
      await auditLog('update', 'catalog_items', id, {
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

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      // Capture title before deleting for the audit payload
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
