/**
 * AdminSettings.tsx — panel de configuración del sistema para admins.
 *
 * Muestra el estado de conectividad de Supabase y las Edge Functions,
 * estadísticas de filas por tabla principal, listado de APIs externas
 * integradas, categorías activas del catálogo y variables de entorno
 * no sensibles del despliegue actual.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Librerías externas ──────────────────────────────────────────────────────

import { supabase }                                          from '@/lib/supabase';
import { SUPABASE_URL, SUPABASE_FUNCTIONS_URL }             from '@/lib/supabaseConfig';
import { edgeFunctionUrl }                                   from '@/lib/edgeFunctions';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Estado de conectividad de un endpoint de infraestructura. */
interface ApiStatus {
  name:     string;
  url:      string;
  status:   'ok' | 'error' | 'checking';
  latency?: number;
  detail?:  string;
}

/** Estadística de una tabla de la base de datos. */
interface DbStat {
  label: string;
  value: string | number;
  icon:  string;
}

// ─── Constantes ──────────────────────────────────────────────────────────────

/** Categorías del catálogo con su API de origen. */
const CATEGORIES = [
  { id: 'videojuegos', label: 'Videojuegos', icon: 'ri-gamepad-line',  color: '#8b5cf6', api: 'IGDB'          },
  { id: 'peliculas',   label: 'Películas',   icon: 'ri-film-line',      color: '#f43f5e', api: 'TMDB'          },
  { id: 'series',      label: 'Series',      icon: 'ri-tv-2-line',      color: '#f59e0b', api: 'TMDB'          },
  { id: 'libros',      label: 'Libros',      icon: 'ri-book-open-line', color: '#10b981', api: 'Google Books'  },
  { id: 'conciertos',  label: 'Conciertos',  icon: 'ri-music-2-line',   color: '#ec4899', api: 'Ticketmaster'  },
];

/** APIs externas del servidor y la Edge Function que las consume. */
const EXTERNAL_APIS = [
  { name: 'IGDB (Videojuegos)',          key: 'IGDB_API_KEY',           edge: 'catalog-search' },
  { name: 'TMDB (Películas/Series)',     key: 'TMDB_API_KEY',           edge: 'catalog-search' },
  { name: 'Google Books',               key: 'GOOGLE_BOOKS_API_KEY',   edge: 'catalog-search' },
  { name: 'Ticketmaster (Conciertos)',   key: 'TICKETMASTER_API_KEY',   edge: 'catalog-search' },
];

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/**
 * Indicador visual del estado de un endpoint.
 * @param status - Estado de conectividad actual.
 */
