/**
 * ProfileShowcase.tsx — vitrina con los mejores ítems del usuario.
 *
 * Presenta dos secciones calculadas sobre las entradas del tracker:
 * "Mejor valorados" (hasta 6 ítems completados con puntuación),
 * y "Completados recientemente" (hasta 4 ítems ordenados por updatedAt).
 * Cada ítem enlaza a su página de detalle en el catálogo.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useTracker }    from '@/hooks/useTracker';
import { useCategories } from '@/hooks/useCategoryColors';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { CategoryConfig } from '@/lib/categoryConfig';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Entrada del tracker enriquecida con los datos visuales de su categoría. */
interface EnrichedItem {
  itemId:    string;
  category:  string;
  title:     string;
  cover:     string;
  year:      number;
  genre:     string;
  rating:    number | null;
  status:    string;
  catAccent: string;
  catIcon:   string;
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

/**
 * Enriquece una entrada del tracker con los datos de su categoría.
 * @param entry      - Entrada del tracker del usuario.
 * @param categories - Lista de categorías disponibles con accent e icono.
 * @returns Objeto EnrichedItem, o null si la categoría no se encuentra.
 */
function enrichItem(entry: ReturnType<typeof useTracker>['entries'][string], categories: CategoryConfig[]): EnrichedItem | null {
  const category = entry.category;
  const cat      = categories.find(c => c.id === category);
  if (!cat) return null;
  return {
    itemId:    entry.itemId,
    category,
    rating:    entry.rating,
    status:    entry.status,
    title:     entry.title,
    cover:     entry.cover,
    year:      entry.year,
    genre:     entry.genre,
    catAccent: cat.accent,
    catIcon:   cat.icon,
  };
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ProfileShowcase() {
  // ─── Datos derivados ──────────────────────────────────────────────────────

  const categories = useCategories();
  const { entries } = useTracker();
  const all = Object.values(entries);

  const topRated = all
    .filter(e => e.rating !== null && e.status === 'completed')
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6)
    .map(e => enrichItem(e, categories))
    .filter(Boolean) as EnrichedItem[];

  const recentCompleted = all
    .filter(e => e.status === 'completed')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)
    .map(e => enrichItem(e, categories))
    .filter(Boolean) as EnrichedItem[];

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-8">
      {/* Cuadrícula de los mejor valorados */}
      {topRated.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <i className="ri-trophy-line text-amber-400 text-lg"></i>
            <h3 className="font-bold text-zinc-900 dark:text-white">Mejor valorados</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {topRated.map(item => (
              <Link key={item.itemId} to={`/catalog/${item.category}/${item.itemId}`} className="group cursor-pointer">
                <div className="relative rounded-xl overflow-hidden mb-2 aspect-[2/3]">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Badge de puntuación */}
                  <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm">
                    <i className="ri-star-fill text-amber-400 text-xs"></i>
                    <span className="text-white text-xs font-bold">{item.rating}</span>
                  </div>
                  {/* Badge de categoría */}
                  <div className="absolute top-1.5 left-1.5">
                    <div className="w-5 h-5 flex items-center justify-center rounded-md backdrop-blur-sm" style={{ background: `${item.catAccent}40` }}>
                      <i className={`${item.catIcon} text-xs`} style={{ color: item.catAccent }}></i>
                    </div>
                  </div>
                </div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-white line-clamp-2 leading-tight">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Listado de completados recientemente */}
      {recentCompleted.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <i className="ri-checkbox-circle-line text-emerald-500 text-lg"></i>
            <h3 className="font-bold text-zinc-900 dark:text-white">Completados recientemente</h3>
          </div>
          <div className="flex flex-col gap-3">
            {recentCompleted.map((item, idx) => (
              <Link
                key={item.itemId}
                to={`/catalog/${item.category}/${item.itemId}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all cursor-pointer"
              >
                <span className="text-sm font-black text-zinc-300 dark:text-zinc-700 w-5 text-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand-dark transition-colors line-clamp-1">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${item.catAccent}15`, color: item.catAccent }}>
                      <i className={`${item.catIcon} mr-1 text-xs`}></i>
                      {item.genre}
                    </span>
                    <span className="text-xs text-zinc-400">{item.year}</span>
                  </div>
                </div>
                {item.rating !== null && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <i className="ri-star-fill text-amber-400 text-sm"></i>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{item.rating}</span>
                    <span className="text-xs text-zinc-400">/10</span>
                  </div>
                )}
                <i className="ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600 flex-shrink-0"></i>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
