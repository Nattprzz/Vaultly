import { useRef, useState, useEffect } from 'react';

// 4 events cover the 4 key tracker actions. 5 was redundant.
const EVENTS = [
  {
    id: '1',
    icon: 'ri-checkbox-circle-fill',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.10)',
    ring: 'rgba(34,197,94,0.20)',
    action: 'Has terminado',
    item: 'Cyberpunk 2077',
    detail: 'Videojuego · 100 / 100 logros desbloqueados',
    time: 'hace 2 días',
  },
  {
    id: '2',
    icon: 'ri-star-fill',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.10)',
    ring: 'rgba(245,158,11,0.20)',
    action: 'Has puntuado',
    item: 'Interstellar',
    detail: 'Película · 10 / 10',
    time: 'hace 3 días',
  },
  {
    id: '3',
    icon: 'ri-add-circle-fill',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.10)',
    ring: 'rgba(59,130,246,0.20)',
    action: 'Has añadido',
    item: 'Dune: Parte Dos',
    detail: 'Película · 2024 · Pendiente',
    time: 'hace 5 días',
  },
  {
    id: '4',
    icon: 'ri-play-circle-fill',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.10)',
    ring: 'rgba(249,115,22,0.20)',
    action: 'Has retomado',
    item: 'Breaking Bad',
    detail: 'Serie · Temporada 6 · Episodio 10',
    time: 'hace 1 semana',
  },
] as const;

export default function ActivitySection() {
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
    <section className="px-4 py-16 md:py-20 md:px-6 bg-[var(--surface)] dark:bg-[var(--bg)]">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_480px] lg:gap-20">

          {/* Left — sticky heading, no inline CTA */}
          <div
            className="lg:sticky lg:top-24 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
          >
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--brand-accent)] dark:text-blue-400">
              Tu actividad
            </p>
            <h2
              className="mb-4 text-3xl font-black leading-[1.1] tracking-tight text-zinc-900 dark:text-white md:text-4xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Tu historia se
              <br />construye sola.
            </h2>
            <p className="max-w-xs text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Cada título que completas, cada puntuación que dejas — guardada para siempre.
            </p>
          </div>

          {/* Right — timeline */}
          <div ref={ref}>
            <div className="relative">
              <div className="absolute left-[18px] top-5 bottom-5 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex flex-col gap-0">
                {EVENTS.map((ev, i) => (
                  <div
                    key={ev.id}
                    className="relative flex gap-4 pb-6 last:pb-0 transition-all duration-700"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'none' : 'translateX(14px)',
                      transitionDelay: `${i * 80}ms`,
                    }}
                  >
                    {/* Node */}
                    <div
                      className="relative z-10 mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ background: ev.bg, border: `1.5px solid ${ev.ring}` }}
                    >
                      <i className={`${ev.icon} text-[13px]`} style={{ color: ev.color }} />
                    </div>

                    {/* Card */}
                    <div className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-sm)]">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] leading-snug text-zinc-900 dark:text-white">
                          <span className="font-semibold">{ev.action}</span>{' '}
                          <span className="font-bold" style={{ color: ev.color }}>{ev.item}</span>
                        </p>
                        <span className="flex-shrink-0 text-[11px] text-zinc-400 dark:text-zinc-600">{ev.time}</span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-zinc-500 dark:text-zinc-500">{ev.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