function StatusDot({ status }: { status: ApiStatus['status'] }) {
  if (status === 'checking') return <span className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse" />;
  if (status === 'ok')       return <span className="w-2 h-2 rounded-full bg-emerald-400" />;
  return                            <span className="w-2 h-2 rounded-full bg-red-400" />;
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

/**
 * Oculta la ruta y parámetros de una URL mostrando solo protocolo y host.
 * @param url - URL completa a enmascarar.
 * @returns   - String `protocolo://hostname`.
 */
function maskUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}`;
  } catch {
    return url;
  }
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function AdminSettings() {
  // ─── Estado ───────────────────────────────────────────────────────────────

  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
  const [dbStats,     setDbStats]     = useState<DbStat[]>([]);
  const [loadingDb,   setLoadingDb]   = useState(true);
  const [envChecked,  setEnvChecked]  = useState(false);

  // ─── Efectos ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const endpoints = [
      { name: 'Supabase DB',           url: SUPABASE_URL                    },
      { name: 'Supabase Functions',    url: SUPABASE_FUNCTIONS_URL          },
      { name: 'Edge: catalog-search',  url: edgeFunctionUrl('catalog-search') },
      { name: 'Edge: item-reports',    url: edgeFunctionUrl('item-reports')    },
    ];

    setApiStatuses(endpoints.map(e => ({ ...e, status: 'checking' })));

    const check = async (name: string, url: string): Promise<ApiStatus> => {
      const t0 = performance.now();
      try {
        const ctrl    = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 5000);
        const res     = await fetch(url, { method: 'HEAD', signal: ctrl.signal });
        clearTimeout(timeout);
        const latency = Math.round(performance.now() - t0);
        return { name, url, status: res.ok || res.status === 401 || res.status === 405 ? 'ok' : 'error', latency };
      } catch {
        const latency = Math.round(performance.now() - t0);
        return { name, url, status: 'error', latency, detail: 'No se pudo conectar' };
      }
    };

    void Promise.all(endpoints.map(e => check(e.name, e.url))).then(setApiStatuses);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoadingDb(true);
      const [profiles, catalog, tracking, reports, audit] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('catalog_items').select('id', { count: 'exact', head: true }),
        supabase.from('user_item_tracking').select('id', { count: 'exact', head: true }),
        supabase.from('item_reports').select('id', { count: 'exact', head: true }),
        supabase.from('admin_audit_logs').select('id', { count: 'exact', head: true }),
      ]);

      setDbStats([
        { label: 'Usuarios (profiles)',  value: (profiles.count ?? '—').toLocaleString(),  icon: 'ri-group-line'         },
        { label: 'Ítems en catálogo',    value: (catalog.count  ?? '—').toLocaleString(),  icon: 'ri-database-2-line'    },
        { label: 'Entradas de tracker',  value: (tracking.count ?? '—').toLocaleString(),  icon: 'ri-bar-chart-box-line' },
        { label: 'Reportes totales',     value: (reports.count  ?? '—').toLocaleString(),  icon: 'ri-flag-2-line'        },
        { label: 'Logs de auditoría',    value: (audit.count    ?? '—').toLocaleString(),  icon: 'ri-shield-check-line'  },
      ]);
      setLoadingDb(false);
      setEnvChecked(true);
    };
    void load();
  }, []);

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Estado de infraestructura */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Estado de infraestructura
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">Conectividad con Supabase y Edge Functions.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 overflow-hidden">
          {apiStatuses.map(api => (
            <div key={api.name} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <StatusDot status={api.status} />
                <div>
                  <p className="text-sm font-medium text-zinc-200">{api.name}</p>
                  <p className="text-xs text-zinc-600 font-mono">{maskUrl(api.url)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {api.detail && <span className="text-xs text-red-400">{api.detail}</span>}
                {api.latency !== undefined && (
                  <span className={`text-xs font-mono ${api.latency < 300 ? 'text-emerald-400' : api.latency < 800 ? 'text-amber-400' : 'text-red-400'}`}>
                    {api.latency}ms
                  </span>
                )}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  api.status === 'ok'      ? 'bg-emerald-500/15 text-emerald-400' :
                  api.status === 'error'   ? 'bg-red-500/15 text-red-400'         :
                                             'bg-zinc-700 text-zinc-400'
                }`}>
                  {api.status === 'ok' ? 'Activo' : api.status === 'error' ? 'Error' : 'Verificando…'}
                </span>
              </div>
            </div>
          ))}
          {apiStatuses.length === 0 && (
            <div className="px-5 py-8 text-center text-zinc-600 text-sm">Verificando conectividad…</div>
          )}
        </div>
      </section>

      {/* Base de datos */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Base de datos
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">Filas actuales por tabla principal.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {loadingDb
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 animate-pulse">
                  <div className="h-5 w-5 rounded bg-zinc-800 mb-3" />
                  <div className="h-6 w-12 rounded bg-zinc-800 mb-1.5" />
                  <div className="h-3 w-20 rounded bg-zinc-800" />
                </div>
              ))
            : dbStats.map(stat => (
                <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center mb-3">
                    <i className={`${stat.icon} text-sm text-zinc-400`}></i>
                  </div>
                  <p className="text-xl font-black text-white mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-zinc-500 leading-tight">{stat.label}</p>
                </div>
              ))
          }
        </div>
      </section>

      {/* APIs externas */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            APIs externas
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Integraciones de datos de contenido. Las claves viven en variables de entorno del servidor — nunca expuestas al cliente.
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 overflow-hidden">
          {EXTERNAL_APIS.map(api => (
            <div key={api.name} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-zinc-200">{api.name}</p>
                <p className="text-xs text-zinc-600 font-mono mt-0.5">{api.key}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">via Edge Function</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">{api.edge}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Las claves de API se configuran como secrets en Supabase Edge Functions y nunca se exponen al cliente.
          Para actualizarlas usa el CLI de Supabase: <code className="font-mono text-zinc-500">supabase secrets set KEY=value</code>
        </p>
      </section>

      {/* Categorías activas */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Categorías del catálogo
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">Todas las categorías activas en Vaultly y su API de origen.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 overflow-hidden">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}18` }}>
                  <i className={`${cat.icon} text-sm`} style={{ color: cat.color }}></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{cat.label}</p>
                  <p className="text-xs text-zinc-600 font-mono">{cat.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Fuente:</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">{cat.api}</span>
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Activa
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Variables de entorno */}
      {envChecked && (
        <section>
          <div className="mb-4">
            <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Entorno
            </h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 overflow-hidden">
            {[
              { label: 'Supabase URL',    value: maskUrl(SUPABASE_URL)           },
              { label: 'Functions URL',   value: maskUrl(SUPABASE_FUNCTIONS_URL) },
              { label: 'Modo',            value: import.meta.env.MODE ?? 'production' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-zinc-500">{row.label}</span>
                <span className="text-xs font-mono text-zinc-300 truncate max-w-[260px]">{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
