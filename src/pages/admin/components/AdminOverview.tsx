import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategoryColors';
import { useAdminReports } from '@/hooks/useAdminReports';
import { supabase } from '@/lib/supabase';

interface KpiCard {
  label: string;
  value: string;
  delta: string;
  icon: string;
  bg: string;
  accent: string;
  border: string;
}

interface WeeklyPoint {
  day: string;
  count: number;
  categories: Record<string, number>;
}

interface CategoryDistribution {
  id: string;
  pct: number;
  count: string;
}

interface ActivityLogItem {
  id: string;
  action: string;
  detail: string;
  time: string;
  icon: string;
  color: string;
}

function compactNumber(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
}

export default function AdminOverview() {
  const CATEGORIES = useCategories();
  const { pendingCount, newCount, markAllSeen } = useAdminReports();
  const [pulse, setPulse] = useState(false);
  const [kpiCards, setKpiCards] = useState<KpiCard[]>([]);
  const [weeklySignups, setWeeklySignups] = useState<WeeklyPoint[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);

  useEffect(() => {
    if (newCount > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 1200);
      return () => clearTimeout(t);
    }
  }, [newCount]);

  useEffect(() => {
    const load = async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [
        profilesCount,
        newProfilesCount,
        catalogCount,
        newCatalogCount,
        trackerRows,
        reviewCount,
        auditRows,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString()),
        supabase.from('catalog_items').select('id', { count: 'exact', head: true }),
        supabase.from('catalog_items').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString()),
        supabase.from('user_item_tracking').select('id, category, created_at, updated_at'),
        supabase.from('user_item_tracking').select('id', { count: 'exact', head: true }).not('review', 'is', null).neq('review', ''),
        supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      const trackerData = trackerRows.data ?? [];
      setKpiCards([
        { label: 'Usuarios totales', value: (profilesCount.count ?? 0).toLocaleString(), delta: `+${newProfilesCount.count ?? 0} esta semana`, icon: 'ri-group-line', bg: 'bg-brand/10', accent: '#3b82f6', border: 'border-brand/20' },
        { label: 'Items en catalogo', value: (catalogCount.count ?? 0).toLocaleString(), delta: `+${newCatalogCount.count ?? 0} esta semana`, icon: 'ri-database-2-line', bg: 'bg-orange-950/30', accent: '#f97316', border: 'border-orange-900/40' },
        { label: 'Reseñas totales', value: (reviewCount.count ?? 0).toLocaleString(), delta: `${pendingCount} reportes pendientes`, icon: 'ri-quill-pen-line', bg: 'bg-amber-950/40', accent: '#f59e0b', border: 'border-amber-900/50' },
        { label: 'Trackers activos', value: trackerData.length.toLocaleString(), delta: `${trackerData.filter(row => Date.now() - new Date(row.updated_at).getTime() < 24 * 60 * 60 * 1000).length} activos hoy`, icon: 'ri-bar-chart-box-line', bg: 'bg-emerald-950/40', accent: '#10b981', border: 'border-emerald-900/50' },
      ]);

      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'short' });
      setWeeklySignups(Array.from({ length: 7 }, (_, index) => {
        const day = new Date(start);
        day.setDate(start.getDate() + index);
        const nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);
        const dayRows = trackerData.filter(row => {
          const created = new Date(row.created_at).getTime();
          return created >= day.getTime() && created < nextDay.getTime();
        });
        const categories: Record<string, number> = {};
        dayRows.forEach(row => {
          categories[row.category] = (categories[row.category] ?? 0) + 1;
        });
        return { day: formatter.format(day).slice(0, 1).toUpperCase(), count: dayRows.length, categories };
      }));

      const byCategory = new Map<string, number>();
      trackerData.forEach(row => byCategory.set(row.category, (byCategory.get(row.category) ?? 0) + 1));
      const totalTracked = Math.max(trackerData.length, 1);
      setCategoryDistribution(CATEGORIES.map(cat => {
        const count = byCategory.get(cat.id) ?? 0;
        return { id: cat.id, pct: Math.round((count / totalTracked) * 100), count: compactNumber(count) };
      }));

      setActivityLog((auditRows.data ?? []).map(log => ({
        id: log.id,
        action: `${log.action} ${log.entity}`,
        detail: log.entity_id ?? 'Sin identificador',
        time: new Date(log.created_at).toLocaleString('es-ES'),
        icon: 'ri-shield-check-line',
        color: 'text-brand dark:text-brand-dark',
      })));
    };

    void load();
  }, [pendingCount, CATEGORIES]);

  const maxSignups = Math.max(...weeklySignups.map(d => d.count), 1);

  return (
    <div className="flex flex-col gap-6">
      {pendingCount > 0 && (
        <div className={`flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border transition-all duration-500 ${
          newCount > 0
            ? 'bg-red-950/40 border-red-800/60'
            : 'bg-amber-950/30 border-amber-900/50'
        } ${pulse ? 'scale-[1.01]' : 'scale-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`relative w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${newCount > 0 ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
              <i className={`ri-flag-2-line text-lg ${newCount > 0 ? 'text-red-400' : 'text-amber-400'}`}></i>
              {newCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold animate-bounce">
                  {newCount}
                </span>
              )}
            </div>
            <div>
              <p className={`text-sm font-bold ${newCount > 0 ? 'text-red-300' : 'text-amber-300'}`}>
                {newCount > 0
                  ? `${newCount} reporte${newCount > 1 ? 's' : ''} nuevo${newCount > 1 ? 's' : ''} sin revisar`
                  : `${pendingCount} reporte${pendingCount > 1 ? 's' : ''} pendiente${pendingCount > 1 ? 's' : ''} de revision`
                }
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Usuarios han reportado problemas en items del catalogo
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
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400'
              }`}
            >
              <i className="ri-arrow-right-line"></i>
              Ver reportes
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(card => (
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
        <div className="lg:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-sm">Ítems añadidos al tracker esta semana</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Total: {weeklySignups.reduce((a, b) => a + b.count, 0)} nuevas entradas
              </p>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklySignups.map(day => {
              const pct = (day.count / maxSignups) * 100;
              return (
                <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs text-zinc-500">{day.count || ''}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                    <div
                      className="w-full rounded-t-lg overflow-hidden flex flex-col-reverse transition-all duration-500"
                      style={{
                        height: `${pct}%`,
                        minHeight: day.count > 0 ? '6px' : '0',
                        opacity: day.count > 0 ? 1 : 0,
                      }}
                    >
                      {CATEGORIES.map(cat => {
                        const n = day.categories[cat.id] ?? 0;
                        if (n === 0) return null;
                        return (
                          <div
                            key={cat.id}
                            style={{ flex: n, backgroundColor: cat.accent, minHeight: '2px' }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">{day.day}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.accent }} />
                <span className="text-[10px] text-zinc-500">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h3 className="font-bold text-white text-sm mb-5">Distribución por categoría</h3>
          <div className="flex flex-col gap-3">
            {categoryDistribution.map(cd => {
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

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Actividad reciente del sistema</h3>
          <span className="text-xs text-zinc-500">Auditoría</span>
        </div>
        <div className="divide-y divide-zinc-800">
          {activityLog.length === 0 ? (
            <div className="px-6 py-8 text-sm text-zinc-500 text-center">Sin actividad registrada</div>
          ) : activityLog.map(log => (
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
