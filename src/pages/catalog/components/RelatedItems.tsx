import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategoryColors';
import { supabase } from '@/lib/supabase';

interface Props {
  category: string;
  currentId: string;       // slug
  itemId?: string | null;  // UUID for entity-based matching
}

interface RelatedItem {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  release_date: string | null;
  metadata: Record<string, unknown>;
}

function getRating(item: RelatedItem): string | null {
  const r = item.metadata?.rating;
  return r != null ? Number(r).toFixed(1) : null;
}

function extractGenres(meta: Record<string, unknown>): string[] {
  if (Array.isArray(meta.genres)) return (meta.genres as unknown[]).map(String).filter(Boolean);
  if (typeof meta.genre === 'string' && meta.genre) return [meta.genre];
  return [];
}

const MIN_RESULTS = 4;
const MAX_RESULTS = 10;

export default function RelatedItems({ category, currentId, itemId }: Props) {
  const CATEGORIES = useCategories();
  const [items, setItems] = useState<RelatedItem[]>([]);
  const cat = CATEGORIES.find(c => c.id === category);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const seen = new Set<string>([currentId]);
      const result: RelatedItem[] = [];

      // ── Step 1: Get current item genres ──────────────────────────────
      const { data: cur } = await supabase
        .from('catalog_items')
        .select('metadata')
        .eq('slug', currentId)
        .maybeSingle();

      const genres = extractGenres((cur?.metadata ?? {}) as Record<string, unknown>);

      // ── Step 2: Genre-based match ─────────────────────────────────────
      if (genres.length > 0) {
        const { data: pool } = await supabase
          .from('catalog_items')
          .select('id, slug, title, image_url, release_date, metadata')
          .eq('category', category)
          .neq('slug', currentId)
          .order('updated_at', { ascending: false })
          .limit(20);

        for (const item of pool ?? []) {
          if (result.length >= MAX_RESULTS) break;
          if (seen.has(item.slug)) continue;
          const iGenres = extractGenres((item.metadata ?? {}) as Record<string, unknown>);
          if (iGenres.some(g => genres.includes(g))) {
            seen.add(item.slug);
            result.push(item as RelatedItem);
          }
        }
      }

      // ── Step 3: Entity-based match (cast / director / author) ─────────
      if (itemId && result.length < MIN_RESULTS) {
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
                .filter(Boolean)
            ),
          ];

          if (relatedIds.length > 0) {
            const { data: entityItems } = await supabase
              .from('catalog_items')
              .select('id, slug, title, image_url, release_date, metadata')
              .in('id', relatedIds)
              .eq('category', category)
              .limit(MAX_RESULTS - result.length + 5);

            for (const item of entityItems ?? []) {
              if (result.length >= MAX_RESULTS) break;
              if (seen.has(item.slug)) continue;
              seen.add(item.slug);
              result.push(item as RelatedItem);
            }
          }
        }
      }

      // ── Step 4: Fallback — fill with recent same-category items ───────
      if (result.length < MIN_RESULTS) {
        const excludeSlugs = [...seen];
        const { data: fallback } = await supabase
          .from('catalog_items')
          .select('id, slug, title, image_url, release_date, metadata')
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
            <i className={`${cat?.icon} text-xs`} style={{ color: cat?.accent }}></i>
          </div>
          <h2 className="text-lg font-bold text-white">Más en {cat?.label}</h2>
        </div>
        <Link
          to={`/catalog/${category}`}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer whitespace-nowrap"
        >
          Ver todo →
        </Link>
      </div>

      {/* Horizontal scroll carousel */}
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map(item => {
          const rating = getRating(item);
          const year = item.release_date?.slice(0, 4) ?? '';

          return (
            <Link
              key={item.id}
              to={`/catalog/${category}/${item.slug}`}
              className="flex-shrink-0 w-32 group cursor-pointer"
            >
              <div className="w-32 h-48 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/30 mb-2.5">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className={`${cat?.icon ?? 'ri-image-line'} text-2xl text-zinc-600`}></i>
                  </div>
                )}
              </div>
              <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors leading-tight line-clamp-2 mb-1">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                {year && <span>{year}</span>}
                {rating && (
                  <>
                    {year && <span>·</span>}
                    <i className="ri-star-fill text-amber-400 text-xs"></i>
                    <span className="text-zinc-400">{rating}</span>
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
