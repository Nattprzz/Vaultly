import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTracker } from '@/hooks/useTracker';
import { useItemReviews } from '@/hooks/useReviews';

interface Props {
  itemId: string;
  totalReviews: number;
  communityRating: number;
}

export default function ItemReviews({ itemId, totalReviews, communityRating }: Props) {
  const { isLoggedIn, profile } = useAuth();
  const { getEntry, addOrUpdate } = useTracker();
  const entry = getEntry(itemId);
  const { reviews, loading } = useItemReviews(itemId);

  const [showForm, setShowForm] = useState(false);
  const [reviewText, setReviewText] = useState(entry?.review ?? '');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formRating, setFormRating] = useState<number | null>(entry?.rating ?? null);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'top'>('recent');
  const [showAll, setShowAll] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !entry) return;
    setSaving(true);
    await addOrUpdate(itemId, entry.category, entry.status, formRating, reviewText);
    setSaving(false);
    setSubmitted(true);
    setShowForm(false);
  };

  const displayRating = hoverRating ?? formRating;

  // Merge real reviews with community count fallback
  const allReviews = reviews;
  const realCount = allReviews.length;
  const publicRatings = allReviews.filter(r => r.rating !== null);
  const displayCount = realCount > 0 ? realCount : totalReviews;
  const displayAvg = publicRatings.length > 0
    ? (publicRatings.reduce((s, r) => s + (r.rating ?? 0), 0) / publicRatings.length).toFixed(1)
    : communityRating;

  const sorted = sortBy === 'top'
    ? [...allReviews].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1))
    : allReviews;
  const visible = showAll ? sorted : sorted.slice(0, 3);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Reseñas públicas</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {displayCount.toLocaleString()} reseña{displayCount !== 1 ? 's' : ''} · Media{' '}
            <span className="font-semibold text-amber-500">{displayAvg}/10</span>
          </p>
        </div>
        {isLoggedIn && entry && !showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-quill-pen-line"></i>
            {entry.review ? 'Editar reseña' : 'Escribir reseña'}
          </button>
        )}
        {isLoggedIn && !entry && (
          <p className="text-xs text-zinc-400">Añade este ítem al tracker para escribir una reseña.</p>
        )}
      </div>

      {/* Write review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
          <p className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Tu reseña</p>
          <div className="mb-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Puntuación</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setFormRating(n)}
                  className="flex-1 flex items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  {displayRating !== null && n <= displayRating
                    ? <i className="ri-star-fill text-amber-400"></i>
                    : <i className="ri-star-line text-zinc-300 dark:text-zinc-600"></i>
                  }
                </button>
              ))}
            </div>
            {displayRating && <p className="text-center text-xs font-semibold text-amber-500 mt-1">{displayRating}/10</p>}
          </div>
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value.slice(0, 500))}
            placeholder="Añade tu opinión a tu historial..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 resize-none mb-2"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">{reviewText.length}/500</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer whitespace-nowrap">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!reviewText.trim() || saving}
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold disabled:opacity-40 cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                {saving && <i className="ri-loader-4-line animate-spin"></i>}
                Publicar
              </button>
            </div>
          </div>
        </form>
      )}

      {submitted && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 flex items-center gap-3">
          <i className="ri-checkbox-circle-fill text-emerald-500 text-xl"></i>
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Reseña guardada</p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">Tu opinión ya está guardada en tu tracker.</p>
          </div>
        </div>
      )}

      {/* Sort tabs */}
      <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 mb-5 w-fit">
        {(['recent', 'top'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              sortBy === s ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {s === 'recent' ? 'Más recientes' : 'Mejor valoradas'}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                <div className="flex flex-col gap-1.5">
                  <div className="h-3.5 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
          <i className="ri-quill-pen-line text-2xl text-zinc-300 dark:text-zinc-600"></i>
          <p className="text-sm text-zinc-400">Sé el primero en escribir una reseña.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map(review => {
            const colors = ['#8b5cf6', '#f43f5e', '#f59e0b', '#10b981', '#0ea5e9', '#ec4899'];
            const accent = colors[review.user_id.charCodeAt(0) % colors.length];
            return (
              <div key={review.id} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: accent }}>
                      {review.initials ?? '??'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{review.display_name ?? 'Usuario'}</p>
                      <p className="text-xs text-zinc-400">{new Date(review.updated_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  {review.rating !== null && (
                    <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg">
                      <i className="ri-star-fill text-amber-400 text-xs"></i>
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{review.rating}</span>
                      <span className="text-xs text-zinc-400">/10</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{review.review}</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
                    <i className="ri-thumb-up-line"></i>
                    Útil
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
                    <i className="ri-flag-line"></i>
                    Reportar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!showAll && sorted.length > 3 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Ver todas las reseñas ({sorted.length})
        </button>
      )}
    </div>
  );
}
