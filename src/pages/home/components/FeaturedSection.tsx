import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategoryColors';
import { supabase } from '@/lib/supabase';

interface FeaturedItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  cover: string;
  rating: number | null;
  year: string;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  Catalogo: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400',
};

const FADE_OUT_MS = 180;
const STAGGER_MS = 70;

export default function FeaturedSection() {
  const CATEGORIES = useCategories();
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayFilter, setDisplayFilter] = useState('all');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleHeader, setVisibleHeader] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [items, setItems] = useState<FeaturedItem[]>([]);

  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const transitionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('catalog_items')
        .select('id, slug, category, title, image_url, release_date, metadata')
        .order('updated_at', { ascending: false })
        .limit(24);

      setItems((data ?? []).map(item => ({
        id: item.id,
        slug: item.slug,
        category: item.category,
        title: item.title,
        cover: item.image_url ?? '',
        rating: item.metadata?.rating != null ? Number(item.metadata.rating) : null,
        year: item.release_date?.slice(0, 4) ?? '',
        status: 'Catalogo',
      })));
    };

    void load();
  }, []);

  const filtered = displayFilter === 'all'
    ? items.slice(0, 6)
    : items.filter(i => i.category === displayFilter).slice(0, 6);

  const clearTimers = useCallback(() => {
    transitionTimers.current.forEach(clearTimeout);
    transitionTimers.current = [];
  }, []);

  const staggerCardsIn = useCallback((count: number) => {
    setVisibleCards(new Array(count).fill(false));
    const timers = Array.from({ length: count }, (_, i) =>
      setTimeout(() => {
        setVisibleCards(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * STAGGER_MS)
    );
    transitionTimers.current = timers;
  }, []);

  const handleFilterChange = useCallback((newFilter: string) => {
    if (newFilter === activeFilter) return;

    clearTimers();
    setIsTransitioning(true);
    setActiveFilter(newFilter);

    const swapTimer = setTimeout(() => {
      setDisplayFilter(newFilter);
      setIsTransitioning(false);
      const newCount = newFilter === 'all'
        ? Math.min(items.length, 6)
        : Math.min(items.filter(i => i.category === newFilter).length, 6);

      staggerCardsIn(newCount);
    }, FADE_OUT_MS);

    transitionTimers.current.push(swapTimer);
  }, [activeFilter, clearTimers, items, staggerCardsIn]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleHeader(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          staggerCardsIn(filtered.length);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered.length, staggerCardsIn]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <section className="py-24 px-4 md:px-6 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-screen-xl mx-auto">
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p
              className="text-xs font-semibold text-brand dark:text-brand-dark uppercase tracking-widest mb-3 transition-all duration-500"
              style={{
                opacity: visibleHeader ? 1 : 0,
                transform: visibleHeader ? 'translateY(0)' : 'translateY(-16px)',
                transitionDelay: '0ms',
              }}
            >
              El catálogo
            </p>
            <h2
              className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white transition-all duration-500"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                opacity: visibleHeader ? 1 : 0,
                transform: visibleHeader ? 'translateY(0)' : 'translateY(-16px)',
                transitionDelay: '100ms',
              }}
            >
              Qué puedes trackear
            </h2>
          </div>

          <div
            className="flex items-center gap-2 flex-wrap transition-all duration-500"
            style={{
              opacity: visibleHeader ? 1 : 0,
              transform: visibleHeader ? 'translateY(0)' : 'translateY(-16px)',
              transitionDelay: '200ms',
            }}
          >
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              Todo
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeFilter === cat.id
                    ? 'text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                }`}
                style={activeFilter === cat.id ? { background: cat.accent } : {}}
              >
                <i className={`${cat.icon} text-xs`}></i>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 transition-opacity"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transitionDuration: `${FADE_OUT_MS}ms`,
          }}
        >
          {filtered.map((item, index) => {
            const cat = CATEGORIES.find(c => c.id === item.category);
            return (
              <Link
                key={item.id}
                to={`/catalog/${item.category}/${item.slug}`}
                className="group cursor-pointer transition-all duration-500"
                style={{
                  opacity: visibleCards[index] ? 1 : 0,
                  transform: visibleCards[index] ? 'translateY(0)' : 'translateY(24px)',
                }}
              >
                <div className="relative rounded-xl overflow-hidden mb-3">
                  <div className="aspect-[2/3] bg-zinc-100 dark:bg-zinc-800">
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className={`${cat?.icon ?? 'ri-image-line'} text-3xl text-zinc-400`}></i>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>

                  <div className="absolute top-2 left-2">
                    <div
                      className="w-6 h-6 flex items-center justify-center rounded-lg"
                      style={{ background: `${cat?.accent}30`, backdropFilter: 'blur(4px)' }}
                    >
                      <i className={`${cat?.icon} text-xs`} style={{ color: cat?.accent }}></i>
                    </div>
                  </div>

                  {item.rating != null && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-1">
                      <i className="ri-star-fill text-amber-400 text-xs"></i>
                      <span className="text-white text-xs font-semibold">{item.rating.toFixed(1)}</span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    {item.rating != null && (
                      <div className="flex items-center gap-1">
                        <i className="ri-star-fill text-amber-400 text-xs"></i>
                        <span className="text-white text-xs font-semibold">{item.rating.toFixed(1)}</span>
                        <span className="text-white/50 text-xs ml-1">{item.year}</span>
                      </div>
                    )}
                    <div
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: cat?.accent ?? '#e11d48' }}
                    >
                      <i className="ri-eye-line text-xs"></i>
                      Ver detalle
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{item.year}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status] || 'bg-zinc-100 text-zinc-500'}`}>
                    {item.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div
          className="text-center mt-10 transition-all duration-500"
          style={{
            opacity: visibleCards[Math.max(filtered.length - 1, 0)] ? 1 : 0,
            transform: visibleCards[Math.max(filtered.length - 1, 0)] ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: `${filtered.length * STAGGER_MS}ms`,
          }}
        >
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Ver todo el catalogo
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
