import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategoryColors';
import { supabase } from '@/lib/supabase';

interface Props {
  category: string;
  currentId: string;
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

export default function RelatedItems({ category, currentId }: Props) {
  const CATEGORIES = useCategories();
  const [items, setItems] = useState<RelatedItem[]>([]);
  const cat = CATEGORIES.find(c => c.id === category);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from('catalog_items')
        .select('id, slug, title, image_url, release_date, metadata')
        .eq('category', category)
        .neq('slug', currentId)
        .order('updated_at', { ascending: false })
        .limit(10);
      if (!cancelled) setItems((data ?? []) as RelatedItem[]);
    };
    void load();
    return () => { cancelled = true; };
  }, [category, currentId]);

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
              {/* Poster */}
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

              {/* Info */}
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
