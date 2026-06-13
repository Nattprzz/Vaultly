import { useState, useEffect } from 'react';
import type { TrackerStatus, TrackerEntry, GameData } from '@/hooks/useTracker';
import {
  getCategoryStatuses,
  getStatusLabel,
  getStatusIcon,
  STATUS_CONFIG,
  getDefaultStatus,
} from '@/constants/tracker-statuses';
import type { CategoryStatus } from '@/constants/tracker-statuses';

interface Props {
  itemId:    string;
  category:  string;
  title:     string;
  cover:     string;
  existing:  TrackerEntry | null;
  onSave:    (status: TrackerStatus, rating: number | null, review: string, gameData?: GameData) => Promise<boolean>;
  onRemove:  () => Promise<boolean>;
  onClose:   () => void;
}

const INPUT_CLS =
  'w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand/30';

const STATUSES_WITH_START:  CategoryStatus[] = ['playing', 'played', 'completed', 'platinum', 'abandoned'];
const STATUSES_WITH_FINISH: CategoryStatus[] = ['completed', 'platinum', 'abandoned'];

export default function AddToTrackerModal({
  itemId: _itemId, category, title, cover, existing, onSave, onRemove, onClose,
}: Props) {
  const isGame = category === 'videojuegos';
  const validStatuses = getCategoryStatuses(category);
  const defaultStatus = (existing?.status as CategoryStatus | undefined) ?? getDefaultStatus(category);

  // ── Common fields ────────────────────────────────────────────────────────────
  const [status,      setStatus]      = useState<CategoryStatus>(defaultStatus);
  const [rating,      setRating]      = useState<number | null>(existing?.rating ?? null);
  const [review,      setReview]      = useState(existing?.review ?? '');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // ── Game-specific fields ─────────────────────────────────────────────────────
  const [platform,        setPlatform]        = useState(existing?.playingPlatform ?? '');
  const [hoursStr,        setHoursStr]        = useState(existing?.hoursPlayed != null ? String(existing.hoursPlayed) : '');
  const [startedAt,       setStartedAt]       = useState(existing?.startedAt ?? '');
  const [finishedAt,      setFinishedAt]      = useState(existing?.finishedAt ?? '');
  const [achievementsStr, setAchievementsStr] = useState(existing?.achievementsUnlocked != null ? String(existing.achievementsUnlocked) : '');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [saving,     setSaving]     = useState(false);
  const [removing,   setRemoving]   = useState(false);
  const [saveError,  setSaveError]  = useState<string | null>(null);

  const showStartedAt  = isGame && STATUSES_WITH_START.includes(status);
  const showFinishedAt = isGame && STATUSES_WITH_FINISH.includes(status);
  const finishedLabel  = status === 'abandoned' ? 'Fecha de abandono' : 'Fecha de finalización';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSave = async () => {
    // Validate game fields before hitting the API
    if (isGame) {
      const errors: string[] = [];
      const hoursNum = hoursStr === '' ? null : Number(hoursStr);
      const achNum   = achievementsStr === '' ? null : Number(achievementsStr);

      if (hoursNum !== null && (isNaN(hoursNum) || hoursNum < 0))
        errors.push('Las horas jugadas no pueden ser negativas.');
      if (achNum !== null && (isNaN(achNum) || achNum < 0))
        errors.push('Los logros obtenidos no pueden ser negativos.');
      if (showStartedAt && showFinishedAt && startedAt && finishedAt && finishedAt < startedAt)
        errors.push('La fecha de finalización no puede ser anterior a la de inicio.');

      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }
      setValidationErrors([]);
    }

    const gameData: GameData | undefined = isGame ? {
      playingPlatform:      platform.trim() || null,
      hoursPlayed:          hoursStr === '' ? null : Number(hoursStr),
      startedAt:            showStartedAt  ? (startedAt  || null) : null,
      finishedAt:           showFinishedAt ? (finishedAt || null) : null,
      achievementsUnlocked: achievementsStr === '' ? null : Number(achievementsStr),
    } : undefined;

    setSaving(true);
    setSaveError(null);
    const success = await onSave(status as TrackerStatus, rating, review, gameData);
    setSaving(false);
    if (success) {
      onClose();
    } else {
      setSaveError('No se pudo guardar. Inténtalo de nuevo.');
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    const success = await onRemove();
    setRemoving(false);
    if (success) onClose();
  };

  const displayRating = hoverRating ?? rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img src={cover} alt={title} className="w-full h-full object-cover object-top" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-400 mb-0.5">
              {existing ? 'Actualizar en tracker' : 'Añadir al tracker'}
            </p>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm leading-tight line-clamp-2">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex-shrink-0"
          >
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Estado</p>
            <div className="grid grid-cols-2 gap-2">
              {validStatuses.map(s => {
                const cfg      = STATUS_CONFIG[s];
                const label    = getStatusLabel(s, category);
                const icon     = getStatusIcon(s, category);
                const isActive = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer"
                    style={
                      isActive
                        ? { background: cfg.color, borderColor: cfg.color, color: '#fff' }
                        : { borderColor: 'rgb(228 228 231)', color: 'rgb(63 63 70)' }
                    }
                  >
                    <i className={icon} style={{ color: isActive ? '#fff' : cfg.color }} />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
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
                    ? <i className="ri-star-fill text-base text-amber-400" />
                    : <i className="ri-star-line text-base text-zinc-300 dark:text-zinc-600" />
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
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Reseña personal{' '}
              <span className="normal-case font-normal text-zinc-400">(opcional)</span>
            </p>
            <textarea
              value={review}
              onChange={e => setReview(e.target.value.slice(0, 500))}
              placeholder="¿Qué te pareció? Escribe tu opinión..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
            />
            <p className="text-right text-xs text-zinc-400 mt-1">{review.length}/500</p>
          </div>

          {/* ── Sección videojuegos ─────────────────────────────────────────── */}
          {isGame && (
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 flex flex-col gap-5">

              {/* Plataforma */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Plataforma
                </p>
                <input
                  type="text"
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  placeholder="ej. PC, PS5, Nintendo Switch…"
                  className={INPUT_CLS}
                />
              </div>

              {/* Horas jugadas + Logros */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Horas jugadas
                  </p>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={hoursStr}
                    onChange={e => setHoursStr(e.target.value)}
                    placeholder="0"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Logros
                  </p>
                  <input
                    type="number"
                    min="0"
                    value={achievementsStr}
                    onChange={e => setAchievementsStr(e.target.value)}
                    placeholder="0"
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              {/* Fecha de inicio */}
              {showStartedAt && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Fecha de inicio
                  </p>
                  <input
                    type="date"
                    value={startedAt}
                    onChange={e => setStartedAt(e.target.value)}
                    className={INPUT_CLS}
                  />
                </div>
              )}

              {/* Fecha de finalización / abandono */}
              {showFinishedAt && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    {finishedLabel}
                  </p>
                  <input
                    type="date"
                    value={finishedAt}
                    min={startedAt || undefined}
                    onChange={e => setFinishedAt(e.target.value)}
                    className={INPUT_CLS}
                  />
                </div>
              )}

              {/* Errores de validación del formulario */}
              {validationErrors.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                  {validationErrors.map((err, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-red-500">
                      <i className="ri-error-warning-line flex-shrink-0 mt-px" />
                      {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        {saveError && (
          <p className="px-5 pb-3 text-xs text-red-500 flex items-center gap-1.5">
            <i className="ri-error-warning-line" />
            {saveError}
          </p>
        )}
        <div className="flex items-center gap-3 px-5 pb-5 sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          {existing && (
            <button
              onClick={handleRemove}
              disabled={removing || saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {removing
                ? <i className="ri-loader-4-line animate-spin" />
                : <i className="ri-delete-bin-line" />
              }
              {removing ? 'Eliminando...' : 'Eliminar'}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || removing}
            className="flex-1 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving
              ? <><i className="ri-loader-4-line animate-spin" /> Guardando...</>
              : (existing ? 'Actualizar' : 'Añadir al tracker')
            }
          </button>
        </div>
      </div>
    </div>
  );
}
