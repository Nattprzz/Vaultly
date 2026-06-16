/**
 * RelatedItems.tsx — carrusel horizontal de ítems relacionados.
 *
 * Calcula recomendaciones con scoring multi-criterio por categoría:
 * franquicia/colección > título similar > reparto/director/autor en común
 * > géneros compartidos. Fallback progresivo si no hay suficientes resultados.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useCategories } from '@/hooks/useCategoryColors';

// ─── Supabase ────────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Constantes ──────────────────────────────────────────────────────────────

const MIN_RESULTS = 4;
const MAX_RESULTS = 10;

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Props {
  category: string;
  currentId: string;
  itemId?: string | null;
}

interface RelatedItem {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  release_date: string | null;
  metadata: Record<string, unknown>;
  source_item_id?: string | null;
  score?: number;
  reasons?: string[];
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

function getRating(item: RelatedItem): string | null {
  const r = item.metadata?.rating;
  return r != null ? Number(r).toFixed(1) : null;
}

/** Extrae géneros del metadata normalizados en minúsculas. */
function extractGenres(meta: Record<string, unknown>): string[] {
  if (Array.isArray(meta.genres)) return (meta.genres as unknown[]).map(String).filter(Boolean);
  if (typeof meta.genre === 'string' && meta.genre) return [meta.genre];
  return [];
}

/** Extrae el primer valor no vacío de una lista de claves del metadata. */
function extractStringArray(meta: Record<string, unknown>, keys: string[]): string[] {
  for (const key of keys) {
    const value = meta[key];
    if (Array.isArray(value)) return value.map(String).map(v => v.toLowerCase()).filter(Boolean);
    if (typeof value === 'string' && value) return [value.toLowerCase()];
  }
  return [];
}

/**
 * Extrae los nombres del reparto desde los distintos formatos posibles:
 * - cast: string[]
 * - cast_detailed: { name, character }[]
 * - credits.cast: { name }[]
 */
function extractCastNames(meta: Record<string, unknown>): string[] {
  // cast_detailed o credits.cast (objetos con .name)
  const detailed = (meta.cast_detailed ?? (meta.credits as Record<string, unknown> | undefined)?.cast) as unknown[] | undefined;
  if (Array.isArray(detailed) && detailed.length > 0 && typeof detailed[0] === 'object') {
    return (detailed as Record<string, unknown>[])
      .slice(0, 8)
      .map(m => String(m.name ?? '').toLowerCase())
      .filter(Boolean);
  }
  // cast: string[]
  const raw = meta.cast;
  if (Array.isArray(raw)) return (raw as unknown[]).slice(0, 8).map(String).map(s => s.toLowerCase()).filter(Boolean);
  return [];
}

/**
 * Extrae el nombre de la franquicia/colección/saga desde el metadata.
 * Maneja belongs_to_collection (TMDB), franchise_name, collection_name, saga, etc.
 */
function extractFranchise(meta: Record<string, unknown>): string {
  // TMDB movies: belongs_to_collection = { id, name, ... }
  const col = meta.belongs_to_collection as Record<string, unknown> | null | undefined;
  if (col && typeof col.name === 'string' && col.name) return col.name.toLowerCase();
  // Campo plano
  for (const key of ['franchise_name', 'collection_name', 'franchise', 'saga', 'series_name', 'universe']) {
    const v = meta[key];
    if (typeof v === 'string' && v) return v.toLowerCase();
    if (v && typeof v === 'object') {
      const n = (v as Record<string, unknown>).name;
      if (typeof n === 'string' && n) return n.toLowerCase();
    }
  }
  return '';
}

/**
 * Extrae director(es) del metadata.
 * Maneja campo director (string), crew (objetos con job=Director) y creators.
 */
function extractDirectors(meta: Record<string, unknown>): string[] {
  const result: string[] = [];
  if (typeof meta.director === 'string' && meta.director) result.push(meta.director.toLowerCase());
  if (typeof meta.screenplay === 'string' && meta.screenplay) result.push(meta.screenplay.toLowerCase());
  const rawCrew = (meta.crew ?? (meta.credits as Record<string, unknown> | undefined)?.crew) as unknown[] | undefined;
  if (Array.isArray(rawCrew)) {
    rawCrew.forEach(m => {
      const member = m as Record<string, unknown>;
      if (typeof member.job === 'string' && member.job === 'Director' && typeof member.name === 'string') {
        result.push(member.name.toLowerCase());
      }
    });
  }
  return [...new Set(result)];
}

