/**
 * useItemEntities.ts — entidades vinculadas a un ítem del catálogo.
 *
 * Carga desde la tabla item_entities las entidades asociadas a un ítem
 * (directores, actores, desarrolladores, autores, etc.) y las enriquece
 * con los datos de la tabla entities. Los resultados se cachean en memoria
 * por sesión para evitar consultas repetidas al navegar entre ítems.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Entidad vinculada a un ítem, con su rol en ese ítem. */
export interface ItemEntity {
  /** ID de la entidad */
  id: string;
  /** Nombre visible de la entidad */
  name: string;
  /** Slug para enlazar al perfil de la entidad */
  slug: string;
  /** Tipo de entidad (persona, estudio, compañía, etc.) */
  type: string;
  /** URL de la imagen de perfil, o null si no tiene */
  image: string | null;
  /** Biografía corta, o null si no tiene */
  bio: string | null;
  /** Rol de la entidad en este ítem (director, actor, developer, etc.) */
  role: string;
}

/** Resultado que expone el hook. */
export interface UseItemEntitiesResult {
  /** Lista de entidades vinculadas, ordenadas por prioridad de rol */
  entities: ItemEntity[];
  /** true mientras se carga desde Supabase */
  loading: boolean;
  /** Mensaje de error, o null si no hubo problemas */
  error: string | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/**
 * Configuración de visualización por tipo de rol.
 * Define la etiqueta, el icono Remix Icons, el color y la prioridad de orden.
 */
export const ROLE_CONFIG: Record<string, { label: string; icon: string; color: string; priority: number }> = {
  director:   { label: 'Director/a',    icon: 'ri-movie-line',       color: '#f43f5e', priority: 1 },
  developer:  { label: 'Desarrollador', icon: 'ri-code-box-line',    color: '#8b5cf6', priority: 1 },
  author:     { label: 'Autor/a',       icon: 'ri-book-open-line',   color: '#10b981', priority: 1 },
  artist:     { label: 'Artista',       icon: 'ri-music-line',       color: '#ec4899', priority: 1 },
  publisher:  { label: 'Publisher',     icon: 'ri-building-line',    color: '#6366f1', priority: 2 },
  actor:      { label: 'Reparto',       icon: 'ri-user-star-line',   color: '#f59e0b', priority: 3 },
  creator:    { label: 'Creador/a',     icon: 'ri-lightbulb-line',   color: '#0ea5e9', priority: 2 },
  studio:     { label: 'Estudio',       icon: 'ri-film-line',        color: '#14b8a6', priority: 2 },
};

// Cache de sesión: itemId → lista de entidades
const memCache = new Map<string, ItemEntity[]>();

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Carga y cachea las entidades vinculadas a un ítem del catálogo.
 *
 * Responsabilidades:
 * - Consultar item_entities con join a entities para un itemId dado.
 * - Ordenar los resultados por la prioridad definida en ROLE_CONFIG.
 * - Cachear en memoria para evitar peticiones redundantes en la misma sesión.
 *
 * @param itemId ID del ítem cuyos colaboradores se quieren cargar, o null para no cargar nada.
 */
export function useItemEntities(itemId: string | null): UseItemEntitiesResult {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [entities, setEntities] = useState<ItemEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!itemId) {
      setEntities([]);
      return;
    }

    if (memCache.has(itemId)) {
      setEntities(memCache.get(itemId)!);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('item_entities')
          .select(`
            role,
            entities (
              id,
              name,
              slug,
              type,
              image,
              bio
            )
          `)
          .eq('item_id', itemId);

        if (dbError) throw dbError;

        const result: ItemEntity[] = (data ?? [])
          .filter((row: any) => row.entities)
          .map((row: any) => ({
            id: row.entities.id,
            name: row.entities.name,
            slug: row.entities.slug,
            type: row.entities.type,
            image: row.entities.image ?? null,
            bio: row.entities.bio ?? null,
            role: row.role,
          }));

        result.sort((a, b) => {
          const pa = ROLE_CONFIG[a.role]?.priority ?? 99;
          const pb = ROLE_CONFIG[b.role]?.priority ?? 99;
          return pa - pb;
        });

        if (!cancelled) {
          memCache.set(itemId, result);
          setEntities(result);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [itemId]);

  return { entities, loading, error };
}
