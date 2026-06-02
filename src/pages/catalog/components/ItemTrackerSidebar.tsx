import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ItemDetail } from '@/mocks/itemDetail';
import { useAuth } from '@/hooks/useAuth';
import { useTracker, type TrackerStatus } from '@/hooks/useTracker';
import { useItemReportCount } from '@/hooks/useItemReportCount';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import AddToTrackerModal from './AddToTrackerModal';
import ItemReportHistory from './ItemReportHistory';

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
  itemTitle: string;
  itemId: string;
  itemCategory: string;
  itemCover: string;
  onClose: () => void;
}

function ReportModal({ itemTitle, itemId, itemCategory, itemCover, onClose }: ReportModalProps) {
  const { session } = useAuth();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
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
          item_id: itemId,
          item_title: itemTitle,
          item_category: itemCategory,
          item_cover: itemCover,
          reason,
          details: details || null,
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
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/30">
              <i className="ri-flag-2-line text-rose-500 text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Reportar problema</p>
              <p className="text-xs text-zinc-400 truncate max-w-[220px]">{itemTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            <i className="ri-close-line text-zinc-500 text-sm"></i>
          </button>
        </div>

        {status === 'sent' ? (
          <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
              <i className="ri-checkbox-circle-line text-emerald-500 text-2xl"></i>
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">¡Reporte enviado!</p>
            <p className="text-xs text-zinc-400">Gracias por ayudarnos a mejorar el catálogo. Lo revisaremos pronto.</p>
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
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Detalles adicionales <span className="font-normal normal-case">(opcional)</span></label>
              <textarea
                name="details"
                value={details}
                onChange={e => { if (e.target.value.length <= 500) setDetails(e.target.value); }}
                placeholder="Describe el problema con más detalle..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600"
              />
              <p className="text-xs text-zinc-400 text-right">{details.length}/500</p>
            </div>

            {status === 'error' && (
              <p className="text-xs text-rose-500 flex items-center gap-1.5">
                <i className="ri-error-warning-line"></i>
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
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <><i className="ri-loader-4-line animate-spin"></i> Enviando...</>
                ) : (
                  <><i className="ri-flag-2-line"></i> Enviar reporte</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const STATUS_OPTIONS: { value: TrackerStatus; label: string; icon: string; color: string; bg: string }[] = [
  { value: 'pending',     label: 'Pendiente',   icon: 'ri-bookmark-line',        color: 'text-zinc-600 dark:text-zinc-400',   bg: 'bg-zinc-100 dark:bg-zinc-800' },
  { value: 'in_progress', label: 'En progreso', icon: 'ri-loader-4-line',        color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { value: 'completed',   label: 'Completado',  icon: 'ri-checkbox-circle-line', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  { value: 'dropped',     label: 'Abandonado',  icon: 'ri-close-circle-line',    color: 'text-rose-600 dark:text-rose-400',   bg: 'bg-rose-50 dark:bg-rose-950/30' },
];

interface Props {
  item: ItemDetail;
}

export default function ItemTrackerSidebar({ item }: Props) {
  const { isLoggedIn, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const { getEntry, addOrUpdate, remove } = useTracker();
  const { pending: reportsPending, total: reportsTotal, loading: reportsLoading } = useItemReportCount(isAdmin ? item.id : '');
  const [modalOpen, setModalOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const entry = getEntry(item.id);
  const statusOpt = STATUS_OPTIONS.find(s => s.value === entry?.status);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = (status: TrackerStatus, rating: number | null, review: string) => {
    addOrUpdate(item.id, item.category, status, rating, review);
    showToast(entry ? 'Tracker actualizado' : '¡Añadido al tracker!');
  };

  const handleRemove = () => {
    remove(item.id);
    showToast('Eliminado del tracker');
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        {/* Cover */}
        <div className="w-full aspect-[2/3] overflow-hidden">
          <img src={item.cover} alt={item.title} className="w-full h-full object-cover object-top" />
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <i className="ri-star-fill text-amber-400"></i>
              <span className="text-xl font-black text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {item.rating}
              </span>
              <span className="text-sm text-zinc-400">/10</span>
            </div>
            <span className="text-xs text-zinc-400">{(item.total_ratings / 1000).toFixed(1)}k votos</span>
          </div>

          {/* Tracker CTA */}
          {isLoggedIn ? (
            <div className="flex flex-col gap-2">
              {entry ? (
                <>
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${statusOpt?.bg} ${statusOpt?.color}`}>
                    <i className={statusOpt?.icon}></i>
                    {statusOpt?.label}
                    {entry.rating && (
                      <span className="ml-auto flex items-center gap-1 text-amber-500">
                        <i className="ri-star-fill text-xs"></i>
                        {entry.rating}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-edit-line"></i>
                    Editar entrada
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line"></i>
                  Añadir al tracker
                </button>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              <i className="ri-login-box-line"></i>
              Inicia sesión para trackear
            </Link>
          )}

          {/* Quick status buttons (logged in, not tracked) */}
          {isLoggedIn && !entry && (
            <div className="grid grid-cols-2 gap-1.5">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { addOrUpdate(item.id, item.category, opt.value, null, ''); showToast('¡Añadido al tracker!'); }}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${opt.bg} ${opt.color} hover:opacity-80`}
                >
                  <i className={opt.icon}></i>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Personal review snippet */}
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
                    ? 'bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50'
                    : 'bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 ${
                  reportsPending > 0
                    ? 'bg-rose-100 dark:bg-rose-900/40'
                    : 'bg-zinc-100 dark:bg-zinc-700'
                }`}>
                  <i className={`ri-shield-check-line text-sm ${
                    reportsPending > 0 ? 'text-rose-500' : 'text-zinc-400'
                  }`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${
                    reportsPending > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500 dark:text-zinc-400'
                  }`}>
                    {reportsPending > 0 ? `${reportsPending} reporte${reportsPending > 1 ? 's' : ''} pendiente${reportsPending > 1 ? 's' : ''}` : 'Sin reportes pendientes'}
                  </p>
                  {reportsTotal > 0 && (
                    <p className="text-xs text-zinc-400">{reportsTotal} en total · Ver en admin</p>
                  )}
                  {reportsTotal === 0 && (
                    <p className="text-xs text-zinc-400">Panel de admin</p>
                  )}
                </div>
                {reportsPending > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-rose-500 text-white text-xs font-bold">
                    {reportsPending > 9 ? '9+' : reportsPending}
                  </span>
                )}
                <i className="ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 transition-colors flex-shrink-0"></i>
              </Link>
            </div>
          )}

          {/* Admin: resolved report history */}
          {isAdmin && (
            <ItemReportHistory itemId={item.id} />
          )}

          {/* Report button */}
          <div className={isAdmin ? '' : 'pt-3 border-t border-zinc-100 dark:border-zinc-800'}>
            <button
              onClick={() => setReportOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-flag-2-line"></i>
              Reportar un problema con este ítem
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
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

      {/* Report Modal */}
      {reportOpen && (
        <ReportModal
          itemTitle={item.title}
          itemId={item.id}
          itemCategory={item.category}
          itemCover={item.cover}
          onClose={() => setReportOpen(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium flex items-center gap-2">
          <i className="ri-checkbox-circle-line text-emerald-400 dark:text-emerald-600"></i>
          {toast}
        </div>
      )}
    </>
  );
}
