/**
 * useEntity.ts — carga de datos de una entidad del catálogo.
 *
 * Una "entidad" es una persona o compañía vinculada a ítems del catálogo:
 * actores, directores, autores, artistas, desarrolladores, etc.
 * Consulta la Edge Function catalog-entity y mantiene un caché en memoria.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { edgeFunctionUrl } from '@/lib/edgeFunctions';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/**
 * Entidad del catálogo de Vaultly (actor, director, autor, artista, etc.).
 */
export interface EntityData {
  /** UUID interno de Vaultly */
  id: string;
  /** Nombre completo de la entidad */
  name: string;
  /** Tipo de entidad: actor, director, author, artist, developer, etc. */
  type: string;
  /** Slug normalizado para URLs */
  slug: string;
  /** URL de la foto o imagen de perfil */
  image_url: string | null;
  /** Biografía o descripción */
  bio: string | null;
  /** Datos adicionales no estructurados */
  metadata: Record<string, unknown>;
  /** Fecha de creación en la base de datos */
  created_at: string;
  /** Fecha de última actualización */
  updated_at: string;
}

/**
 * Ítem del catálogo vinculado a una entidad con el rol que desempeña.
 */
export interface EntityItem {
  /** UUID del ítem en catalog_items */
  id: string;
  /** Slug del ítem */
  slug: string;
  /** Título del ítem */
  title: string;
  /** URL de la portada */
  image_url: string | null;
  /** Fecha de lanzamiento en formato ISO */
  release_date: string | null;
  /** Categoría del ítem */
  category: string;
  /** Fuente de datos */
  source: string;
  /** ID en la fuente de datos original */
  source_item_id: string;
  /** Metadatos del ítem */
  metadata: Record<string, unknown>;
  /** Rol de la entidad en este ítem (actor, director, etc.) */
  role: string;
}

/**
 * Estadísticas de una entidad.
 */
export interface EntityStats {
  /** Número total de ítems vinculados */
  total_items: number;
}

/**
 * Valor de retorno del hook useEntity.
 */
export interface UseEntityResult {
  /** Datos de la entidad, o null mientras se carga */
  entity: EntityData | null;
  /** Ítems del catálogo vinculados a esta entidad */
  items: EntityItem[];
  /** Estadísticas de la entidad */
  stats: EntityStats | null;
  /** true mientras se realiza la petición */
  loading: boolean;
  /** Mensaje de error, o null si no hay error */
  error: string | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const EDGE_FN_URL = edgeFunctionUrl('catalog-entity');

/** Caché en memoria por sesión, con clave = slug de la entidad. */
const memCache = new Map<string, { entity: EntityData; items: EntityItem[]; stats: EntityStats }>();

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Carga los datos de una entidad del catálogo por su slug.
 *
 * Responsabilidades:
 * - Consultar el caché en memoria antes de hacer la petición.
 * - Llamar a la Edge Function catalog-entity si la entidad no está cacheada.
 * - Cancelar la petición si el componente se desmonta antes de que responda.
 *
 * @param slug Slug de la entidad a cargar.
 */
export function useEntity(slug: string): UseEntityResult {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [entity, setEntity] = useState<EntityData | null>(null);
  const [items, setItems] = useState<EntityItem[]>([]);
  const [stats, setStats] = useState<EntityStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!slug) return;

    if (memCache.has(slug)) {
      const c = memCache.get(slug)!;
      setEntity(c.entity);
      setItems(c.items);
      setStats(c.stats);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`${EDGE_FN_URL}?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const json = await res.json();
        if (!cancelled) {
          memCache.set(slug, { entity: json.entity, items: json.items ?? [], stats: json.stats ?? { total_items: 0 } });
          setEntity(json.entity);
          setItems(json.items ?? []);
          setStats(json.stats ?? { total_items: 0 });
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [slug]);

  return { entity, items, stats, loading, error };
}

// ─── Helpers y constantes de UI ──────────────────────────────────────────────

/**
 * Etiqueta legible para cada tipo de entidad.
 */
export const TYPE_LABELS: Record<string, string> = {
  developer: 'Desarrollador',
  publisher: 'Publisher',
  actor:     'Actor / Actriz',
  director:  'Director/a',
  author:    'Autor/a',
  artist:    'Artista',
  creator:   'Creador/a',
};

/**
 * Icono remixicon para cada tipo de entidad.
 */
export const TYPE_ICONS: Record<string, string> = {
  developer: 'ri-code-box-line',
  publisher: 'ri-building-line',
  actor:     'ri-user-star-line',
  director:  'ri-movie-line',
  author:    'ri-quill-pen-line',
  artist:    'ri-music-2-line',
  creator:   'ri-lightbulb-line',
};

/**
 * Genera el slug de una entidad a partir de su nombre y tipo.
 * La lógica debe coincidir con la que usa la Edge Function al crear entidades.
 *
 * @param name Nombre de la entidad.
 * @param type Tipo de la entidad.
 * @returns Slug normalizado en minúsculas sin caracteres especiales.
 */
export function buildEntitySlug(name: string, type: string): string {
  return `${name}-${type}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
