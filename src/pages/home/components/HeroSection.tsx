/**
 * HeroSection.tsx — sección hero de la landing page de Vaultly.
 *
 * Muestra el titular principal y un panel de tracker simulado con entradas estáticas
 * que ilustran cómo luce el tracker real. El CTA cambia entre "Crear cuenta"
 * e "Ir a mi Tracker" según si el usuario ha iniciado sesión.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';
import { LogoMark } from '@/components/branding/Logo';

// ─── Componentes ────────────────────────────────────────────────────────────────────

import { InteractiveHoverLink } from "@/components/ui/interactive-hover-button"

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Entradas estáticas del panel de tracker ilustrativo. */
const TRACKER_ENTRIES = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    type: 'Videojuego',
    year: '2023',
    status: 'completed' as const,
    rating: 9,
    detail: '100 / 100 logros',
    gradient: 'from-blue-950 to-cyan-950',
    accent: '#3b82f6',
    icon: 'ri-gamepad-line',
  },
  {
    id: '2',
    title: 'Breaking Bad',
    type: 'Serie',
    year: '2008',
    status: 'in_progress' as const,
    rating: null,
    detail: 'T6 · E10 de 62',
    gradient: 'from-amber-950 to-orange-950',
    accent: '#f59e0b',
    icon: 'ri-tv-2-line',
  },
  {
    id: '3',
    title: 'Dune: Parte Dos',
    type: 'Película',
    year: '2024',
    status: 'pending' as const,
    rating: null,
    detail: 'Sin puntuar',
    gradient: 'from-orange-950 to-red-950',
    accent: '#f97316',
    icon: 'ri-film-line',
  },
  {
    id: '4',
    title: 'Interstellar',
    type: 'Película',
    year: '2014',
    status: 'completed' as const,
    rating: 10,
    detail: '♥ Favorita',
    gradient: 'from-slate-800 to-zinc-900',
    accent: '#94a3b8',
    icon: 'ri-film-line',
  },
  {
    id: '5',
    title: 'The Witcher 3',
    type: 'Videojuego',
    year: '2015',
    status: 'completed' as const,
    rating: 10,
    detail: '100% logros',
    gradient: 'from-emerald-950 to-green-950',
    accent: '#22c55e',
    icon: 'ri-gamepad-line',
  },
] as const;

/** Mapa de etiquetas y colores para cada estado de una entrada del tracker. */
type Status = 'completed' | 'in_progress' | 'pending';
const STATUS: Record<Status, { label: string; dot: string }> = {
  completed:   { label: 'Completado',  dot: 'bg-emerald-500' },
  in_progress: { label: 'En progreso', dot: 'bg-orange-500' },
  pending:     { label: 'Pendiente',   dot: 'bg-zinc-600' },
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function HeroSection() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="relative overflow-hidden bg-zinc-950 pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-5%,rgba(37,99,235,0.10),transparent)]" />

      <div className="relative mx-auto max-w-screen-xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 py-14 md:py-20 lg:grid-cols-[1fr_460px] lg:gap-20">

          {/* Columna izquierda — copy */}
          <div>
            <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Tu historial cultural personal
            </p>
            <h1
              className="mb-5 text-[clamp(2.4rem,5vw,3.4rem)] font-black leading-[1.04] tracking-[-0.02em] text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Todo lo que has visto,
              <br />jugado, leído
              <br />
              <span className="text-blue-400">y escuchado.</span>
            </h1>
            <p className="mb-8 max-w-[380px] text-[17px] leading-[1.65] text-zinc-400">
              Tu historial cultural completo en un único lugar.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {isLoggedIn ? (
                <InteractiveHoverLink
                  to="/tracker"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand px-6 py-3 text-[14px] font-bold text-white transition-colors"
                  fillClassName="bg-brand-hover"
                  showArrow={false}
                >
                  Ir a mi Tracker <i className="ri-arrow-right-line" />
                </InteractiveHoverLink>
              ) : (
                <InteractiveHoverLink
                  to="/auth"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand px-6 py-3 text-[14px] font-bold text-white transition-colors"
                  fillClassName="bg-brand-hover"
                  showArrow={true}
                >
                  Crear cuenta gratis
                </InteractiveHoverLink>
              )}
              <InteractiveHoverLink
                to="/catalog"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-[14px] font-semibold text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
                showArrow={true}
              >
                Explorar catálogo
              </InteractiveHoverLink>
            </div>
          </div>

          {/* Columna derecha — panel de tracker ilustrativo */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 rounded-3xl bg-blue-600/5 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0d1117] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">

              {/* Cabecera del panel */}
              <div className="flex items-center justify-between border-b border-white/6 bg-[#0d1117] px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-600">
                    <LogoMark size={12} />
                  </div>
                  <span className="text-[13px] font-semibold text-white">Mi Tracker</span>
                  <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-medium text-white/40">
                    5 ítems
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/35">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  1 en progreso
                </div>
              </div>

              {/* Lista de entradas */}
              <div className="divide-y divide-white/[0.04]">
                {TRACKER_ENTRIES.map(entry => {
                  const s = STATUS[entry.status];
                  return (
                    <div key={entry.id} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.025]">
                      <div className={`relative h-[52px] w-[36px] flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${entry.gradient}`} />
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold leading-tight text-white">{entry.title}</p>
                            <p className="mt-0.5 text-[11px] text-zinc-600">{entry.type} · {entry.year}</p>
                          </div>
                          <div className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                            entry.status === 'completed'   ? 'border-emerald-500/20 bg-emerald-500/8 text-emerald-400'  :
                            entry.status === 'in_progress' ? 'border-orange-500/20 bg-orange-500/8 text-orange-400'     :
                                                             'border-zinc-700 bg-zinc-800 text-zinc-500'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </div>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          {entry.rating !== null && (
                            <div className="flex items-center gap-1">
                              <i className="ri-star-fill text-[10px] text-amber-400" />
                              <span className="text-[11px] font-bold text-amber-400">{entry.rating}/10</span>
                            </div>
                          )}
                          {entry.detail && (
                            <>
                              {entry.rating !== null && <span className="text-[10px] text-zinc-700">·</span>}
                              <span className="text-[11px] text-zinc-600">{entry.detail}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pie del panel */}
              <div className="border-t border-white/6 bg-[#0a0e14] px-5 py-3">
                <p className="text-[11px] text-zinc-600">
                  3 completados · 1 en progreso · 1 pendiente
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
