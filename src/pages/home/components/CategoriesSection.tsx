import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategoryColors';

export default function CategoriesSection() {
  const CATEGORIES = useCategories();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(CATEGORIES.length).fill(false)
  );
  const [visibleHeader, setVisibleHeader] = useState(false);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleHeader(true);
          headerObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (headerRef.current) headerObserver.observe(headerRef.current);
    return () => headerObserver.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          CATEGORIES.forEach((_, i) => {
            setTimeout(() => {
              setVisibleCards(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 100);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 px-4 md:px-6 bg-[var(--surface)] dark:bg-[var(--bg)]">
      <div className="max-w-screen-xl mx-auto">
        <div ref={headerRef} className="text-center mb-14">
          <p
            className="text-xs font-semibold text-brand dark:text-brand-dark uppercase tracking-widest mb-3"
            style={{
              transition: 'opacity 500ms ease-out, transform 500ms ease-out',
              opacity: visibleHeader ? 1 : 0,
              transform: visibleHeader ? 'translateY(0)' : 'translateY(-20px)',
            }}
          >
            Categorías
          </p>
          <h2
            className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'opacity 500ms ease-out 100ms, transform 500ms ease-out 100ms',
              opacity: visibleHeader ? 1 : 0,
              transform: visibleHeader ? 'translateY(0)' : 'translateY(-20px)',
            }}
          >
            Cubre todo tu consumo cultural
          </h2>
          <p
            className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-base"
            style={{
              transition: 'opacity 500ms ease-out 200ms, transform 500ms ease-out 200ms',
              opacity: visibleHeader ? 1 : 0,
              transform: visibleHeader ? 'translateY(0)' : 'translateY(-20px)',
            }}
          >
            Activa las categorías que uses. Cada una con su propio catálogo y su propio tracker.
          </p>
        </div>

        <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/catalog/${cat.id}`}
              className="group relative overflow-hidden rounded-2xl cursor-pointer border-2 border-transparent"
              style={{
                transition: 'border-color 300ms, opacity 500ms ease-out, transform 500ms ease-out',
                opacity: visibleCards[i] ? 1 : 0,
                transform: visibleCards[i] ? 'translateY(0)' : 'translateY(32px)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = cat.accent)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} mb-3 group-hover:scale-125`}
                  style={{ transition: 'transform 300ms, box-shadow 300ms' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 16px 4px ${cat.accent}99`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <i className={`${cat.icon} text-white text-lg`} />
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mb-1 transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
                  {cat.label}
                </h3>
                <div className="overflow-hidden h-4">
                  <p className="text-white/60 text-xs translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    {cat.count.toLocaleString()} ítems
                  </p>
                </div>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <i className="ri-arrow-right-up-line text-white text-sm" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

