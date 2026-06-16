/**
 * LazyRoute.tsx — envoltorio de Suspense para rutas cargadas con lazy().
 *
 * Muestra un spinner de carga neutro mientras el chunk de la página
 * se descarga y evalúa. Centraliza el fallback para que todos los
 * lazy imports de config.tsx compartan el mismo estado de carga.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { Suspense, type ReactNode } from 'react';
import { LogoMark } from '@/components/branding/Logo';

// ─── Componente ──────────────────────────────────────────────────────────────

/** Envuelve un componente lazy con Suspense y un fallback de carga consistente. */
export default function LazyRoute({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--surface)] dark:bg-[var(--bg)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand dark:bg-brand-dark">
              <LogoMark size={24} />
            </div>
            <p className="text-sm text-zinc-400">Cargando...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
