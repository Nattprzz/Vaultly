import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ItemDetail } from '@/types/itemDetail';
import { useAuth } from '@/hooks/useAuth';
import { useTracker } from '@/hooks/useTracker';
import type { TrackerStatus, GameData } from '@/hooks/useTracker';
import { useItemReportCount } from '@/hooks/useItemReportCount';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import AddToTrackerModal from './AddToTrackerModal';
import ItemReportHistory from './ItemReportHistory';
import {
  getCategoryStatuses,
  getStatusLabel,
  getStatusIcon,
  STATUS_CONFIG,
  getDefaultStatus,
} from '@/constants/tracker-statuses';
import type { CategoryStatus } from '@/constants/tracker-statuses';

const ITEM_REPORTS_URL = edgeFunctionUrl('item-reports');

const REPORT_REASONS = [
  'Información incorrecta',
  'Imagen equivocada',
  'Título o año erróneo',
  'Contenido duplicado',
  'Descripción inapropiada',
  'Otro',
];

interface ReportModalProps {
  itemTitle:    string;
  itemId:       string;
  itemCategory: string;
  itemCover:    string;
  onClose:      () => void;
}

function ReportModal({ itemTitle, itemId, itemCategory, itemCover, onClose }: ReportModalProps) {
  const { session } = useAuth();
  const [reason,  setReason]  = useState('');
  const [details, setDetails] = useState('');
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reason) return;
    setStatus('sending');
    try {
      const res = await fetch(ITEM_REPORTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          item_id: itemId, item_title: itemTitle, item_category: itemCategory,
          item_cover: itemCover, reason, details: details || null,
        }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30">
              <i className="ri-flag-2-line text-red-500 text-sm" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Reportar problema</p>
              <p className="text-xs text-zinc-400 truncate max-w-[220px]">{itemTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            <i className="ri-close-line text-zinc-500 text-sm" />
          </button>
        </div>

        {status === 'sent' ? (
          <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
              <i className="ri-checkbox-circle-line text-emerald-500 text-2xl" />
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">¡Reporte enviado!</p>
            <p className="text-xs text-zinc-400">Gracias por ayudarnos a mejorar el catálogo.</p>
            <button onClick={onClose} className="mt-2 px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium cursor-pointer whitespace-nowrap">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Motivo del reporte</label>
              <div className="grid grid-cols-2 gap-1.5">
                {REPORT_REASONS.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer whitespace-nowrap ${
                      reason === r
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Detalles <span className="font-normal normal-case">(opcional)</span>
              </label>
              <textarea
                value={details}
                onChange={e => { if (e.target.value.length <= 500) setDetails(e.target.value); }}
                placeholder="Describe el problema con más detalle..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600"
              />
              <p className="text-xs text-zinc-400 text-right">{details.length}/500</p>
            </div>
            {status === 'error' && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <i className="ri-error-warning-line" />
                Error al enviar. Inténtalo de nuevo.
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!reason || status === 'sending'}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                {status === 'sending'
                  ? <><i className="ri-loader-4-line animate-spin" /> Enviando...</>
                  : <><i className="ri-flag-2-line" /> Enviar reporte</>
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function fmtTrackerDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

interface Props {
  item: ItemDetail;
}

export default function ItemTrackerSidebar({ item }: Props) {
  const { isLoggedIn, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const { getEntry, addOrUpdate, remove, error: trackerError } = useTracker();
  const { pending: reportsPending, total: reportsTotal, loading: reportsLoading } = useItemReportCount(isAdmin ? item.id : '');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toast,      setToast]      = useState<string | null>(null);

  const validStatuses = getCategoryStatuses(item.category);
  const entry = getEntry(item.id);

  // Current status display
  const currentStatus = entry?.status as CategoryStatus | undefined;
  const currentCfg    = currentStatus ? STATUS_CONFIG[currentStatus] : null;
  const currentLabel  = currentStatus ? getStatusLabel(currentStatus, item.category) : null;
  const currentIcon   = currentStatus ? getStatusIcon(currentStatus, item.category) : null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (trackerError) showToast(trackerError);
  }, [trackerError]);

  const handleSave = async (status: TrackerStatus, rating: number | null, review: string, gameData?: GameData): Promise<boolean> => {
    const success = await addOrUpdate(item.id, item.category, status, rating, review, gameData);
    showToast(
      success
        ? (entry ? 'Tracker actualizado' : '¡Añadido al tracker!')
        : 'No se pudo guardar. Inténtalo de nuevo.',
    );
    return success;
  };

  const handleRemove = async (): Promise<boolean> => {
    const success = await remove(item.id);
    showToast(success ? 'Eliminado del tracker' : 'No se pudo eliminar. Inténtalo de nuevo.');
    return success;
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mi tracker</h3>
        </div>

        <div className="p-5 flex flex-col gap-4">

          {/* Tracker CTA */}
          {isLoggedIn ? (
            <div className="flex flex-col gap-2">
              {entry && currentCfg ? (
                <>
                  {/* Current status badge */}
                  <div
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: currentCfg.bg, color: currentCfg.color }}
                  >
                    <i className={currentIcon ?? ''} />
                    {currentLabel}
                    {entry.rating && (
                      <span className="ml-auto flex items-center gap-1 text-amber-500">
                        <i className="ri-star-fill text-xs" />
                        {entry.rating}
                      </span>
                    )}
                  </div>

                  {/* Entry dates */}
                  <div className="flex flex-col gap-1.5 px-1 py-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                        <i className="ri-calendar-add-line text-zinc-600" />
                        Añadido
                      </span>
                      <span className="text-xs font-medium text-zinc-400">{fmtTrackerDate(entry.addedAt)}</span>
                    </div>
                    {entry.updatedAt !== entry.addedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                          <i className="ri-refresh-line text-zinc-600" />
                          Actualizado
                        </span>
                        <span className="text-xs font-medium text-zinc-400">{fmtTrackerDate(entry.updatedAt)}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-edit-line" />
                    Editar entrada
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line" />
                  Añadir al tracker
                </button>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-login-box-line" />
              Inicia sesión para trackear
            </Link>
          )}

          {/* Quick status buttons (logged in, not tracked) */}
          {isLoggedIn && !entry && (
            <div className="grid grid-cols-2 gap-1.5">
              {validStatuses.map(s => {
                const cfg   = STATUS_CONFIG[s];
                const label = getStatusLabel(s, item.category);
                const icon  = getStatusIcon(s, item.category);
                return (
                  <button
                    key={s}
                    onClick={async () => {
                      const success = await addOrUpdate(item.id, item.category, s as TrackerStatus, null, '');
                      showToast(success ? '¡Añadido al tracker!' : 'No se pudo guardar. Inténtalo de nuevo.');
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer hover:opacity-80"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    <i className={icon} />
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Review snippet */}
          {entry?.review && (
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Tu reseña</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 italic">
                &ldquo;{entry.review}&rdquo;
              </p>
            </div>
          )}

          {/* Admin report indicator */}
          {isAdmin && !reportsLoading && (
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                to="/admin/reports"
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer group ${
                  reportsPending > 0
                    ? 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50'
                    : 'bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 ${
                  reportsPending > 0 ? 'bg-red-100 dark:bg-red-900/40' : 'bg-zinc-100 dark:bg-zinc-700'
                }`}>
                  <i className={`ri-shield-check-line text-sm ${reportsPending > 0 ? 'text-red-500' : 'text-zinc-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${reportsPending > 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {reportsPending > 0 ? `${reportsPending} reporte${reportsPending > 1 ? 's' : ''} pendiente${reportsPending > 1 ? 's' : ''}` : 'Sin reportes pendientes'}
                  </p>
                  {reportsTotal > 0
                    ? <p className="text-xs text-zinc-400">{reportsTotal} en total · Ver en admin</p>
                    : <p className="text-xs text-zinc-400">Panel de admin</p>
                  }
                </div>
                {reportsPending > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                    {reportsPending > 9 ? '9+' : reportsPending}
                  </span>
                )}
                <i className="ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 transition-colors flex-shrink-0" />
              </Link>
            </div>
          )}
          {isAdmin && <ItemReportHistory itemId={item.id} />}

          {/* Report button */}
          <div className={isAdmin ? '' : 'pt-3 border-t border-zinc-100 dark:border-zinc-800'}>
            <button
              onClick={() => setReportOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-flag-2-line" />
              Reportar un problema con este ítem
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <AddToTrackerModal
          itemId={item.id}
          category={item.category}
          title={item.title}
          cover={item.cover}
          existing={entry}
          onSave={handleSave}
          onRemove={handleRemove}
          onClose={() => setModalOpen(false)}
        />
      )}

      {reportOpen && (
        <ReportModal
          itemTitle={item.title}
          itemId={item.id}
          itemCategory={item.category}
          itemCover={item.cover}
          onClose={() => setReportOpen(false)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm font-medium flex items-center gap-2 shadow-xl">
          <i className="ri-checkbox-circle-line text-emerald-400" />
          {toast}
        </div>
      )}
    </>
  );
}
