import { useState } from 'react';
import { useAdminAuditLogs } from '@/hooks/useAdminAuditLogs';

// ─── Action badge colors ────────────────────────────────────────────────────
const ACTION_COLORS: Record<string, string> = {
  create:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  insert:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  update:  'bg-amber-500/15  text-amber-400  border border-amber-500/30',
  edit:    'bg-amber-500/15  text-amber-400  border border-amber-500/30',
  delete:  'bg-rose-500/15   text-rose-400   border border-rose-500/30',
  remove:  'bg-rose-500/15   text-rose-400   border border-rose-500/30',
  login:   'bg-sky-500/15    text-sky-400    border border-sky-500/30',
  logout:  'bg-zinc-500/15   text-zinc-400   border border-zinc-500/30',
  approve: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
  reject:  'bg-orange-500/15 text-orange-400 border border-orange-500/30',
};

function actionBadgeClass(action: string) {
  const key = Object.keys(ACTION_COLORS).find((k) => action.toLowerCase().includes(k));
  return key ? ACTION_COLORS[key] : 'bg-zinc-700/50 text-zinc-300 border border-zinc-600';
}

// ─── Entity icon map ────────────────────────────────────────────────────────
const ENTITY_ICONS: Record<string, string> = {
  catalog_items: 'ri-database-2-line',
  entities:      'ri-user-star-line',
  reviews:       'ri-quill-pen-line',
  profiles:      'ri-group-line',
  users:         'ri-group-line',
  item_entities: 'ri-link-m',
};

function entityIcon(entity: string) {
  return ENTITY_ICONS[entity] ?? 'ri-file-list-3-line';
}

// ─── Payload viewer ─────────────────────────────────────────────────────────
function PayloadModal({ payload, onClose }: { payload: Record<string, unknown>; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative z-10 bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-white">Payload del log</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 cursor-pointer">
            <i className="ri-close-line text-base"></i>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap break-all leading-relaxed">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPage(1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <i className="ri-skip-back-mini-line text-sm"></i>
      </button>
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <i className="ri-arrow-left-s-line text-sm"></i>
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-zinc-600 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              p === page ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <i className="ri-arrow-right-s-line text-sm"></i>
      </button>
      <button
        onClick={() => onPage(totalPages)}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <i className="ri-skip-forward-mini-line text-sm"></i>
      </button>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function AdminAuditLogs() {
  const {
    logs, total, page, totalPages, loading,
    filters, actionOptions, entityOptions, activeFilterCount,
    setPage, updateFilters, resetFilters,
  } = useAdminAuditLogs();

  const [showFilters, setShowFilters] = useState(false);
  const [payloadLog, setPayloadLog] = useState<Record<string, unknown> | null>(null);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' · '
      + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  const activeChips = [
    filters.action   && { key: 'action',   label: `Acción: ${filters.action}` },
    filters.entity   && { key: 'entity',   label: `Entidad: ${filters.entity}` },
    filters.actor_id && { key: 'actor_id', label: `Usuario: ${filters.actor_id.slice(0, 8)}…` },
    filters.dateFrom && { key: 'dateFrom', label: `Desde: ${filters.dateFrom}` },
    filters.dateTo   && { key: 'dateTo',   label: `Hasta: ${filters.dateTo}` },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Auditoría del sistema
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {total.toLocaleString()} registros en total
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></i>
            <input
              type="text"
              placeholder="Buscar entity_id…"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 w-52 transition-colors"
            />
          </div>
          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
              showFilters || activeFilterCount > 0
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600'
            }`}
          >
            <i className="ri-equalizer-3-line text-sm"></i>
            Filtros
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-violet-500 text-white text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Acción</label>
            <select
              value={filters.action}
              onChange={(e) => updateFilters({ action: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 cursor-pointer"
            >
              <option value="">Todas las acciones</option>
              {actionOptions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          {/* Entity */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Entidad</label>
            <select
              value={filters.entity}
              onChange={(e) => updateFilters({ entity: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 cursor-pointer"
            >
              <option value="">Todas las entidades</option>
              {entityOptions.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          {/* Date from */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Desde</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilters({ dateFrom: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            />
          </div>
          {/* Date to */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Hasta</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilters({ dateTo: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            />
          </div>
          {/* Reset */}
          {activeFilterCount > 0 && (
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300"
            >
              {chip.label}
              <button
                onClick={() => updateFilters({ [chip.key]: '' })}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-600 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xs"></i>
              </button>
            </span>
          ))}
          {activeChips.length > 1 && (
            <button
              onClick={resetFilters}
              className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Limpiar todo
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <span>Fecha</span>
          <span>Actor</span>
          <span>Acción</span>
          <span>Entidad</span>
          <span className="w-16 text-right">Payload</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="divide-y divide-zinc-800/50">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 animate-pulse">
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                <div className="h-5 bg-zinc-800 rounded-full w-20"></div>
                <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                <div className="h-6 bg-zinc-800 rounded w-16 ml-auto"></div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-800 mb-4">
              <i className="ri-file-list-3-line text-2xl text-zinc-600"></i>
            </div>
            <p className="text-zinc-400 font-medium">Sin registros</p>
            <p className="text-zinc-600 text-sm mt-1">No hay logs que coincidan con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {logs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors items-center"
              >
                {/* Date */}
                <span className="text-xs text-zinc-500 font-mono tabular-nums">
                  {formatDate(log.created_at)}
                </span>

                {/* Actor */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-rose-500/30 flex-shrink-0">
                    <i className="ri-user-line text-xs text-zinc-300"></i>
                  </div>
                  <span className="text-sm text-zinc-300 truncate font-mono">
                    {log.actor_username ?? 'Sistema'}
                  </span>
                </div>

                {/* Action */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${actionBadgeClass(log.action)}`}>
                  {log.action}
                </span>

                {/* Entity */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={`${entityIcon(log.entity)} text-zinc-500 text-sm`}></i>
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm text-zinc-300 block truncate">{log.entity}</span>
                    {log.entity_id && (
                      <span className="text-xs text-zinc-600 font-mono truncate block">
                        {log.entity_id.length > 20 ? `${log.entity_id.slice(0, 20)}…` : log.entity_id}
                      </span>
                    )}
                  </div>
                </div>

                {/* Payload button */}
                <div className="w-16 flex justify-end">
                  {log.payload && Object.keys(log.payload).length > 0 ? (
                    <button
                      onClick={() => setPayloadLog(log.payload)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-code-s-slash-line text-xs"></i>
                      Ver
                    </button>
                  ) : (
                    <span className="text-zinc-700 text-xs">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer with pagination */}
        {!loading && logs.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800">
            <span className="text-xs text-zinc-500">
              Página {page} de {totalPages} · {total.toLocaleString()} registros
            </span>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </div>
        )}
      </div>

      {/* Payload modal */}
      {payloadLog && (
        <PayloadModal payload={payloadLog} onClose={() => setPayloadLog(null)} />
      )}
    </div>
  );
}
