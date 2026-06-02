import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ADMIN_STATS, ADMIN_WEEKLY_SIGNUPS, ADMIN_ACTIVITY_LOG } from '@/mocks/admin';
import { CATEGORIES } from '@/mocks/catalog';
import { useAdminReports } from '@/hooks/useAdminReports';
// AdminReport type now comes from the hook, not mocks

const KPI_CARDS = [
  { label: 'Usuarios totales',   value: ADMIN_STATS.total_users.toLocaleString(),   delta: `+${ADMIN_STATS.new_users_week} esta semana`,   icon: 'ri-group-line',          bg: 'bg-violet-950/40', accent: '#8b5cf6', border: 'border-violet-900/50' },
  { label: 'Ítems en catálogo',  value: ADMIN_STATS.total_items.toLocaleString(),   delta: `+${ADMIN_STATS.new_items_week} esta semana`,    icon: 'ri-database-2-line',     bg: 'bg-rose-950/40',   accent: '#f43f5e', border: 'border-rose-900/50' },
  { label: 'Reseñas totales',    value: ADMIN_STATS.total_reviews.toLocaleString(), delta: `${ADMIN_STATS.pending_reviews} pendientes`,     icon: 'ri-quill-pen-line',      bg: 'bg-amber-950/40',  accent: '#f59e0b', border: 'border-amber-900/50' },
  { label: 'Trackers activos',   value: ADMIN_STATS.total_tracked.toLocaleString(), delta: `${ADMIN_STATS.active_today.toLocaleString()} activos hoy`, icon: 'ri-bar-chart-box-line', bg: 'bg-emerald-950/40', accent: '#10b981', border: 'border-emerald-900/50' },
];

const MAX_SIGNUPS = Math.max(...ADMIN_WEEKLY_SIGNUPS.map(d => d.count));

const CAT_DISTRIBUTION = [
  { id: 'games',    pct: 32, count: '16.5k' },
  { id: 'movies',   pct: 28, count: '14.4k' },
  { id: 'series',   pct: 20, count: '10.3k' },
  { id: 'books',    pct: 14, count: '7.2k' },
  { id: 'concerts', pct: 6,  count: '3.1k' },
];

export default function AdminOverview() {
  const { pendingCount, newCount, markAllSeen } = useAdminReports();
  const [pulse, setPulse] = useState(false);

  // Trigger pulse animation when newCount changes
  useEffect(() => {
    if (newCount > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 1200);
      return () => clearTimeout(t);
    }
  }, [newCount]);

  return (
    <div className="flex flex-col gap-6">
      {/* Reports alert banner */}
      {pendingCount > 0 && (
        <div className={`flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border transition-all duration-500 ${
          newCount > 0
            ? 'bg-rose-950/40 border-rose-800/60'
            : 'bg-amber-950/30 border-amber-900/50'
        } ${pulse ? 'scale-[1.01]' : 'scale-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`relative w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${newCount > 0 ? 'bg-rose-500/20' : 'bg-amber-500/20'}`}>
              <i className={`ri-flag-2-line text-lg ${newCount > 0 ? 'text-rose-400' : 'text-amber-400'}`}></i>
              {newCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold animate-bounce">
                  {newCount}
                </span>
              )}
            </div>
            <div>
              <p className={`text-sm font-bold ${newCount > 0 ? 'text-rose-300' : 'text-amber-300'}`}>
                {newCount > 0
                  ? `${newCount} reporte${newCount > 1 ? 's' : ''} nuevo${newCount > 1 ? 's' : ''} sin revisar`
                  : `${pendingCount} reporte${pendingCount > 1 ? 's' : ''} pendiente${pendingCount > 1 ? 's' : ''} de revisión`
                }
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Usuarios han reportado problemas en ítems del catálogo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {newCount > 0 && (
              <button
                onClick={markAllSeen}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                Marcar vistos
              </button>
            )}
            <Link
              to="/admin/reports"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                newCount > 0
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400'
              }`}
            >
              <i className="ri-arrow-right-line"></i>
              Ver reportes
            </Link>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map(card => (
          <div key={card.label} className={`rounded-2xl border ${card.border} ${card.bg} p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10">
                <i className={`${card.icon} text-lg`} style={{ color: card.accent }}></i>
              </div>
              <span className="text-xs text-zinc-500 font-medium">{card.delta}</span>
            </div>
            <p className="text-2xl md:text-3xl font-black text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {card.value}
            </p>
            <p className="text-xs text-zinc-400">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly signups chart */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-sm">Registros esta semana</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Total: {ADMIN_WEEKLY_SIGNUPS.reduce((a, b) => a + b.count, 0)} nuevos usuarios
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
              +{ADMIN_STATS.new_users_week} esta semana
            </span>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {ADMIN_WEEKLY_SIGNUPS.map(day => {
              const pct = (day.count / MAX_SIGNUPS) * 100;
              return (
                <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs text-zinc-500">{day.count}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${pct}%`,
                        minHeight: '6px',
                        background: 'linear-gradient(to top, #8b5cf6, #f43f5e)',
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h3 className="font-bold text-white text-sm mb-5">Distribución por categoría</h3>
          <div className="flex flex-col gap-3">
            {CAT_DISTRIBUTION.map(cd => {
              const cat = CATEGORIES.find(c => c.id === cd.id);
              if (!cat) return null;
              return (
                <div key={cd.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <i className={`${cat.icon} text-sm`} style={{ color: cat.accent }}></i>
                      <span className="text-xs text-zinc-300">{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">{cd.count}</span>
                      <span className="text-xs font-semibold text-zinc-300">{cd.pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cd.pct}%`, background: cat.accent }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Actividad reciente del sistema</h3>
          <span className="text-xs text-zinc-500">Últimas 24h</span>
        </div>
        <div className="divide-y divide-zinc-800">
          {ADMIN_ACTIVITY_LOG.map(log => (
            <div key={log.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 flex-shrink-0">
                <i className={`${log.icon} text-sm ${log.color}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{log.action}</p>
                <p className="text-xs text-zinc-500 truncate">{log.detail}</p>
              </div>
              <span className="text-xs text-zinc-600 flex-shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
