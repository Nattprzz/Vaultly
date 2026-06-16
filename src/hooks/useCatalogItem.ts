/**
 * useCatalogItem.ts — carga del detalle de un ítem del catálogo.
 *
 * Obtiene los datos completos de un ítem por su slug consultando la Edge Function
 * catalog-item. Mantiene un caché en memoria por sesión para evitar peticiones
 * repetidas al navegar entre páginas.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { supabase } from '@/lib/supabase';
import { SUPABASE_ANON_KEY } from '@/lib/supabaseConfig';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { CatalogItemMetadata } from '@/types/metadata';

/**
 * Ítem de catálogo completo tal como lo devuelve la Edge Function catalog-item.
 */
export interface CatalogItemFull {
  /** UUID del ítem en catalog_items */
  id: string;
  /** Slug normalizado para URLs y el tracker */
  slug: string;
  /** Categoría en la que está clasificado: videojuegos, peliculas, etc. */
  category: string;
  /** Fuente de datos: igdb, tmdb, google_books, ticketmaster, manual */
  source: string;
  /** ID del ítem en la fuente de datos original */
  source_item_id: string;
  /** Título del ítem */
  title: string;
  /** Descripción o sinopsis */
  description: string | null;
  /** URL de la imagen de portada */
  image_url: string | null;
  /** Fecha de lanzamiento en formato ISO */
  release_date: string | null;
  /** Metadatos estructurados según la categoría */
  metadata: CatalogItemMetadata;
  /** Fecha de creación en catalog_items */
  created_at?: string;
  /** Fecha de última actualización en catalog_items */
  updated_at?: string;
}

/** Origen de los datos del ítem: caché local, API externa o mock. */
export type ItemSource = 'cache' | 'external' | 'external_cached' | 'mock';

/**
 * Valor de retorno del hook useCatalogItem.
 */
export interface UseCatalogItemResult {
  /** Ítem cargado, o null mientras se carga o si hubo error */
  item: CatalogItemFull | null;
  /** true mientras se realiza la petición */
  loading: boolean;
  /** Mensaje de error, o null si no hay error */
  error: string | null;
  /** Origen de los datos devueltos */
  source: ItemSource | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const EDGE_FN_URL = edgeFunctionUrl('catalog-item');

/** Caché en memoria por sesión, con clave = slug del ítem. */
const memCache = new Map<string, { item: CatalogItemFull; source: ItemSource }>();

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Carga el detalle completo de un ítem del catálogo por su slug.
 *
 * Responsabilidades:
 * - Consultar el caché en memoria antes de hacer la petición.
 * - Llamar a la Edge Function catalog-item si el ítem no está cacheado.
 * - Cancelar la petición si el componente se desmonta antes de que responda.
 *
 * @param slug Slug del ítem a cargar.
 * @param category Categoría opcional para afinar la búsqueda en la Edge Function.
 */
export function useCatalogItem(slug: string, category?: string): UseCatalogItemResult {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [item, setItem] = useState<CatalogItemFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<ItemSource | null>(null);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!slug) return;

    if (memCache.has(slug)) {
      const cached = memCache.get(slug)!;
      setItem(cached.item);
      setSource(cached.source);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const params = new URLSearchParams({ slug });
        if (category) params.set('category', category);
        const { data: sessionData } = await supabase.auth.getSession();
        const bearerToken = sessionData.session?.access_token ?? SUPABASE_ANON_KEY;
        const res = await fetch(`${EDGE_FN_URL}?${params}`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            apikey: SUPABASE_ANON_KEY,
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }

        const json: { data: CatalogItemFull; source: ItemSource } = await res.json();

        if (!cancelled) {
          memCache.set(slug, { item: json.data, source: json.source });
          setItem(json.data);
          setSource(json.source);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [slug, category]);

  return { item, loading, error, source };
}

// ─── Helpers para extraer campos tipados de metadata ─────────────────────────

/**
 * Extrae el año de lanzamiento de un ítem.
 *
 * @param item Ítem del catálogo.
 * @returns Año en formato string (ej. "2023"), o cadena vacía si no está disponible.
 */
export function getItemYear(item: CatalogItemFull): string {
  return item.release_date?.slice(0, 4) ?? '';
}

/**
 * Extrae la puntuación media de un ítem desde sus metadatos.
 *
 * @param item Ítem del catálogo.
 * @returns Puntuación numérica, o null si no está disponible.
 */
export function getItemRating(item: CatalogItemFull): number | null {
  const r = item.metadata?.rating;
  return r != null ? Number(r) : null;
}

/**
 * Extrae la lista de géneros de un ítem.
 *
 * @param item Ítem del catálogo.
 * @returns Array de géneros, o array vacío si no están disponibles.
 */
export function getItemGenres(item: CatalogItemFull): string[] {
  const g = item.metadata?.genres;
  if (Array.isArray(g)) return g as string[];
  const single = item.metadata?.genre;
  if (single) return [String(single)];
  return [];
}

/**
 * Obtiene la URL de la imagen de fondo del ítem.
 *
 * @param item Ítem del catálogo.
 * @returns URL de backdrop, o null si no está disponible.
 */
export function getItemBackdrop(item: CatalogItemFull): string | null {
  return (item.metadata?.backdrop_url as string) ?? item.image_url ?? null;
}

/**
 * Obtiene las capturas de pantalla o imágenes adicionales del ítem.
 *
 * @param item Ítem del catálogo.
 * @returns Array de URLs de imágenes adicionales.
 */
export function getItemScreenshots(item: CatalogItemFull): string[] {
  const shots = item.metadata?.screenshots ?? item.metadata?.backdrops;
  const artworks = item.metadata?.artworks;
  const urls = [
    ...(Array.isArray(shots) ? shots : []),
    ...(Array.isArray(artworks) ? artworks : []),
  ].map(String).filter(Boolean);
  return [...new Set(urls)];
}

/**
 * Obtiene trailers normalizados desde metadata manteniendo compatibilidad con campos antiguos.
 *
 * @param item Item del catalogo.
 * @returns Lista de trailers validos.
 */
export function getItemTrailers(item: CatalogItemFull): Array<{
  title?: string;
  url: string;
  thumbnail_url?: string;
  source?: 'youtube' | 'vimeo' | 'igdb' | 'other';
}> {
  const trailers = item.metadata?.trailers;
  if (Array.isArray(trailers)) {
    return trailers
      .filter((trailer): trailer is Record<string, unknown> => Boolean(trailer && typeof trailer === 'object'))
      .map((trailer) => ({
        ...(typeof trailer.title === 'string' ? { title: trailer.title } : {}),
        url: String(trailer.url ?? ''),
        ...(typeof trailer.thumbnail_url === 'string' ? { thumbnail_url: trailer.thumbnail_url } : {}),
        ...(typeof trailer.source === 'string' ? { source: trailer.source as 'youtube' | 'vimeo' | 'igdb' | 'other' } : {}),
      }))
      .filter((trailer) => trailer.url);
  }

  if (typeof item.metadata?.trailer_url === 'string' && item.metadata.trailer_url) {
    return [{ url: item.metadata.trailer_url, source: 'other' }];
  }

  return [];
}
