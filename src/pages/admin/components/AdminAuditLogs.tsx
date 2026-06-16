/**
 * AdminAuditLogs.tsx — visor de registros de auditoría del sistema.
 *
 * Muestra una tabla paginada de logs de acciones de administración con
 * filtros avanzados por acción, entidad, actor y rango de fechas. Soporta
 * búsqueda por `entity_id`, chips de filtros activos con eliminación
 * individual y un modal para visualizar el payload JSON de cada registro.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState } from 'react';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAdminAuditLogs } from '@/hooks/useAdminAuditLogs';

// ─── Constantes ──────────────────────────────────────────────────────────────

/** Clases de badge por tipo de acción en el log. */
const ACTION_COLORS: Record<string, string> = {
  create:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  insert:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  update:  'bg-amber-500/15  text-amber-400  border border-amber-500/30',
  edit:    'bg-amber-500/15  text-amber-400  border border-amber-500/30',
  delete:  'bg-red-500/15   text-red-400   border border-red-500/30',
  remove:  'bg-red-500/15   text-red-400   border border-red-500/30',
  login:   'bg-sky-500/15    text-sky-400    border border-sky-500/30',
  logout:  'bg-zinc-500/15   text-zinc-400   border border-zinc-500/30',
  approve: 'bg-brand/15 text-brand dark:text-brand-dark border border-brand/30',
  reject:  'bg-orange-500/15 text-orange-400 border border-orange-500/30',
};

/** Icono por tipo de entidad afectada en el log. */
const ENTITY_ICONS: Record<string, string> = {
  catalog_items: 'ri-database-2-line',
  entities:      'ri-user-star-line',
  reviews:       'ri-quill-pen-line',
  profiles:      'ri-group-line',
  users:         'ri-group-line',
  item_entities: 'ri-link-m',
};

// ─── Utilidades ──────────────────────────────────────────────────────────────

/**
 * Devuelve las clases de badge para una acción del log buscando coincidencia parcial.
 * @param action - Nombre de la acción registrada.
 * @returns      - Clases Tailwind del badge correspondiente.
 */
function actionBadgeClass(action: string): string {
  const key = Object.keys(ACTION_COLORS).find(k => action.toLowerCase().includes(k));
  return key ? ACTION_COLORS[key] : 'bg-zinc-700/50 text-zinc-300 border border-zinc-600';
}

/**
 * Devuelve el icono Remix Icon para el tipo de entidad del log.
 * @param entity - Nombre de la entidad (tabla) afectada.
 * @returns      - Clase de icono Remix Icon.
 */
function entityIcon(entity: string): string {
  return ENTITY_ICONS[entity] ?? 'ri-file-list-3-line';
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/**
 * Modal de visualización del payload JSON de un log de auditoría.
 * @param payload - Objeto de datos del log a mostrar.
 * @param onClose - Callback para cerrar el modal.
 */
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

/**
 * Paginador con lógica de elipsis para grandes conjuntos de páginas.
 * @param page       - Página activa actual.
 * @param totalPages - Número total de páginas.
 * @param onPage     - Callback al seleccionar una página.
 */
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
      <button onClick={() => onPage(1)}          disabled={page === 1}          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><i className="ri-skip-back-mini-line text-sm"></i></button>
      <button onClick={() => onPage(page - 1)}   disabled={page === 1}          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><i className="ri-arrow-left-s-line text-sm"></i></button>
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
      <button onClick={() => onPage(page + 1)}   disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><i className="ri-arrow-right-s-line text-sm"></i></button>
      <button onClick={() => onPage(totalPages)} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><i className="ri-skip-forward-mini-line text-sm"></i></button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AdminAuditLogs() {
  const {
    logs, total, page, totalPages, loading,
    filters, actionOptions, entityOptions, activeFilterCount,
    setPage, updateFilters, resetFilters,
  } = useAdminAuditLogs();

  // ─── Estado ───────────────────────────────────────────────────────────────

  const [showFilters, setShowFilters] = useState(false);
  const [payloadLog,  setPayloadLog]  = useState<Record<string, unknown> | null>(null);

  // ─── Datos derivados ──────────────────────────────────────────────────────

  /** Chips de filtros activos para mostrar con botón de descarte individual. */
  const activeChips = [
    filters.action   && { key: 'action',   label: `Acción: ${filters.action}` },
    filters.entity   && { key: 'entity',   label: `Entidad: ${filters.entity}` },
    filters.actor_id && { key: 'actor_id', label: `Usuario: ${filters.actor_id.slice(0, 8)}…` },
    filters.dateFrom && { key: 'dateFrom', label: `Desde: ${filters.dateFrom}` },
    filters.dateTo   && { key: 'dateTo',   label: `Hasta: ${filters.dateTo}` },
  ].filter(Boolean) as { key: string; label: string }[];

  // ─── Utilidades internas ─────────────────────────────────────────────────

  /** Formatea una fecha ISO con separador de hora para la tabla. */
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return (
      d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' · ' +
      d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  };

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Cabecera */}
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
          {/* Búsqueda por entity_id */}
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></i>
            <input
              type="text"
              placeholder="Buscar entity_id…"
              value={filters.search}
              onChange={e => updateFilters({ search: e.target.value })}
              className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 w-52 transition-colors"
            />
          </div>
          {/* Botón de panel de filtros */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
              showFilters || activeFilterCount > 0
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600'
            }`}
          >
            <i className="ri-equalizer-3-line text-sm"></i>
            Filtros
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-brand dark:bg-brand-dark text-white text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Panel de filtros avanzados */}
      {showFilters && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Acción</label>
            <select
              value={filters.action}
              onChange={e => updateFilters({ action: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 cursor-pointer"
            >
              <option value="">Todas las acciones</option>
              {actionOptions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Entidad</label>
            <select
              value={filters.entity}
              onChange={e => updateFilters({ entity: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 cursor-pointer"
            >
              <option value="">Todas las entidades</option>
              {entityOptions.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Desde</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={e => updateFilters({ dateFrom: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Hasta</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={e => updateFilters({ dateTo: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            />
          </div>
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

      {/* Chips de filtros activos */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map(chip => (
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

      {/* Tabla de logs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <span>Fecha</span>
          <span>Actor</span>
          <span>Acción</span>
          <span>Entidad</span>
          <span className="w-16 text-right">Payload</span>
        </div>

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
            {logs.map(log => (
              <div
                key={log.id}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors items-center"
              >
                {/* Fecha */}
                <span className="text-xs text-zinc-500 font-mono tabular-nums">
                  {formatDate(log.created_at)}
                </span>

                {/* Actor */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-brand/20 dark:bg-brand-dark/25 flex-shrink-0">
                    <i className="ri-user-line text-xs text-zinc-300"></i>
                  </div>
                  <span className="text-sm text-zinc-300 truncate font-mono">
                    {log.actor_username ?? 'Sistema'}
                  </span>
                </div>

                {/* Acción */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${actionBadgeClass(log.action)}`}>
                  {log.action}
                </span>

                {/* Entidad */}
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

                {/* Payload */}
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

        {!loading && logs.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800">
            <span className="text-xs text-zinc-500">
              Página {page} de {totalPages} · {total.toLocaleString()} registros
            </span>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </div>
        )}
      </div>

      {/* Modal de payload */}
      {payloadLog && (
        <PayloadModal payload={payloadLog} onClose={() => setPayloadLog(null)} />
      )}
    </div>
  );
}
