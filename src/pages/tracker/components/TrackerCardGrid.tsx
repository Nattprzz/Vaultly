import TrackerCard from './TrackerCard';
import type { EnrichedEntry } from './trackerEntryUtils';

interface Props {
  enriched: EnrichedEntry[];
}

export default function TrackerCardGrid({ enriched }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
      {enriched.map(item => (
        <TrackerCard key={item.itemId} item={item} />
      ))}
    </div>
  );
}
