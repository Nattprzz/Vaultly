import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategoryColors';
import { supabase } from '@/lib/supabase';

interface CatalogItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  year: string;
  cover: string | null;
}

// Cell renders itself correctly with OR without a cover image.
// Without image: category-colored dark card with metadata as primary design.
// With image: standard poster — same slot, image takes over.
function CatalogCell({
  item,
  catAccent,
  catLabel,
  size = 'compact',
}: {
  item: CatalogItem;
  catAccent: string;
  catLabel: string;
  size?: 'featured' | 'compact';
}) {
  return (
    <Link
      to={`/catalog/${item.category}/${item.slug}`}
      className="group relative block cursor-pointer overflow-hidden rounded-xl bg-zinc-900"
      style={{ aspectRatio: size === 'featured' ? '3/4' : '2/3' }}
    >
      {/* Cover image — when present */}
      {item.cover && (
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* No-image background: intentional color field, not a placeholder */}
      {!item.cover && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${catAccent}12 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Always-present: bottom gradient + metadata */}
      {/* With image: visible on hover. Without image: always visible. */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 transition-opacity duration-300 ${
          item.cover ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        <p className="mb-0.5 line-clamp-2 text-[11px] font-bold leading-tight text-white">
          {item.title}
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
            style={{ background: `${catAccent}20`, color: catAccent }}
          >
            {catLabel}
          </span>
          {item.year && (
            <span className="text-[10px] text-zinc-500">{item.year}</span>
          )}
        </div>
      </div>

      {/* No-image: category accent left border */}
      {!item.cover && (
        <div
          className="absolute left-0 top-0 h-full w-0.5 rounded-r-full"
          style={{ background: catAccent }}
        />
      )}
    </Link>
  );
}

export default function CollectionSection() {
  const CATEGORIES = useCategories();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const load = async () => {
      // No image filter — the section works without images
      const { data } = await supabase
        .from('catalog_items')
        .select('id, slug, category, title, image_url, release_date')
        .order('updated_at', { ascending: false })
        .limit(21);

      setItems(
        (data ?? []).map(item => ({
          id:       item.id,
          slug:     item.slug,
          category: item.category,
          title:    item.title,
          year:     item.release_date?.slice(0, 4) ?? '',
          cover:    item.image_url ?? null,
        }))
      );
      setLoaded(true);
    };
    void load();
  }, []);

  const getcat = (catId: string) => {
    const c = CATEGORIES.find(c => c.id === catId);
    return { accent: c?.accent ?? '#3b82f6', label: c?.label ?? catId };
  };

  // Split: first 3 are featured (larger), rest are compact
  const featured = items.slice(0, 3);
  const compact  = items.slice(3);

  // Skeleton data for loading state — no icons, just structure
  const skeletonFeatured = Array.from({ length: 3 });
  const skeletonCompact  = Array.from({ length: 9 });

  return (
    <section className="py-16 px-4 md:py-20 md:px-6 bg-zinc-950">
      <div className="mx-auto max-w-screen-xl" ref={ref}>

        {/* Header */}
        <div
          className="mb-8 flex items-end justify-between transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(14px)' }}
        >
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-400">
              Tu colección
            </p>
            <h2
              className="text-2xl font-black leading-tight tracking-tight text-white md:text-3xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Todo lo que forma parte
              {' '}<span className="text-zinc-500">de tu historia.</span>
            </h2>
          </div>
          <Link
            to="/catalog"
            className="hidden cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-zinc-500 transition-colors hover:text-white md:flex"
          >
            Ver catálogo <i className="ri-arrow-right-line" />
          </Link>
        </div>

        {/* Grid — featured row + compact rows */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(16px)',
            transitionDelay: '80ms',
          }}
        >
          {!loaded ? (
            /* Skeleton: same layout, no icons, just geometry */
            <>
              <div className="mb-2 grid grid-cols-3 gap-2">
                {skeletonFeatured.map((_, i) => (
                  <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-zinc-900" />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-9">
                {skeletonCompact.map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-900"
                    style={{ animationDelay: `${i * 40}ms` }}
                  />
                ))}
              </div>
            </>
          ) : items.length === 0 ? (
            /* Empty catalog: honest messaging, not a fake grid */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-zinc-600 text-sm mb-2">El catálogo está vacío por ahora.</p>
              <Link to="/catalog" className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors cursor-pointer">
                Explorar catálogo →
              </Link>
            </div>
          ) : (
            <>
              {/* Featured row: 3 items, larger cells */}
              {featured.length > 0 && (
                <div className="mb-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${featured.length}, 1fr)` }}>
                  {featured.map(item => {
                    const { accent, label } = getcat(item.category);
                    return (
                      <CatalogCell key={item.id} item={item} catAccent={accent} catLabel={label} size="featured" />
                    );
                  })}
                </div>
              )}

              {/* Compact rows */}
              {compact.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-9">
                  {compact.map(item => {
                    const { accent, label } = getcat(item.category);
                    return (
                      <CatalogCell key={item.id} item={item} catAccent={accent} catLabel={label} size="compact" />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  );
}
