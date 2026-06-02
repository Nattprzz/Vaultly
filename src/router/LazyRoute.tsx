import { Suspense, type ReactNode } from 'react';

export default function LazyRoute({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-rose-500">
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
