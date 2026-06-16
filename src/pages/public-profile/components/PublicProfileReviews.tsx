/**
 * PublicProfileReviews.tsx — reseñas públicas de otro usuario.
 *
 * Obtiene las reseñas del usuario indicado respetando sus flags de privacidad.
 * Muestra un estado diferente para: cargando, privado, vacío y con datos.
 * Cada reseña incluye portada del ítem (o icono de categoría), puntuación
 * y texto en blockquote con el nombre del autor y la fecha.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { usePublicReviews }            from '@/hooks/useReviews';
import { fmtDate as formatDate }       from '@/lib/formatting';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { PublicPrivacyFlags } from '@/types/privacy';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del listado de reseñas públicas. */
interface Props {
  userId:      string | null;
  displayName: string;
  initials:    string;
  privacy:     PublicPrivacyFlags;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function PublicProfileReviews({ userId, displayName, initials, privacy }: Props) {
  // ─── Datos derivados ──────────────────────────────────────────────────────

  const { reviews, loading, hidden } = usePublicReviews(userId, privacy);

  // ─── Renderizado ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse flex-shrink-0"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 w-40 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (hidden) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
          <i className="ri-lock-line text-2xl text-zinc-400"></i>
        </div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Reseñas privadas</h3>
        <p className="text-sm text-zinc-500 max-w-xs">Este usuario ha ocultado sus reseñas públicas.</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
          <i className="ri-quill-pen-line text-2xl text-zinc-400"></i>
        </div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Sin reseñas todavía</h3>
        <p className="text-sm text-zinc-500 max-w-xs">Este usuario no ha escrito reseñas aún.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map(entry => {
        const title = entry.title || entry.item_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return (
          <div key={entry.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5">
            {/* Cabecera con portada, título, categoría y puntuación */}
            <div className="flex items-center gap-3 mb-4">
              <Link to={`/catalog/${entry.category}/${entry.item_slug}`} className="flex-shrink-0 cursor-pointer">
                {entry.cover ? (
                  <img src={entry.cover} alt={title} className="w-12 h-16 rounded-lg object-cover object-top" />
                ) : (
                  <div
                    className="w-12 h-16 rounded-lg flex items-center justify-center"
                    style={{ background: `${entry.categoryAccent}15` }}
                  >
                    <i className={`${entry.categoryIcon} text-2xl`} style={{ color: entry.categoryAccent }}></i>
                  </div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/catalog/${entry.category}/${entry.item_slug}`} className="cursor-pointer">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white hover:text-brand dark:hover:text-brand-dark transition-colors line-clamp-1">
                    {title}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${entry.categoryAccent}15`, color: entry.categoryAccent }}
                  >
                    <i className={`${entry.categoryIcon} mr-1 text-xs`}></i>
                    {entry.categoryLabel}
                  </span>
                </div>
              </div>
              {entry.rating !== null && (
                <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <i className="ri-star-fill text-amber-400 text-base"></i>
                    <span className="text-lg font-black text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {entry.rating}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">/10</span>
                </div>
              )}
            </div>

            {/* Texto de la reseña en formato blockquote */}
            <blockquote className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
              &ldquo;{entry.review}&rdquo;
            </blockquote>

            {/* Pie con avatar y fecha */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand dark:bg-brand-dark flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-xs text-zinc-500">{displayName}</span>
              </div>
              <span className="text-xs text-zinc-400">{formatDate(entry.updated_at)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
