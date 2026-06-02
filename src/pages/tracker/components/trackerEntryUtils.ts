import { TrackerEntry } from '@/hooks/useTracker';
import { CATALOG_MOCK, CATEGORIES } from '@/mocks/catalog';

export interface EnrichedEntry extends TrackerEntry {
  title: string;
  cover: string;
  year: number;
  genre: string;
  catAccent: string;
  catIcon: string;
  catLabel: string;
}

export function enrichEntries(entries: Record<string, TrackerEntry>): EnrichedEntry[] {
  return Object.values(entries).map(entry => {
    const catItems = CATALOG_MOCK[entry.category] ?? [];
    const catalogItem = catItems.find(i => i.id === entry.itemId);
    const cat = CATEGORIES.find(c => c.id === entry.category);
    return {
      ...entry,
      title: catalogItem?.title ?? 'Ítem desconocido',
      cover: catalogItem?.cover ?? '',
      year: catalogItem?.year ?? 0,
      genre: catalogItem?.genre ?? '',
      catAccent: cat?.accent ?? '#8b5cf6',
      catIcon: cat?.icon ?? 'ri-star-line',
      catLabel: cat?.label ?? '',
    };
  });
}
