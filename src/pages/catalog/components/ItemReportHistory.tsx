import { useState } from 'react';
import { useItemReportHistory, type ResolvedReport } from '@/hooks/useItemReportHistory';

interface Props {
  itemId: string;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function ReportHistoryRow({ report }: { report: ResolvedReport }) {
  const [expanded, setExpanded] = useState(false);
  const isResolved = report.status === 'resolved';

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-2.5 text-left cursor-pointer group"
      >
        <div className={`mt-0.5 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full ${
          isResolved
            ? 'bg-emerald-100 dark:bg-emerald-950/40'
            : 'bg-zinc-100 dark:bg-zinc-800'
        }`}>
          <i className={`text-xs ${
            isResolved
              ? 'ri-checkbox-circle-line text-emerald-500'
              : 'ri-close-circle-line text-zinc-400'
          }`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-snug truncate">
            {report.reason}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">
            <span className={`font-medium ${isResolved ? 'text-emerald-500' : 'text-zinc-400'}`}>
              {isResolved ? 'Resuelto' : 'Descartado'}
            </span>
            {' · '}
            {formatDate(report.resolved_at ?? report.reported_at)}
          </p>
        </div>
        <i className={`ri-arrow-down-s-line text-zinc-300 dark:text-zinc-600 flex-shrink-0 mt-0.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}></i>
      </button>

      {expanded && (
        <div className="ml-7 flex flex-col gap-1.5 pb-1">
          {report.details && (
            <div className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                <span className="font-semibold text-zinc-600 dark:text-zinc-300">Descripción: </span>
                {report.details}
              </p>
            </div>
          )}
          {report.resolved_note && (
            <div className={`px-3 py-2 rounded-lg border ${
              isResolved
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30'
                : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-100 dark:border-zinc-700/50'
            }`}>
              <p className="text-xs leading-relaxed">
                <span className={`font-semibold ${isResolved ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  Nota del admin:{' '}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">{report.resolved_note}</span>
              </p>
            </div>
          )}
          <p className="text-xs text-zinc-400">
            Reportado el {formatDate(report.reported_at)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ItemReportHistory({ itemId }: Props) {
  const { reports, loading, error } = useItemReportHistory(itemId);
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-history-line text-zinc-400 text-xs"></i>
          </div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Historial de correcciones</p>
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2].map(i => (
            <div key={i} className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-400 flex items-center gap-1.5">
          <i className="ri-error-warning-line text-rose-400"></i>
          No se pudo cargar el historial
        </p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-history-line text-zinc-400 text-xs"></i>
          </div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Historial de correcciones</p>
        </div>
        <p className="text-xs text-zinc-400 italic">Sin correcciones registradas aún.</p>
      </div>
    );
  }

  const resolved = reports.filter(r => r.status === 'resolved').length;
  const dismissed = reports.filter(r => r.status === 'dismissed').length;

  return (
    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
      {/* Header */}
      <button
        type="button"
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-2 mb-3 cursor-pointer group"
      >
        <div className="w-4 h-4 flex items-center justify-center">
          <i className="ri-history-line text-zinc-400 text-xs"></i>
        </div>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex-1 text-left">
          Historial de correcciones
        </p>
        <div className="flex items-center gap-1.5">
          {resolved > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              {resolved} resuelto{resolved > 1 ? 's' : ''}
            </span>
          )}
          {dismissed > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
              {dismissed} descartado{dismissed > 1 ? 's' : ''}
            </span>
          )}
          <i className={`ri-arrow-down-s-line text-zinc-300 dark:text-zinc-600 text-sm transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}></i>
        </div>
      </button>

      {/* List */}
      {!collapsed && (
        <div className="flex flex-col gap-3">
          {reports.map(report => (
            <ReportHistoryRow key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
