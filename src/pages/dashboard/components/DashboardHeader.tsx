/**
 * DashboardHeader.tsx — cabecera del dashboard con saludo dinámico y acciones rápidas.
 *
 * El saludo cambia según la hora del día (mañana/tarde/noche) y usa el nombre
 * para mostrar del perfil autenticado. El resumen de stats se muestra inline
 * o como esqueleto mientras cargan los datos.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { DashboardStats } from '@/hooks/useDashboardStats';

// ─── Componentes ────────────────────────────────────────────────────────────────────

import { InteractiveHoverLink } from "@/components/ui/interactive-hover-button"

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del componente de cabecera del dashboard. */
interface Props {
  stats: DashboardStats | null;
  loading: boolean;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function DashboardHeader({ stats, loading }: Props) {
  const { profile } = useAuth();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 13 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
  const displayName = profile?.display_name ?? profile?.username ?? 'Usuario';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{greeting},</p>
        <h1
          className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {displayName} 👋
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          {loading ? (
            <span className="inline-block h-4 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></span>
          ) : stats && stats.total_tracked > 0 ? (
            <>
              Llevas <strong className="text-zinc-700 dark:text-zinc-300">{stats.total_tracked} ítems</strong> en tu vault.{' '}
              {stats.completed > 0 && <>Has completado <strong className="text-zinc-700 dark:text-zinc-300">{stats.completed}</strong>. Sigue así.</>}
            </>
          ) : (
            <>Tu vault está vacío. ¡Empieza a añadir ítems al tracker!</>
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <InteractiveHoverLink
          to="/catalog"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
          showArrow={false}
        >
          <i className="ri-compass-3-line"></i>
          Explorar catálogo
        </InteractiveHoverLink>
        <InteractiveHoverLink
          to="/tracker"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
          showArrow={false}
        >
          <i className="ri-bar-chart-box-line"></i>
          Mi Tracker
        </InteractiveHoverLink>
      </div>
    </div>
  );
}