/**
 * Normaliza un título para comparación de sagas: minúsculas, sin diacríticos,
 * sin palabras vacías, tokenizado.
 */
function titleTokens(value: string): string[] {
  const stop = new Set(['the', 'and', 'edition', 'remastered', 'remake', 'el', 'la', 'los', 'las', 'de', 'del', 'en', 'un', 'una']);
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[''""]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(token => token.length >= 3 && !stop.has(token));
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

/**
 * Puntúa un candidato relacionado con criterios multi-categoría.
 *
 * Prioridad:
 *   +100  misma franquicia/colección/saga
 *   +80   mismo título base (≥2 tokens iguales del título)
 *   +50   título parcialmente coincidente (1 token)
 *   +40   mismo director / creador / autor
 *   +35   misma desarrolladora / publisher (juegos) / editorial (libros)
 *   +25   actor principal en común (por coincidencia)
 *   +10   género compartido (por género)
 *   +8    tema/tag compartido
 *   +5    era de lanzamiento similar (±5 años)
 *   +2    misma categoría como fallback implícito
 */
function scoreRelated(
  current: RelatedItem,
  candidate: RelatedItem,
  category: string,
): { score: number; reasons: string[] } {
  const cm   = (current.metadata   ?? {}) as Record<string, unknown>;
  const can  = (candidate.metadata ?? {}) as Record<string, unknown>;
  const reasons: string[] = [...(candidate.reasons ?? [])];
  let score = Number(candidate.score ?? 0);

  // 1 — Franquicia / Colección / Saga
  const curFranchise = extractFranchise(cm);
  const canFranchise = extractFranchise(can);
  if (curFranchise && canFranchise && curFranchise === canFranchise) {
    score += 100;
    reasons.push('sameFranchise');
  }

  // 2 — Similaridad de título
  const curTokens = titleTokens(current.title);
  const canTokens = new Set(titleTokens(candidate.title));
  const sharedTitle = curTokens.filter(t => canTokens.has(t)).length;
  if (sharedTitle >= 2) {
    score += 80;
    reasons.push('sameBaseTitle');
  } else if (sharedTitle === 1) {
    score += 50;
    reasons.push('similarTitle');
  }

  // 3 — Categoría: películas y series — reparto y director
  if (category === 'peliculas' || category === 'series') {
    const curCast = new Set(extractCastNames(cm));
    const sharedCast = extractCastNames(can).filter(n => curCast.has(n)).length;
    if (sharedCast > 0) {
      // +25 por los primeros 4 actores, luego decae para no inflar por secundarios
      score += Math.min(sharedCast, 4) * 25;
      reasons.push('sharedCast');
    }
    const curDirs = new Set(extractDirectors(cm));
    if (extractDirectors(can).some(d => curDirs.has(d))) {
      score += 40;
      reasons.push('sameDirector');
    }
  }

  // 4 — Series: creadores
  if (category === 'series') {
    const curCreators = new Set(extractStringArray(cm, ['creators']));
    if (extractStringArray(can, ['creators']).some(c => curCreators.has(c))) {
      score += 40;
      reasons.push('sameCreator');
    }
  }

  // 5 — Videojuegos: desarrolladora y publisher
  if (category === 'videojuegos') {
    const curDevs = new Set(extractStringArray(cm, ['developers', 'developer']));
    if (extractStringArray(can, ['developers', 'developer']).some(d => curDevs.has(d))) {
      score += 35;
      reasons.push('sameDeveloper');
    }
    const curPubs = new Set(extractStringArray(cm, ['publishers', 'publisher']));
    if (extractStringArray(can, ['publishers', 'publisher']).some(p => curPubs.has(p))) {
      score += 35;
      reasons.push('samePublisher');
    }
    // Temas
    const curThemes = new Set(extractStringArray(cm, ['themes']));
    const sharedThemes = extractStringArray(can, ['themes']).filter(t => curThemes.has(t)).length;
    if (sharedThemes > 0) { score += sharedThemes * 8; reasons.push('sharedThemes'); }
    // Plataformas
    const curPlatforms = new Set(extractStringArray(cm, ['platforms']));
    const sharedPlatforms = extractStringArray(can, ['platforms']).filter(p => curPlatforms.has(p)).length;
    if (sharedPlatforms > 0) { score += Math.min(sharedPlatforms, 5) * 3; reasons.push('sharedPlatforms'); }
  }

  // 6 — Libros: autor y editorial
  if (category === 'libros') {
    const curAuthors = new Set(extractStringArray(cm, ['authors', 'author']));
    if (extractStringArray(can, ['authors', 'author']).some(a => curAuthors.has(a))) {
      score += 40;
      reasons.push('sameAuthor');
    }
    const curPub = new Set(extractStringArray(cm, ['publisher']));
    if (extractStringArray(can, ['publisher']).some(p => curPub.has(p))) {
      score += 20;
      reasons.push('samePublisher');
    }
  }

  // 7 — Conciertos: artista y gira
  if (category === 'conciertos') {
    const curArtists = new Set(extractStringArray(cm, ['artists', 'artist']));
    if (extractStringArray(can, ['artists', 'artist']).some(a => curArtists.has(a))) {
      score += 80;
      reasons.push('sameArtist');
    }
    const curTour = String(cm.tour_name ?? cm.gira ?? '').toLowerCase();
    const canTour = String(can.tour_name ?? can.gira ?? '').toLowerCase();
    if (curTour && canTour && curTour === canTour) {
      score += 50;
      reasons.push('sameTour');
    }
  }

  // 8 — Géneros compartidos (fallback universal)
  const curGenres = new Set(extractGenres(cm).map(g => g.toLowerCase()));
  const sharedGenres = extractGenres(can).filter(g => curGenres.has(g.toLowerCase())).length;
  if (sharedGenres > 0) {
    score += sharedGenres * 10;
    reasons.push('sharedGenres');
  }

  // 9 — Era de lanzamiento similar (±5 años)
  const curYear = Number(current.release_date?.slice(0, 4));
  const canYear = Number(candidate.release_date?.slice(0, 4));
  if (curYear && canYear && Math.abs(curYear - canYear) <= 5) {
    score += 5;
    reasons.push('sameReleaseEra');
  }

  // Bonus: tiene imagen
  if (candidate.image_url) score += 2;

  return { score, reasons: [...new Set(reasons)] };
}

/**
 * Extrae related_games del metadata para candidatos IGDB precalculados
 * (que pueden no existir aún en catalog_items).
 */
function metadataRelatedGames(meta: Record<string, unknown>): RelatedItem[] {
  const related = meta.related_games;
  if (!Array.isArray(related)) return [];
  return related
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map(item => ({
      id:             String(item.source_item_id ?? item.slug ?? item.title),
      slug:           String(item.slug ?? ''),
      title:          String(item.title ?? ''),
      image_url:      typeof item.image_url === 'string' ? item.image_url : null,
      release_date:   typeof item.release_date === 'string' ? item.release_date : null,
      source_item_id: String(item.source_item_id ?? ''),
      metadata:       {},
      score:          Number(item.score ?? 0),
      reasons:        Array.isArray(item.reasons) ? item.reasons.map(String) : [],
    }))
    .filter(item => item.slug && item.title);
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function RelatedItems({ category, currentId, itemId }: Props) {
  const CATEGORIES = useCategories();
  const [items, setItems] = useState<RelatedItem[]>([]);
  const cat = CATEGORIES.find(c => c.id === category);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const seen   = new Set<string>([currentId]);
      const result: RelatedItem[] = [];

      // Carga el ítem actual para extraer su metadata de scoring
      const { data: cur } = await supabase
        .from('catalog_items')
        .select('id, slug, title, image_url, release_date, metadata, source_item_id')
        .eq('slug', currentId)
        .maybeSingle();

      const current = cur as RelatedItem | null;
      if (!current) {
        if (!cancelled) setItems([]);
        return;
      }

      const scored = new Map<string, RelatedItem>();

      const addCandidate = (candidate: RelatedItem) => {
        if (!candidate.slug || candidate.slug === currentId || seen.has(candidate.slug)) return;
        const relation = scoreRelated(current, candidate, category);
        // Umbral mínimo para aparecer en la sección
        if (relation.score < 20) return;
        const enriched = { ...candidate, score: relation.score, reasons: relation.reasons };
        const existing = scored.get(candidate.slug);
        if (!existing || Number(existing.score ?? 0) < relation.score) {
          scored.set(candidate.slug, enriched);
        }
      };

      // Para videojuegos: candidatos IGDB embebidos en metadata.related_games
      if (category === 'videojuegos') {
        metadataRelatedGames((current.metadata ?? {}) as Record<string, unknown>).forEach(addCandidate);
      }

      // Pool principal: últimos 80 ítems de la misma categoría
      const { data: pool } = await supabase
        .from('catalog_items')
        .select('id, slug, title, image_url, release_date, metadata, source_item_id')
        .eq('category', category)
        .neq('slug', currentId)
        .order('updated_at', { ascending: false })
        .limit(80);

      (pool ?? []).forEach(item => addCandidate(item as RelatedItem));

      // Ítems con entidades (actores/estudios) en común — boost extra
      if (itemId) {
        const { data: entityLinks } = await supabase
          .from('item_entities')
          .select('entity_id')
          .eq('item_id', itemId);

        const entityIds = (entityLinks ?? [])
          .map((e: Record<string, unknown>) => e.entity_id as string)
          .filter(Boolean);

        if (entityIds.length > 0) {
          const { data: sharedLinks } = await supabase
            .from('item_entities')
            .select('item_id')
            .in('entity_id', entityIds)
            .neq('item_id', itemId);

          const relatedIds = [
            ...new Set(
              (sharedLinks ?? [])
                .map((e: Record<string, unknown>) => e.item_id as string)
                .filter(Boolean),
            ),
          ];

          if (relatedIds.length > 0) {
            const { data: entityItems } = await supabase
              .from('catalog_items')
              .select('id, slug, title, image_url, release_date, metadata, source_item_id')
              .in('id', relatedIds)
              .eq('category', category)
              .limit(30);

            // Los ítems con entidades compartidas ya subirán de puntuación
            // vía cast scoring; el boost aquí asegura que no se descarten
            (entityItems ?? []).forEach(item =>
              addCandidate({
                ...(item as RelatedItem),
                score: Number((item as RelatedItem).score ?? 0) + 10,
                reasons: ['sharedEntity'],
              }),
            );
          }
        }
      }

      // Ordenar por puntuación descendente
      result.push(
        ...[...scored.values()]
          .sort((a, b) => Number(b.score ?? 0) - Number(a.score ?? 0))
          .slice(0, MAX_RESULTS),
      );

      // Fallback: completar hasta MIN_RESULTS con los más recientes de la categoría
      if (result.length < MIN_RESULTS) {
        const excludeSlugs = [...new Set([currentId, ...result.map(item => item.slug)])];
        const { data: fallback } = await supabase
          .from('catalog_items')
          .select('id, slug, title, image_url, release_date, metadata, source_item_id')
          .eq('category', category)
          .not('slug', 'in', `(${excludeSlugs.join(',')})`)
          .order('updated_at', { ascending: false })
          .limit(MAX_RESULTS - result.length);

        for (const item of fallback ?? []) {
          if (result.length >= MAX_RESULTS) break;
          if (seen.has(item.slug)) continue;
          seen.add(item.slug);
          result.push(item as RelatedItem);
        }
      }

      if (!cancelled) setItems(result.slice(0, MAX_RESULTS));
    };

    void load();
    return () => { cancelled = true; };
  }, [category, currentId, itemId]);

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ background: `${cat?.accent}20` }}
          >
            <i className={`${cat?.icon} text-xs`} style={{ color: cat?.accent }} />
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Más en {cat?.label}</h2>
        </div>
        <Link
          to={`/catalog/${category}`}
          className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer whitespace-nowrap"
        >
          Ver todo
        </Link>
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map(item => {
          const rating = getRating(item);
          const year   = item.release_date?.slice(0, 4) ?? '';

          return (
            <Link
              key={item.id}
              to={`/catalog/${category}/${item.slug}`}
              className="flex-shrink-0 w-32 group cursor-pointer"
            >
              <div className="w-32 h-48 rounded-xl overflow-hidden bg-[var(--surface-raised)] border border-[var(--border)] mb-2.5">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className={`${cat?.icon ?? 'ri-image-line'} text-2xl text-[var(--text-tertiary)]`} />
                  </div>
                )}
              </div>
              <h3 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-accent)] transition-colors leading-tight line-clamp-2 mb-1">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                {year && <span>{year}</span>}
                {rating && (
                  <>
                    {year && <span>·</span>}
                    <i className="ri-star-fill text-amber-400 text-xs" />
                    <span className="text-[var(--text-secondary)]">{rating}</span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
