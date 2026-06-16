/**
 * CTASection.tsx — sección de llamada a la acción final de la landing page.
 *
 * Cierre de la página con titular emocional y dos botones: el principal lleva
 * a registro (o al tracker si ya ha iniciado sesión) y el secundario al catálogo.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';

// ─── Componentes ────────────────────────────────────────────────────────────────────

import { InteractiveHoverLink } from "@/components/ui/interactive-hover-button"


// ─── Componente ──────────────────────────────────────────────────────────────

export default function CTASection() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 px-4 md:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(37,99,235,0.10),transparent)]" />

      <div className="relative mx-auto max-w-xl text-center">
        <h2
          className="mb-4 text-4xl font-black leading-[1.08] tracking-tight text-white md:text-5xl"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Dentro de 10 años,<br />
          <span className="text-blue-400">querrás tener este historial.</span>
        </h2>
        <p className="mb-10 max-w-sm mx-auto text-[16px] leading-relaxed text-zinc-500">
          Cada título que terminas hoy es un recuerdo que puedes recuperar mañana.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isLoggedIn ? (
            <InteractiveHoverLink
              to="/tracker"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-[15px] font-bold text-white transition-colors"
              fillClassName="bg-brand-hover"
              showArrow={false}
            >
              Ir a mi Tracker <i className="ri-arrow-right-line" />
            </InteractiveHoverLink>
          ) : (
            <InteractiveHoverLink
              to="/auth"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-[15px] font-bold text-white transition-colors"
              fillClassName="bg-brand-hover"
              showArrow={false}
            >
              Empezar gratis <i className="ri-arrow-right-line" />
            </InteractiveHoverLink>
          )}
          <InteractiveHoverLink
            to="/catalog"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-[15px] font-semibold text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
            showArrow={true}
          >
            Explorar catálogo
          </InteractiveHoverLink>
        </div>
      </div>
    </section>
  );
}
