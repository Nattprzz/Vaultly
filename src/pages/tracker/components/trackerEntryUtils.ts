import { TrackerEntry } from '@/hooks/useTracker';
import type { CategoryConfig } from '@/lib/categoryConfig';

export interface EnrichedEntry extends TrackerEntry {
  catAccent: string;
  catIcon: string;
  catLabel: string;
}

function safeTitle(entry: TrackerEntry): string {
  const raw = entry.title?.trim() ?? '';
  // Guard against "Category 123456" pattern produced by external IDs
  if (!raw || /^[a-z]+ \d{4,}$/i.test(raw)) {
    const fromSlug = entry.itemId.replace(/-/g, ' ').trim();
    if (/^[a-z]+ \d{4,}$/i.test(fromSlug)) return 'Elemento sin título';
    return fromSlug.replace(/\b\w/g, c => c.toUpperCase());
  }
  return raw;
}

export function enrichEntries(entries: Record<string, TrackerEntry>, categories: CategoryConfig[]): EnrichedEntry[] {
  return Object.values(entries).map(entry => {
    const cat = categories.find(c => c.id === entry.category);
    return {
      ...entry,
      title:     safeTitle(entry),
      cover:     entry.cover,
      year:      entry.year,
      genre:     entry.genre,
      catAccent: cat?.accent ?? '#8b5cf6',
      catIcon:   cat?.icon   ?? 'ri-star-line',
      catLabel:  cat?.label  ?? entry.category,
    };
  });
}
