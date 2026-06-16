/**
 * TrackerCardGrid.tsx — grid de tarjetas del tracker (vista póster).
 *
 * Wrapper simple que distribuye las EnrichedEntry en un grid responsive
 * de tarjetas de póster. Delega el renderizado individual a TrackerCard.
 */

// ─── Componentes ──────────────────────────────────────────────────────────────

import TrackerCard from './TrackerCard';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { EnrichedEntry } from './trackerEntryUtils';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del grid de tarjetas del tracker. */
interface Props {
  enriched: EnrichedEntry[];
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function TrackerCardGrid({ enriched }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
      {enriched.map(item => (
        <TrackerCard key={item.itemId} item={item} />
      ))}
    </div>
  );
}
