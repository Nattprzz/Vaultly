import { Suspense, type ReactNode } from 'react';

export default function LazyRoute({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--surface)] dark:bg-[var(--bg)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand dark:bg-brand-dark">
              <i className="ri-archive-2-line text-white"></i>
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
