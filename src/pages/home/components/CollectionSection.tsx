import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategoryColors';
import { supabase } from '@/lib/supabase';

const CATEGORY_IDS = ['videojuegos', 'peliculas', 'series', 'libros', 'conciertos'] as const;
type CategoryId = typeof CATEGORY_IDS[number];

interface CatalogItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  year: string;
  cover: string | null;
}

function CatalogCell({
  item,
  catAccent,
  catLabel,
}: {
  item: CatalogItem;
  catAccent: string;
  catLabel: string;
}) {
  return (
    <Link
      to={`/catalog/${item.category}/${item.slug}`}
      className="group relative block cursor-pointer overflow-hidden rounded-xl bg-zinc-900"
      style={{ aspectRatio: '2/3' }}
    >
      {item.cover && (
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {!item.cover && (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${catAccent}12 0%, transparent 60%)` }}
        />
      )}

      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 transition-opacity duration-300 ${
          item.cover ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        <p className="line-clamp-2 text-[10px] font-bold leading-tight text-white">
          {item.title}
        </p>
        {item.year && (
          <span className="mt-0.5 block text-[9px] text-zinc-500">{item.year}</span>
        )}
      </div>

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
  const [byCat, setByCat] = useState<Record<string, CatalogItem[]>>({});
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
      const results = await Promise.all(
        CATEGORY_IDS.map(cat =>
          supabase
            .from('catalog_items')
            .select('id, slug, category, title, image_url, release_date')
            .eq('category', cat)
            .order('updated_at', { ascending: false })
            .limit(5)
        )
      );

      const map: Record<string, CatalogItem[]> = {};
      CATEGORY_IDS.forEach((cat, i) => {
        map[cat] = (results[i].data ?? []).map(item => ({
          id:       item.id,
          slug:     item.slug,
          category: item.category,
          title:    item.title,
          year:     item.release_date?.slice(0, 4) ?? '',
          cover:    item.image_url ?? null,
        }));
      });

      setByCat(map);
      setLoaded(true);
    };
    void load();
  }, []);

  const allEmpty = loaded && CATEGORY_IDS.every(cat => (byCat[cat] ?? []).length === 0);

  return (
    <section className="py-16 px-4 md:py-20 md:px-6 bg-zinc-950">
      <div className="mx-auto max-w-screen-xl" ref={ref}>

        {/* Header */}
        <div
          className="mb-10 flex items-end justify-between transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(14px)' }}
        >
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-400">
              Catálogo
            </p>
            <h2
              className="text-2xl font-black leading-tight tracking-tight text-white md:text-3xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Explora por{' '}
              <span className="text-zinc-500">categoría.</span>
            </h2>
          </div>
          <Link
            to="/catalog"
            className="hidden cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-zinc-500 transition-colors hover:text-white md:flex"
          >
            Ver todo <i className="ri-arrow-right-line" />
          </Link>
        </div>

        {/* Content */}
        <div
          className="transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transitionDelay: '80ms' }}
        >
          {!loaded && (
            <div className="flex flex-col gap-10">
              {[0, 1, 2].map(i => (
                <div key={i}>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-6 w-6 animate-pulse rounded-lg bg-zinc-800" />
                    <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {[0, 1, 2, 3, 4].map(j => (
                      <div
                        key={j}
                        className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-900"
                        style={{ animationDelay: `${j * 40}ms` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {allEmpty && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="mb-2 text-sm text-zinc-600">El catálogo está vacío por ahora.</p>
              <Link
                to="/catalog"
                className="cursor-pointer text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
              >
                Explorar catálogo →
              </Link>
            </div>
          )}

          {loaded && !allEmpty && (
            <div className="flex flex-col gap-10">
              {CATEGORY_IDS.map((catId: CategoryId, stripIndex) => {
                const catItems = byCat[catId] ?? [];
                if (catItems.length === 0) return null;
                const cat = CATEGORIES.find(c => c.id === catId);
                if (!cat) return null;

                return (
                  <div
                    key={catId}
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'none' : 'translateY(12px)',
                      transition: `opacity 0.5s ease ${120 + stripIndex * 70}ms, transform 0.5s ease ${120 + stripIndex * 70}ms`,
                    }}
                  >
                    {/* Category row header */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg"
                          style={{ background: `${cat.accent}20` }}
                        >
                          <i className={`${cat.icon} text-xs`} style={{ color: cat.accent }} />
                        </div>
                        <span className="text-sm font-bold text-white">{cat.label}</span>
                        <span className="text-xs text-zinc-600">
                          {catItems.length} destacados
                        </span>
                      </div>
                      <Link
                        to={`/catalog/${catId}`}
                        className="flex cursor-pointer items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-white"
                      >
                        Ver todos <i className="ri-arrow-right-line text-[10px]" />
                      </Link>
                    </div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {catItems.map(item => (
                        <CatalogCell
                          key={item.id}
                          item={item}
                          catAccent={cat.accent}
                          catLabel={cat.label}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
