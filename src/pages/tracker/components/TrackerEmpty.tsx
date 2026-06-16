/**
 * TrackerEmpty.tsx — estado vacío del tracker.
 *
 * Muestra un mensaje contextual diferente según si el vacío se debe a un filtro
 * de estado activo (sin resultados para ese filtro) o a que el tracker de esa
 * categoría no tiene ítems todavía. En el caso de tracker vacío, ofrece un
 * enlace al catálogo para añadir contenido.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useCategories } from '@/hooks/useCategoryColors';

// ─── Componentes ────────────────────────────────────────────────────────────────────

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del estado vacío del tracker. */
interface Props {
  category: string;
  statusFilter: string;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function TrackerEmpty({ category, statusFilter }: Props) {
  const CATEGORIES = useCategories();
  const cat = CATEGORIES.find(c => c.id === category);

  const isFiltered = statusFilter !== 'all';

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5">
        <i className={`${cat?.icon ?? 'ri-inbox-line'} text-2xl text-zinc-400`}></i>
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
        {isFiltered
          ? 'Sin resultados para este filtro'
          : `Tu tracker de ${cat?.label ?? 'contenido'} está vacío`}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-6">
        {isFiltered
          ? 'Prueba a cambiar el filtro de estado para ver más ítems.'
          : `Explora el catálogo y añade ${cat?.label?.toLowerCase() ?? 'contenido'} a tu tracker.`}
      </p>
      {!isFiltered && (
        <Link
          to={`/catalog/${category !== 'all' ? category : ''}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
        >
          <i className="ri-compass-3-line"></i>
          Explorar catálogo
        </Link>
      )}
    </div>
  );
}
