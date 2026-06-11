import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IN_PROGRESS = [
  {
    id: '1',
    title: 'Breaking Bad',
    type: 'Serie',
    detail: 'Temporada 6 · Episodio 10',
    progressLabel: '58 / 62 eps',
    pct: 94,
    gradient: 'from-amber-950 to-orange-950',
    accent: '#f59e0b',
    icon: 'ri-tv-2-line',
    slug: 'series',
  },
  {
    id: '2',
    title: 'One Piece',
    type: 'Anime',
    detail: 'Episodio 324',
    progressLabel: '324 / 1100 eps',
    pct: 29,
    gradient: 'from-red-950 to-orange-950',
    accent: '#ef4444',
    icon: 'ri-tv-2-line',
    slug: 'series',
  },
  {
    id: '3',
    title: 'Dune',
    type: 'Libro',
    detail: 'Frank Herbert',
    progressLabel: '340 / 500 págs',
    pct: 68,
    gradient: 'from-yellow-950 to-amber-950',
    accent: '#d97706',
    icon: 'ri-book-open-line',
    slug: 'libros',
  },
  {
    id: '4',
    title: 'Cyberpunk 2077',
    type: 'Videojuego',
    detail: 'Night City',
    progressLabel: '78 / 100 logros',
    pct: 78,
    gradient: 'from-blue-950 to-cyan-950',
    accent: '#3b82f6',
    icon: 'ri-gamepad-line',
    slug: 'videojuegos',
  },
] as const;

export default function ContinueSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-16 px-4 md:px-6 bg-[var(--surface)] dark:bg-[var(--bg)]">
      <div className="mx-auto max-w-screen-xl" ref={ref}>

        {/* Header */}
        <div
          className="mb-10 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)' }}
        >
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--brand-accent)] dark:text-blue-400">
            En progreso
          </p>
          <h2
            className="text-3xl font-black leading-tight tracking-tight text-zinc-900 dark:text-white md:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Continúa donde
            <br />lo dejaste.
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {IN_PROGRESS.map((item, i) => (
            <div
              key={item.id}
              className="group flex items-start gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-700 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(20px)',
                transitionDelay: `${i * 70}ms`,
              }}
            >
              {/* Gradient poster */}
              <div
                className={`relative h-[72px] w-[50px] flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${item.gradient}`}
              />

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <div className="min-w-0">
                    <h3 className="truncate text-[14px] font-bold leading-tight text-zinc-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-zinc-500 dark:text-zinc-500 mt-0.5">
                      {item.type} · {item.detail}
                    </p>
                  </div>
                  <Link
                    to={`/tracker/${item.slug}`}
                    className="flex-shrink-0 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 transition-colors hover:border-[var(--border-strong)] hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                  >
                    Continuar
                  </Link>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-600">
                      {item.progressLabel}
                    </span>
                    <span className="text-[11px] font-bold" style={{ color: item.accent }}>
                      {item.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: visible ? `${item.pct}%` : '0%',
                        background: item.accent,
                        transitionDelay: `${i * 70 + 300}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
