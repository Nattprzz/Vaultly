import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useTracker } from '@/hooks/useTracker';

type TrackerContextValue = ReturnType<typeof useTracker>;

const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const tracker = useTracker();
  return <TrackerContext.Provider value={tracker}>{children}</TrackerContext.Provider>;
}

export function useTrackerContext(): TrackerContextValue {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error('useTrackerContext must be used within TrackerProvider');
  return ctx;
}
