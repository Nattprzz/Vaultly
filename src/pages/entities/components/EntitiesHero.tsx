import { useEffect, useRef } from 'react';

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  totalCount: number;
}

export default function EntitiesHero({ search, onSearchChange, totalCount }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Reveal refs
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items: [React.RefObject<HTMLElement | null>, number][] = [
      [breadcrumbRef, 0],
      [badgeRef, 80],
      [titleRef, 160],
      [descRef, 240],
      [statsRef, 320],
      [searchRef, 420],
    ];
    const timers = items.map(([ref, delay]) =>
      setTimeout(() => ref.current?.classList.add('sr-visible'), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative overflow-hidden bg-zinc-950 pt-24 pb-14">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-screen-xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div
          ref={breadcrumbRef as React.RefObject<HTMLDivElement>}
          className="sr-item-up flex items-center gap-2 text-xs text-zinc-500 mb-6"
        >
          <i className="ri-home-4-line"></i>
          <span>/</span>
          <span className="text-zinc-300">Entidades</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end gap-8">
          {/* Left */}
          <div className="flex-1">
            <div
              ref={badgeRef as React.RefObject<HTMLDivElement>}
              className="sr-item flex items-center gap-3 mb-3"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand/15">
                <i className="ri-user-star-line text-brand dark:text-brand-dark text-lg"></i>
              </div>
              <span className="text-xs font-semibold text-brand dark:text-brand-dark uppercase tracking-widest">Directorio</span>
            </div>
            <h1
              ref={titleRef as React.RefObject<HTMLHeadingElement>}
              className="sr-item text-4xl md:text-5xl font-black text-white leading-tight mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Entidades
            </h1>
            <p
              ref={descRef as React.RefObject<HTMLParagraphElement>}
              className="sr-item text-zinc-400 text-base max-w-xl leading-relaxed"
            >
              Directores, actores, autores, estudios y artistas. Explora quién hay detrás de cada obra del catálogo.
            </p>
          </div>

          {/* Stats */}
          <div
            ref={statsRef as React.RefObject<HTMLDivElement>}
            className="sr-item flex items-center gap-6 lg:gap-8"
          >
            {[
              { label: 'Total', value: totalCount, icon: 'ri-group-line' },
              { label: 'Tipos', value: 6, icon: 'ri-price-tag-3-line' },
              { label: 'Obras vinculadas', value: '200+', icon: 'ri-film-line' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="w-8 h-8 flex items-center justify-center mx-auto mb-1">
                  <i className={`${stat.icon} text-zinc-400 text-lg`}></i>
                </div>
                <p className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div
          ref={searchRef as React.RefObject<HTMLDivElement>}
          className="sr-item mt-8 max-w-2xl"
        >
          <div
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand/50 dark:focus-within:border-brand-dark/50 focus-within:bg-white/8 transition-all cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <i className="ri-search-line text-zinc-400 text-lg flex-shrink-0"></i>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre, rol, nacionalidad..."
              className="flex-1 bg-transparent text-white placeholder-zinc-500 text-sm outline-none"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-600 hover:bg-zinc-500 transition-colors cursor-pointer flex-shrink-0"
              >
                <i className="ri-close-line text-white text-xs"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
