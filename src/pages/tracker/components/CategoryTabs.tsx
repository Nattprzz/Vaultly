/**
 * CategoryTabs.tsx — barra de pestañas de categoría del tracker.
 *
 * Muestra una pestaña "Todo" más una pestaña por cada categoría que el usuario
 * tiene activa. Cada pestaña muestra el recuento de ítems de esa categoría.
 * La pestaña activa se colorea con el acento de la categoría o en negro/blanco
 * para "Todo".
 */

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useCategories } from '@/hooks/useCategoryColors';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import { TrackerEntry } from '@/hooks/useTracker';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props de la barra de pestañas de categoría. */
interface Props {
  activeCategory: string;
  onSelect: (id: string) => void;
  entries: Record<string, TrackerEntry>;
  /** IDs de categorías que el usuario tiene configuradas. */
  activeCategories: string[];
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function CategoryTabs({ activeCategory, onSelect, entries, activeCategories }: Props) {
  // ─── Datos derivados ──────────────────────────────────────────────────────

  const CATEGORIES = useCategories();
  const allEntries = Object.values(entries);

  /**
   * Cuenta los ítems de una categoría, o el total si `catId` es `'all'`.
   *
   * @param catId - ID de la categoría o `'all'`.
   * @returns Número de ítems.
   */
  const getCount = (catId: string) =>
    catId === 'all'
      ? allEntries.length
      : allEntries.filter(e => e.category === catId).length;

  const visibleCats = CATEGORIES.filter(c => activeCategories.includes(c.id));

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      {/* Pestaña "Todo" */}
      <button
        onClick={() => onSelect('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
          activeCategory === 'all'
            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
            : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
        }`}
      >
        <i className="ri-apps-line text-sm"></i>
        Todo
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
          activeCategory === 'all'
            ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
            : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
        }`}>
          {getCount('all')}
        </span>
      </button>

      {/* Pestaña por categoría activa */}
      {visibleCats.map(cat => {
        const count = getCount(cat.id);
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'text-white'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
            }`}
            style={isActive ? { background: cat.accent } : {}}
          >
            <i className={`${cat.icon} text-sm`}></i>
            {cat.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              isActive
                ? 'bg-white/25 text-white'
                : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
