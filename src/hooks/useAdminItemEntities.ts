import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { auditLog } from '@/lib/audit';
import { ROLE_CONFIG } from '@/hooks/useItemEntities';

export interface LinkedEntity {
  linkId: string; // composite: item_id|entity_id|role — used as key
  entityId: string;
  name: string;
  slug: string;
  type: string;
  image: string | null;
  role: string;
}

export interface EntitySearchResult {
  id: string;
  name: string;
  slug: string;
  type: string;
  image: string | null;
  bio: string | null;
}

export const AVAILABLE_ROLES = Object.entries(ROLE_CONFIG).map(([value, conf]) => ({
  value,
  label: conf.label,
  icon: conf.icon,
  color: conf.color,
}));

export function useAdminItemEntities(itemId: string | null) {
  const [linked, setLinked] = useState<LinkedEntity[]>([]);
  const [loadingLinked, setLoadingLinked] = useState(false);
  const [searchResults, setSearchResults] = useState<EntitySearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch linked entities ──────────────────────────────────────────────────
  const fetchLinked = useCallback(async () => {
    if (!itemId) { setLinked([]); return; }
    setLoadingLinked(true);
    try {
      const { data, error: dbErr } = await supabase
        .from('item_entities')
        .select(`
          role,
          entity_id,
          entities (
            id, name, slug, type, image
          )
        `)
        .eq('item_id', itemId);

      if (dbErr) throw dbErr;

      const result: LinkedEntity[] = (data ?? [])
        .filter((r: any) => r.entities)
        .map((r: any) => ({
          linkId: `${itemId}|${r.entity_id}|${r.role}`,
          entityId: r.entity_id,
          name: r.entities.name,
          slug: r.entities.slug,
          type: r.entities.type,
          image: r.entities.image ?? null,
          role: r.role,
        }));

      result.sort((a, b) => {
        const pa = ROLE_CONFIG[a.role]?.priority ?? 99;
        const pb = ROLE_CONFIG[b.role]?.priority ?? 99;
        return pa - pb;
      });

      setLinked(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingLinked(false);
    }
  }, [itemId]);

  useEffect(() => { fetchLinked(); }, [fetchLinked]);

  // ── Search entities ────────────────────────────────────────────────────────
  const searchEntities = useCallback(async (query: string) => {
    if (!query.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const { data, error: dbErr } = await supabase
        .from('entities')
        .select('id, name, slug, type, image, bio')
        .ilike('name', `%${query.trim()}%`)
        .order('name')
        .limit(20);

      if (dbErr) throw dbErr;
      setSearchResults(data ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSearching(false);
    }
  }, []);

  // ── Link entity ────────────────────────────────────────────────────────────
  const linkEntity = useCallback(async (entityId: string, role: string): Promise<boolean> => {
    if (!itemId) return false;

    // Prevent duplicate
    const exists = linked.some(l => l.entityId === entityId && l.role === role);
    if (exists) {
      setError('Esta entidad ya está vinculada con ese rol');
      return false;
    }

    setLinking(true);
    setError(null);
    try {
      const { error: dbErr } = await supabase
        .from('item_entities')
        .insert({ item_id: itemId, entity_id: entityId, role });

      if (dbErr) throw dbErr;
      await auditLog('link_entity', 'item_entities', `${itemId}|${entityId}`, { item_id: itemId, entity_id: entityId, role });
      await fetchLinked();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setLinking(false);
    }
  }, [itemId, linked, fetchLinked]);

  // ── Unlink entity ──────────────────────────────────────────────────────────
  const unlinkEntity = useCallback(async (entityId: string, role: string): Promise<boolean> => {
    if (!itemId) return false;
    try {
      const { error: dbErr } = await supabase
        .from('item_entities')
        .delete()
        .eq('item_id', itemId)
        .eq('entity_id', entityId)
        .eq('role', role);

      if (dbErr) throw dbErr;
      await auditLog('unlink_entity', 'item_entities', `${itemId}|${entityId}`, { item_id: itemId, entity_id: entityId, role });
      setLinked(prev => prev.filter(l => !(l.entityId === entityId && l.role === role)));
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  }, [itemId]);

  return {
    linked, loadingLinked,
    searchResults, searching,
    linking, error, setError,
    searchEntities,
    linkEntity,
    unlinkEntity,
    fetchLinked,
  };
}
