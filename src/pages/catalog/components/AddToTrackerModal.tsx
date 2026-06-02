import { useState, useEffect } from 'react';
import { TrackerStatus, TrackerEntry } from '@/hooks/useTracker';

interface Props {
  itemId: string;
  category: string;
  title: string;
  cover: string;
  existing: TrackerEntry | null;
  onSave: (status: TrackerStatus, rating: number | null, review: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: TrackerStatus; label: string; icon: string; color: string }[] = [
  { value: 'pending',     label: 'Pendiente',    icon: 'ri-bookmark-line',       color: 'text-zinc-500' },
  { value: 'in_progress', label: 'En progreso',  icon: 'ri-loader-4-line',       color: 'text-amber-500' },
  { value: 'completed',   label: 'Completado',   icon: 'ri-checkbox-circle-line', color: 'text-emerald-500' },
  { value: 'dropped',     label: 'Abandonado',   icon: 'ri-close-circle-line',   color: 'text-rose-500' },
];

export default function AddToTrackerModal({ itemId, category, title, cover, existing, onSave, onRemove, onClose }: Props) {
  const [status, setStatus] = useState<TrackerStatus>(existing?.status ?? 'pending');
  const [rating, setRating] = useState<number | null>(existing?.rating ?? null);
  const [review, setReview] = useState(existing?.review ?? '');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSave = () => {
    onSave(status, rating, review);
    onClose();
  };

  const displayRating = hoverRating ?? rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img src={cover} alt={title} className="w-full h-full object-cover object-top" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-400 mb-0.5">{existing ? 'Actualizar en tracker' : 'Añadir al tracker'}</p>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm leading-tight line-clamp-2">{title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex-shrink-0">
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Estado</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    status === opt.value
                      ? 'border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500'
                  }`}
                >
                  <i className={`${opt.icon} ${status === opt.value ? '' : opt.color}`}></i>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Puntuación</p>
              {rating !== null && (
                <button onClick={() => setRating(null)} className="text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer">
                  Quitar
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(n)}
                  className="flex-1 flex items-center justify-center py-2 rounded-lg transition-colors cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  {displayRating !== null && n <= displayRating
                    ? <i className="ri-star-fill text-base text-amber-400"></i>
                    : <i className="ri-star-line text-base text-zinc-300 dark:text-zinc-600"></i>
                  }
                </button>
              ))}
            </div>
            {displayRating !== null && (
              <p className="text-center text-sm font-semibold text-amber-500 mt-1">{displayRating}/10</p>
            )}
          </div>

          {/* Review */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Reseña personal <span className="normal-case font-normal text-zinc-400">(opcional)</span></p>
            <textarea
              value={review}
              onChange={e => setReview(e.target.value.slice(0, 500))}
              placeholder="¿Qué te pareció? Escribe tu opinión..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
            />
            <p className="text-right text-xs text-zinc-400 mt-1">{review.length}/500</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 pb-5">
          {existing && (
            <button
              onClick={() => { onRemove(); onClose(); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-500 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-delete-bin-line"></i>
              Eliminar
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
          >
            {existing ? 'Actualizar' : 'Añadir al tracker'}
          </button>
        </div>
      </div>
    </div>
  );
}
