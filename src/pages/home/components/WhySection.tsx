import { useRef, useState, useEffect } from 'react';

const BEFORE = [
  { app: 'Letterboxd', for: 'películas',   icon: 'ri-film-line',      color: '#f97316' },
  { app: 'Backloggd',  for: 'videojuegos', icon: 'ri-gamepad-line',   color: '#3b82f6' },
  { app: 'Goodreads',  for: 'libros',      icon: 'ri-book-open-line', color: '#fbbf24' },
  { app: 'Trakt',      for: 'series',      icon: 'ri-tv-2-line',      color: '#8b5cf6' },
  { app: '¿Y los conciertos?', for: '',    icon: 'ri-music-2-line',   color: '#64748b' },
];

const AFTER = [
  { label: 'Videojuegos', icon: 'ri-gamepad-line',    color: '#3b82f6' },
  { label: 'Películas',   icon: 'ri-film-line',        color: '#f97316' },
  { label: 'Series',      icon: 'ri-tv-2-line',        color: '#8b5cf6' },
  { label: 'Libros',      icon: 'ri-book-open-line',   color: '#fbbf24' },
  { label: 'Conciertos',  icon: 'ri-music-2-line',     color: '#ec4899' },
];

export default function WhySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-14 px-4 md:px-6 bg-[var(--surface)] dark:bg-zinc-900/40" ref={sectionRef}>
      <div className="max-w-screen-xl mx-auto">

        {/* Left-aligned header — no paragraph, just the question */}
        <div
          className="mb-10 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
        >
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--brand-accent)] dark:text-blue-400">
            Por qué Vaultly
          </p>
          <h2
            className="text-2xl font-black leading-tight tracking-tight text-zinc-900 dark:text-white md:text-3xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ¿Cuántas apps usas ahora mismo?
          </h2>
        </div>

        {/* Before / After comparison — left-aligned, not centered */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transitionDelay: '80ms' }}
        >
          {/* Before */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-red-400 text-[11px] font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
              <i className="ri-close-circle-line" />
              Sin Vaultly
            </p>
            <div className="flex flex-col gap-3.5">
              {BEFORE.map(item => (
                <div key={item.app} className="flex items-center gap-3">
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${item.color}15` }}
                  >
                    <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{item.app}</span>
                    {item.for && (
                      <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-500">para {item.for}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
            <p className="text-blue-400 text-[11px] font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
              <i className="ri-checkbox-circle-line" />
              Con Vaultly
            </p>
            <div className="flex flex-col gap-3.5">
              {AFTER.map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${item.color}15` }}
                  >
                    <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">{item.label}</span>
                  <i className="ri-check-line ml-auto text-blue-500 dark:text-blue-400 text-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
