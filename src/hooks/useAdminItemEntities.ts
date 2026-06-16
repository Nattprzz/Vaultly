/**
 * useAdminItemEntities.ts — gestión de entidades vinculadas a un ítem desde el panel de administración.
 *
 * Expone las operaciones de búsqueda, vinculación y desvinculación de entidades
 * (personas, estudios, compañías) para un ítem concreto del catálogo.
 * Todas las operaciones se registran en admin_audit_logs.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';
import { auditLog } from '@/lib/audit';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { ROLE_CONFIG } from '@/hooks/useItemEntities';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Entidad ya vinculada a un ítem, con su rol y un linkId compuesto como clave. */
export interface LinkedEntity {
  /** Clave compuesta: "item_id|entity_id|role" — identifica unívocamente el vínculo */
  linkId: string;
  /** ID de la entidad */
  entityId: string;
  /** Nombre visible de la entidad */
  name: string;
  /** Slug de la entidad para enlazar a su perfil */
  slug: string;
  /** Tipo de entidad (person, studio, etc.) */
  type: string;
  /** URL de la imagen de la entidad, o null si no tiene */
  image: string | null;
  /** Rol que tiene la entidad en este ítem */
  role: string;
}

/** Resultado de una búsqueda de entidades para vincular. */
export interface EntitySearchResult {
  /** ID único de la entidad */
  id: string;
  /** Nombre visible */
  name: string;
  /** Slug de la entidad */
  slug: string;
  /** Tipo de entidad */
  type: string;
  /** URL de la imagen, o null si no tiene */
  image: string | null;
  /** Biografía corta, o null si no tiene */
  bio: string | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/**
 * Lista de roles disponibles para vincular una entidad a un ítem,
 * derivada de ROLE_CONFIG para mantener la consistencia con la visualización.
 */
export const AVAILABLE_ROLES = Object.entries(ROLE_CONFIG).map(([value, conf]) => ({
  value,
  label: conf.label,
  icon: conf.icon,
  color: conf.color,
}));

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Gestiona los vínculos entre un ítem del catálogo y las entidades relacionadas.
 *
 * Responsabilidades:
 * - Cargar las entidades vinculadas al ítem dado.
 * - Buscar entidades por nombre para añadir nuevos vínculos.
 * - Crear y eliminar vínculos en item_entities con registro de auditoría.
 * - Prevenir vínculos duplicados (misma entidad + mismo rol).
 *
 * @param itemId ID del ítem al que se gestionan las entidades, o null si no hay selección.
 */
export function useAdminItemEntities(itemId: string | null) {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [linked, setLinked] = useState<LinkedEntity[]>([]);
  const [loadingLinked, setLoadingLinked] = useState(false);
  const [searchResults, setSearchResults] = useState<EntitySearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Carga de datos ──────────────────────────────────────────────────────────

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

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => { fetchLinked(); }, [fetchLinked]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Busca entidades por nombre con coincidencia parcial.
   *
   * @param query Término de búsqueda (mínimo 1 carácter).
   */
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

  /**
   * Vincula una entidad al ítem con el rol indicado.
   * Rechaza el vínculo si ya existe la combinación entidad+rol.
   *
   * @param entityId ID de la entidad a vincular.
   * @param role Rol que tendrá la entidad en este ítem.
   * @returns true si se vinculó correctamente, false si hubo error o duplicado.
   */
  const linkEntity = useCallback(async (entityId: string, role: string): Promise<boolean> => {
    if (!itemId) return false;

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

  /**
   * Elimina el vínculo entre la entidad y el ítem para el rol dado.
   *
   * @param entityId ID de la entidad a desvincular.
   * @param role Rol que tenía la entidad en este ítem.
   * @returns true si se desvinculó correctamente, false si hubo error.
   */
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
