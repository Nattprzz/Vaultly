/**
 * AdminReports.tsx — panel de gestión de reportes de ítems del catálogo.
 *
 * Lista todos los reportes de usuarios con filtros por estado, estadísticas
 * de resumen, notificación de reportes nuevos y un modal de confirmación
 * para marcar como resuelto o descartar con nota interna opcional.
 * Detecta qué reportes son nuevos desde la última visita mediante un Set
 * creado en el montaje del componente.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAdminReports, type AdminReport } from '@/hooks/useAdminReports';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import { type ReportStatus } from '@/types/admin';

// ─── Constantes ──────────────────────────────────────────────────────────────

/** Configuración visual por estado de reporte. */
const STATUS_CONFIG: Record<ReportStatus, { label: string; icon: string; bg: string; text: string; dot: string }> = {
  pending:   { label: 'Pendiente',  icon: 'ri-time-line',            bg: 'bg-amber-50 dark:bg-amber-950/30',     text: 'text-amber-600 dark:text-amber-400',    dot: 'bg-amber-400'  },
  resolved:  { label: 'Resuelto',   icon: 'ri-checkbox-circle-line', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-400' },
  dismissed: { label: 'Descartado', icon: 'ri-close-circle-line',    bg: 'bg-zinc-100 dark:bg-zinc-800',         text: 'text-zinc-500 dark:text-zinc-400',       dot: 'bg-zinc-400'   },
};

/** Icono por tipo de motivo de reporte. */
const REASON_ICONS: Record<string, string> = {
  'Información incorrecta':  'ri-information-line',
  'Imagen equivocada':       'ri-image-line',
  'Título o año erróneo':    'ri-calendar-line',
  'Contenido duplicado':     'ri-file-copy-line',
  'Descripción inapropiada': 'ri-alert-line',
  'Otro':                    'ri-question-line',
};

/** Etiquetas de categoría para mostrar en los reportes. */
const CATEGORY_LABELS: Record<string, string> = {
  videojuegos: 'Videojuegos',
  peliculas:   'Películas',
  series:      'Series',
  libros:      'Libros',
  conciertos:  'Conciertos',
};

/** Iconos Remix por categoría. */
const CATEGORY_ICONS: Record<string, string> = {
  videojuegos: 'ri-gamepad-line',
  peliculas:   'ri-film-line',
  series:      'ri-tv-2-line',
  libros:      'ri-book-line',
  conciertos:  'ri-music-2-line',
};

/** Orden de presentación de las categorías. */
const CATEGORY_ORDER = ['videojuegos', 'peliculas', 'series', 'libros', 'conciertos'];

// ─── Utilidades ──────────────────────────────────────────────────────────────

/**
 * Formatea una fecha ISO con día, mes, año y hora.
 * @param iso - Cadena de fecha en formato ISO 8601.
 * @returns   - Fecha formateada en es-ES.
 */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/** Props del modal de confirmación de acción sobre un reporte. */
interface ResolveModalProps {
  report:    AdminReport;
  action:    'resolved' | 'dismissed';
  onConfirm: (note: string) => void;
  onClose:   () => void;
}

/**
 * Modal de confirmación para resolver o descartar un reporte con nota interna.
 * @param report    - Reporte que se va a gestionar.
 * @param action    - Acción a realizar: `resolved` o `dismissed`.
 * @param onConfirm - Callback con la nota introducida.
 * @param onClose   - Callback para cerrar el modal sin guardar.
 */
function ResolveModal({ report, action, onConfirm, onClose }: ResolveModalProps) {
  const [note, setNote] = useState('');
  const isResolve = action === 'resolved';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isResolve ? 'bg-emerald-500/20' : 'bg-zinc-700'}`}>
              <i className={`${isResolve ? 'ri-checkbox-circle-line text-emerald-400' : 'ri-close-circle-line text-zinc-400'} text-sm`}></i>
            </div>
            <p className="text-sm font-bold text-white">
              {isResolve ? 'Marcar como resuelto' : 'Descartar reporte'}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
            <i className="ri-close-line text-zinc-400 text-sm"></i>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60">
            <img src={report.item_cover} alt={report.item_title} className="w-10 h-14 object-cover object-top rounded-lg flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{report.item_title}</p>
              <p className="text-xs text-zinc-400">{report.reason}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Nota interna <span className="font-normal normal-case">(opcional)</span>
            </label>
            <textarea
              value={note}
              onChange={e => { if (e.target.value.length <= 300) setNote(e.target.value); }}
              placeholder={isResolve ? 'Describe qué cambio se realizó...' : 'Motivo por el que se descarta...'}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-sm text-zinc-200 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
            <p className="text-xs text-zinc-500 text-right">{note.length}/300</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(note)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${
                isResolve
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
              }`}
            >
              <i className={isResolve ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'}></i>
              {isResolve ? 'Marcar resuelto' : 'Descartar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Props de la fila de reporte expandible. */
interface ReportRowProps {
  report:   AdminReport;
  isNew:    boolean;
  onAction: (id: string, action: 'resolved' | 'dismissed') => void;
}

/**
 * Fila de reporte con panel expandible de detalle y acciones.
 * Aplica highlight de 4 segundos si el reporte es nuevo desde la última visita.
 * @param report   - Datos del reporte a mostrar.
 * @param isNew    - Si el reporte no existía en el último montaje del componente.
 * @param onAction - Callback para abrir el modal de gestión.
 */
function ReportRow({ report, isNew, onAction }: ReportRowProps) {
  const [expanded,  setExpanded]  = useState(false);
  const [highlight, setHighlight] = useState(isNew);
  const cfg = STATUS_CONFIG[report.status];

  useEffect(() => {
    if (isNew) {
      const t = setTimeout(() => setHighlight(false), 4000);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-700 ${
      highlight
        ? 'bg-red-950/30 border-red-800/60'
        : 'bg-zinc-900 border-zinc-800'
    }`}>
      {highlight && (
        <div className="flex items-center gap-1.5 px-5 pt-3 pb-0">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-red-400">Nuevo reporte</span>
        </div>
      )}

      {/* Fila principal */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <img
          src={report.item_cover}
          alt={report.item_title}
          className="w-9 h-12 object-cover object-top rounded-lg flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white truncate">{report.item_title}</p>
            <span className="text-xs text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-800 whitespace-nowrap">
              {CATEGORY_LABELS[report.item_category] ?? report.item_category}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <i className={`${REASON_ICONS[report.reason] ?? 'ri-flag-line'} text-zinc-500`}></i>
              {report.reason}
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-500">{formatDate(report.reported_at)}</span>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
          {cfg.label}
        </div>

        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <i className={`ri-arrow-down-s-line text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}></i>
        </div>
      </div>

      {/* Detalle expandido */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-zinc-800 pt-4 flex flex-col gap-4">
          {report.details && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Descripción del problema</p>
              <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-800/50 rounded-xl px-4 py-3">
                {report.details}
              </p>
            </div>
          )}

          {report.resolved_note && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nota de resolución</p>
              <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-800/30 rounded-xl px-4 py-3 border border-zinc-700/50">
                <i className="ri-admin-line mr-1.5 text-zinc-500"></i>
                {report.resolved_note}
              </p>
              {report.resolved_at && (
                <p className="text-xs text-zinc-600">{formatDate(report.resolved_at)}</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/catalog/${report.item_category}/${report.item_slug ?? report.item_id}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-700 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-external-link-line"></i>
              Ver ítem
            </Link>

            {report.status === 'pending' && (
              <>
                <button
                  onClick={() => onAction(report.id, 'resolved')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-checkbox-circle-line"></i>
                  Marcar resuelto
                </button>
                <button
                  onClick={() => onAction(report.id, 'dismissed')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-close-circle-line"></i>
                  Descartar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AdminReports() {
  const { reports, pendingCount, newCount, loading, error, markAllSeen, resolveReport, refresh } = useAdminReports();

  // ─── Estado ───────────────────────────────────────────────────────────────

  const [filter,       setFilter]       = useState<ReportStatus | 'all'>('all');
  const [catFilter,    setCatFilter]    = useState<string>('all');
  const [resolveModal, setResolveModal] = useState<{ id: string; action: 'resolved' | 'dismissed' } | null>(null);

  /** IDs de reportes presentes al montar el componente — los que lleguen después son "nuevos". */
  const [seenOnMount] = useState(() => new Set(reports.map(r => r.id)));

  // ─── Efectos ──────────────────────────────────────────────────────────────

  useEffect(() => {
    markAllSeen();
  }, [markAllSeen]);

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const resolved  = reports.filter(r => r.status === 'resolved').length;
  const dismissed = reports.filter(r => r.status === 'dismissed').length;

  const catFiltered = catFilter === 'all' ? reports : reports.filter(r => r.item_category === catFilter);
  const filtered    = filter    === 'all' ? catFiltered : catFiltered.filter(r => r.status === filter);

  const reportsByCategory = CATEGORY_ORDER.map(cat => ({
    cat,
    total:   reports.filter(r => r.item_category === cat).length,
    pending: reports.filter(r => r.item_category === cat && r.status === 'pending').length,
  })).filter(s => s.total > 0);

  const catPending = catFilter === 'all' ? pendingCount : reports.filter(r => r.item_category === catFilter && r.status === 'pending').length;
  const catTotal   = catFilter === 'all' ? reports.length : catFiltered.length;

  const FILTERS: { value: ReportStatus | 'all'; label: string; count: number }[] = [
    { value: 'all',       label: 'Todos',       count: catTotal   },
    { value: 'pending',   label: 'Pendientes',  count: catPending },
    { value: 'resolved',  label: 'Resueltos',   count: catFiltered.filter(r => r.status === 'resolved').length  },
    { value: 'dismissed', label: 'Descartados', count: catFiltered.filter(r => r.status === 'dismissed').length },
  ];

  // ─── Handlers ─────────────────────────────────────────────────────────────

  /** Abre el modal de confirmación para un reporte y una acción concreta. */
  const handleAction = (id: string, action: 'resolved' | 'dismissed') => {
    setResolveModal({ id, action });
  };

  /** Ejecuta la acción confirmada con la nota opcional. */
  const handleConfirm = async (note: string) => {
    if (!resolveModal) return;
    await resolveReport(resolveModal.id, resolveModal.action, note || undefined);
    setResolveModal(null);
  };

  // ─── Renderizado ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-800">
          <i className="ri-loader-4-line text-zinc-400 text-2xl animate-spin"></i>
        </div>
        <p className="text-sm text-zinc-500">Cargando reportes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-950/30">
          <i className="ri-error-warning-line text-red-400 text-2xl"></i>
        </div>
        <p className="text-sm font-semibold text-zinc-300">Error al cargar reportes</p>
        <p className="text-xs text-zinc-500">{error}</p>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-refresh-line"></i>
          Reintentar
        </button>
      </div>
    );
  }

  const activeReport = resolveModal ? reports.find(r => r.id === resolveModal.id) : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Banner de reportes nuevos */}
      {newCount > 0 && (
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl bg-red-950/40 border border-red-800/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping flex-shrink-0"></span>
            <p className="text-sm font-semibold text-red-300">
              {newCount} reporte{newCount > 1 ? 's' : ''} nuevo{newCount > 1 ? 's' : ''} desde tu última visita
            </p>
          </div>
          <button
            onClick={markAllSeen}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            Marcar todos vistos
          </button>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total reportes', value: reports.length, icon: 'ri-flag-2-line',         color: 'text-zinc-400',    bg: 'bg-zinc-800'         },
          { label: 'Pendientes',     value: pendingCount,   icon: 'ri-time-line',            color: 'text-amber-400',   bg: 'bg-amber-500/10'     },
          { label: 'Resueltos',      value: resolved,       icon: 'ri-checkbox-circle-line', color: 'text-emerald-400', bg: 'bg-emerald-500/10'   },
          { label: 'Descartados',    value: dismissed,      icon: 'ri-close-circle-line',    color: 'text-zinc-500',    bg: 'bg-zinc-800'         },
        ].map(stat => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${stat.bg} flex-shrink-0`}>
              <i className={`${stat.icon} ${stat.color} text-lg`}></i>
            </div>
            <div>
              <p className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desglose por categoría */}
      {reportsByCategory.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Reportes por categoría</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {CATEGORY_ORDER.map(cat => {
              const stat = reportsByCategory.find(s => s.cat === cat);
              return (
                <button
                  key={cat}
                  onClick={() => { setCatFilter(c => c === cat ? 'all' : cat); setFilter('all'); }}
                  className={`flex flex-col gap-1.5 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    catFilter === cat
                      ? 'bg-brand/15 border-brand/40 dark:bg-brand-dark/15 dark:border-brand-dark/40'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <i className={`${CATEGORY_ICONS[cat] ?? 'ri-apps-line'} ${catFilter === cat ? 'text-brand dark:text-brand-dark' : 'text-zinc-500'} text-base`}></i>
                    {stat && stat.pending > 0 && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">{stat.pending}</span>
                    )}
                  </div>
                  <p className={`text-xl font-black ${catFilter === cat ? 'text-white' : 'text-zinc-300'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {stat?.total ?? 0}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{CATEGORY_LABELS[cat] ?? cat}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filtro de categoría activo */}
      {catFilter !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Filtrando por:</span>
          <button
            onClick={() => setCatFilter('all')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/15 dark:bg-brand-dark/15 text-brand dark:text-brand-dark text-xs font-semibold cursor-pointer hover:bg-brand/25 dark:hover:bg-brand-dark/25 transition-colors whitespace-nowrap"
          >
            <i className={`${CATEGORY_ICONS[catFilter] ?? 'ri-apps-line'} text-xs`}></i>
            {CATEGORY_LABELS[catFilter] ?? catFilter}
            <i className="ri-close-line text-xs"></i>
          </button>
        </div>
      )}

      {/* Pestañas de filtro */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filter === f.value
                ? 'bg-white text-zinc-900'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {f.label}
            {f.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                filter === f.value
                  ? 'bg-zinc-200 text-zinc-700'
                  : f.value === 'pending' && f.count > 0
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-zinc-800 text-zinc-500'
              }`}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de reportes */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-800 mb-4">
              <i className="ri-flag-2-line text-zinc-500 text-2xl"></i>
            </div>
            <p className="text-sm font-semibold text-zinc-400">No hay reportes en esta categoría</p>
            <p className="text-xs text-zinc-600 mt-1">Cuando los usuarios reporten problemas aparecerán aquí</p>
          </div>
        ) : (
          filtered.map(report => (
            <ReportRow
              key={report.id}
              report={report}
              isNew={!seenOnMount.has(report.id)}
              onAction={handleAction}
            />
          ))
        )}
      </div>

      {/* Modal de resolución */}
      {resolveModal && activeReport && (
        <ResolveModal
          report={activeReport}
          action={resolveModal.action}
          onConfirm={handleConfirm}
          onClose={() => setResolveModal(null)}
        />
      )}
    </div>
  );
}
