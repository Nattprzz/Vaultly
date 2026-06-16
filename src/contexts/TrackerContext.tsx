/**
 * TrackerContext.tsx — proveedor de contexto del tracker personal.
 *
 * Envuelve useTracker en un Context de React para que cualquier componente
 * del árbol pueda acceder al estado del tracker sin prop drilling.
 * Debe montarse una única vez, dentro del shell de la aplicación autenticada.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useTracker } from '@/hooks/useTracker';

// ─── Contexto ────────────────────────────────────────────────────────────────

type TrackerContextValue = ReturnType<typeof useTracker>;

const TrackerContext = createContext<TrackerContextValue | null>(null);

// ─── Proveedor ───────────────────────────────────────────────────────────────

/**
 * Monta useTracker y expone su valor a todos los componentes descendientes.
 * Solo debe usarse una vez en el árbol de componentes.
 */
export function TrackerProvider({ children }: { children: ReactNode }) {
  const tracker = useTracker();
  return <TrackerContext.Provider value={tracker}>{children}</TrackerContext.Provider>;
}

// ─── Consumidor ──────────────────────────────────────────────────────────────

/**
 * Accede al contexto del tracker desde cualquier componente hijo de TrackerProvider.
 * Lanza un error descriptivo si se usa fuera del proveedor.
 */
// Co-exporting hook with provider is standard context pattern; fast-refresh limitation is acceptable.
// eslint-disable-next-line react-refresh/only-export-components
export function useTrackerContext(): TrackerContextValue {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error('useTrackerContext must be used within TrackerProvider');
  return ctx;
}
