/**
 * trackerEntryUtils.ts — utilidades de enriquecimiento de entradas del tracker.
 *
 * Expone `enrichEntries()`, que convierte el mapa plano de TrackerEntry en
 * un array de EnrichedEntry añadiendo el acento, icono y etiqueta de categoría.
 * También aplica `safeTitle()` para sanear títulos generados automáticamente
 * con el patrón "Categoria 123456" que devuelven algunos IDs externos.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

import { TrackerEntry } from '@/hooks/useTracker';
import type { CategoryConfig } from '@/lib/categoryConfig';

// ─── Interfaces ───────────────────────────────────────────────────────────────

/**
 * Entrada del tracker enriquecida con datos de categoría.
 * Extiende TrackerEntry añadiendo los campos visuales de la categoría.
 */
export interface EnrichedEntry extends TrackerEntry {
  /** Color acento hexadecimal de la categoría. */
  catAccent: string;
  /** Clase de icono Remix Icon de la categoría. */
  catIcon: string;
  /** Etiqueta localizada de la categoría. */
  catLabel: string;
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Devuelve el título limpio de una entrada.
 * Guard contra el patrón "Categoria 123456" que producen algunos IDs externos:
 * en ese caso reconstruye el título desde el slug del itemId.
 *
 * @param entry - Entrada del tracker.
 * @returns Título legible.
 */
function safeTitle(entry: TrackerEntry): string {
  const raw = entry.title?.trim() ?? '';
  if (!raw || /^[a-z]+ \d{4,}$/i.test(raw)) {
    const fromSlug = entry.itemId.replace(/-/g, ' ').trim();
    if (/^[a-z]+ \d{4,}$/i.test(fromSlug)) return 'Elemento sin título';
    return fromSlug.replace(/\b\w/g, c => c.toUpperCase());
  }
  return raw;
}

/**
 * Convierte el mapa de entradas del tracker en un array de EnrichedEntry,
 * añadiendo `catAccent`, `catIcon` y `catLabel` desde la configuración de categorías.
 *
 * @param entries - Mapa itemId → TrackerEntry.
 * @param categories - Array de configuraciones de categoría del usuario.
 * @returns Array de entradas enriquecidas con datos visuales de categoría.
 */
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
