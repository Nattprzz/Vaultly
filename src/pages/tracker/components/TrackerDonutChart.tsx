/**
 * TrackerDonutChart.tsx — gráfico de donut interactivo de distribución de estados.
 *
 * Usa Recharts PieChart con un anillo (innerRadius/outerRadius) para mostrar
 * cuántos ítems hay en cada estado. Los estados se presentan en orden canónico
 * definido por CANONICAL_ORDER. Al pasar el ratón por una porción del donut
 * o por un StatusPill, el resto de porciones se atenúa. Al hacer click en una
 * porción o pill se activa/desactiva el filtro de estado via `onStatusFilter`.
 * Los estados con 0 ítems se renderizan como GhostPill (semitransparentes).
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';

// ─── Librerías externas ───────────────────────────────────────────────────────

import { PieChart, Pie, Cell } from 'recharts';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { TrackerEntry } from '@/hooks/useTracker';

// ─── Constantes ───────────────────────────────────────────────────────────────

import {
  STATUS_CONFIG,
  getStatusLabel,
  getCategoryStatuses,
} from '@/constants/tracker-statuses';
import type { CategoryStatus } from '@/constants/tracker-statuses';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Datum de un segmento del donut. */
interface ChartDatum {
  status: CategoryStatus;
  value:  number;
  label:  string;
  color:  string;
  /** Color para el efecto de glow al hover. */
  glow:   string;
  /** Color de fondo semitransparente para badges. */
  bg:     string;
}

/** Props del gráfico de donut del tracker. */
interface Props {
  entries:        Record<string, TrackerEntry>;
  activeCategory: string;
  onStatusFilter?: (status: CategoryStatus | 'all') => void;
  activeStatus?:  CategoryStatus | 'all';
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Orden de presentación de estados en el donut y en la leyenda. */
const CANONICAL_ORDER: CategoryStatus[] = [
  'wishlist', 'pending',
  'playing', 'watching', 'reading',
  'played', 'watched', 'read', 'attended',
  'completed', 'platinum',
  'waiting_season', 'waiting_episode',
  'abandoned', 'missed',
];

/** Tamaño total del SVG del donut en píxeles. */
const DONUT_SIZE = 210;
/** Radio interior del anillo. */
const INNER_R    = 66;
/** Radio exterior del anillo. */
const OUTER_R    = 90;

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/**
 * Pill interactiva que representa un estado con ítems en la leyenda.
 * Actúa como botón toggle para activar/desactivar el filtro de estado.
 */
function StatusPill({
  datum, total, isHovered, isActive, onHover, onFilter,
}: {
  datum:    ChartDatum;
  total:    number;
  isHovered: boolean;
  isActive:  boolean;
  onHover:  (s: CategoryStatus | null) => void;
  onFilter?: (s: CategoryStatus | 'all') => void;
}) {
  const pct = Math.round((datum.value / total) * 100);

  return (
    <button
      type="button"
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200"
      style={{
        background: isActive ? datum.bg : isHovered ? 'var(--surface-sunken)' : 'transparent',
        outline:    isActive ? `1px solid ${datum.color}40` : '1px solid transparent',
      }}
      onMouseEnter={() => onHover(datum.status)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onFilter?.(isActive ? 'all' : datum.status)}
    >
      <span
        className="h-2.5 w-2.5 flex-shrink-0 rounded-full transition-all duration-200"
        style={{
          background:  datum.color,
          boxShadow:   isHovered || isActive ? `0 0 10px ${datum.glow}` : 'none',
          transform:   isHovered ? 'scale(1.3)' : 'scale(1)',
        }}
      />
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-[11px] font-semibold leading-tight transition-colors duration-150"
          style={{ color: isHovered || isActive ? datum.color : 'var(--text-primary)' }}
        >
          {datum.label}
        </p>
        <p className="text-[10px] leading-tight text-[var(--text-tertiary)]">
          {datum.value} {datum.value === 1 ? 'ítem' : 'ítems'}
        </p>
      </div>
      <span
        className="flex-shrink-0 rounded-lg px-1.5 py-0.5 text-[10px] font-bold tabular-nums transition-all duration-200"
        style={{ background: datum.bg, color: datum.color }}
      >
        {pct}%
      </span>
    </button>
  );
}

/** Pill semitransparente para estados con 0 ítems. */
function GhostPill({ status, category }: { status: CategoryStatus; category: string }) {
  const cfg   = STATUS_CONFIG[status];
  const label = getStatusLabel(status, category === 'all' ? undefined : category);
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 opacity-25">
      <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: cfg.color }} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold leading-tight text-[var(--text-primary)]">{label}</p>
        <p className="text-[10px] text-[var(--text-tertiary)]">0 ítems</p>
      </div>
      <span className="flex-shrink-0 rounded-lg px-1.5 py-0.5 text-[10px] font-bold" style={{ background: cfg.bg, color: cfg.color }}>
        0%
      </span>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function TrackerDonutChart({
  entries,
  activeCategory,
  onStatusFilter,
  activeStatus = 'all',
}: Props) {
  // ─── Estado ───────────────────────────────────────────────────────────────

  const [hoveredStatus, setHoveredStatus] = useState<CategoryStatus | null>(null);

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const all = useMemo(
    () => Object.values(entries).filter(e =>
      activeCategory === 'all' || e.category === activeCategory,
    ),
    [entries, activeCategory],
  );

  const total = all.length;

  const validStatuses = useMemo<CategoryStatus[]>(() => {
    if (activeCategory !== 'all') return getCategoryStatuses(activeCategory);
    const present = new Set(all.map(e => e.status as CategoryStatus));
    return CANONICAL_ORDER.filter(s => present.has(s));
  }, [activeCategory, all]);

  const counts = useMemo(() => {
    const map: Partial<Record<CategoryStatus, number>> = {};
    for (const e of all) {
      const s = e.status as CategoryStatus;
      map[s] = (map[s] ?? 0) + 1;
    }
    return map;
  }, [all]);

  const data = useMemo<ChartDatum[]>(() =>
    validStatuses
      .map(s => {
        const cfg = STATUS_CONFIG[s];
        return {
          status: s,
          value:  counts[s] ?? 0,
          label:  getStatusLabel(s, activeCategory === 'all' ? undefined : activeCategory),
          color:  cfg.color,
          glow:   cfg.glow,
          bg:     cfg.bg,
        };
      })
      .filter(d => d.value > 0),
    [validStatuses, counts, activeCategory],
  );

  // ─── Estado vacío ─────────────────────────────────────────────────────────

  if (total === 0) {
    return (
      <div className="mb-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-8 py-12 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'var(--surface-sunken)' }}>
          <i className="ri-pie-chart-2-line text-3xl text-[var(--text-tertiary)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-secondary)]">
            Todavía no tienes ítems en esta categoría
          </p>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">
            Añade elementos al tracker para ver tu resumen aquí
          </p>
        </div>
      </div>
    );
  }

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow hover:shadow-md">

      {/* Cabecera */}
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-5 py-3.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: 'rgba(37,99,235,0.12)' }}>
          <i className="ri-pie-chart-2-line text-xs" style={{ color: 'var(--brand-accent)' }} />
        </span>
        <span className="text-sm font-semibold text-[var(--text-primary)]">Resumen de estados</span>
        <span
          className="ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-secondary)]"
          style={{ background: 'var(--surface-sunken)' }}
        >
          {total} {total === 1 ? 'ítem' : 'ítems'}
        </span>
      </div>

      {/* Cuerpo: donut + leyenda */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">

          {/* Donut SVG */}
          <div className="relative flex-shrink-0" style={{ width: DONUT_SIZE, height: DONUT_SIZE }}>
            <PieChart width={DONUT_SIZE} height={DONUT_SIZE}>
              <Pie
                data={data}
                cx={DONUT_SIZE / 2}
                cy={DONUT_SIZE / 2}
                innerRadius={INNER_R}
                outerRadius={OUTER_R}
                paddingAngle={data.length > 1 ? 3 : 0}
                dataKey="value"
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
                animationBegin={0}
                animationDuration={900}
                animationEasing="ease-out"
                isAnimationActive
                onMouseEnter={(_: any, idx: number) => setHoveredStatus(data[idx]?.status ?? null)}
                onMouseLeave={() => setHoveredStatus(null)}
                onClick={(_: any, idx: number) => {
                  const s = data[idx]?.status;
                  if (s) onStatusFilter?.(activeStatus === s ? 'all' : s);
                }}
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                {data.map(d => {
                  const isHov = hoveredStatus === d.status;
                  const dimmed = hoveredStatus !== null && !isHov;
                  return (
                    <Cell
                      key={d.status}
                      fill={d.color}
                      style={{
                        opacity:    dimmed ? 0.22 : 1,
                        filter:     isHov  ? `drop-shadow(0 0 6px ${d.glow})` : 'none',
                        transition: 'opacity 0.18s ease, filter 0.18s ease',
                        cursor:     'pointer',
                      }}
                    />
                  );
                })}
              </Pie>
            </PieChart>

            {/* Texto central: total de ítems */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-[32px] font-black leading-none text-[var(--text-primary)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {total}
              </span>
              <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                Total en tracker
              </span>
            </div>
          </div>

          {/* Leyenda con pills */}
          <div className="w-full min-w-0 flex-1">
            <div className="grid grid-cols-2 gap-1 md:grid-cols-1">
              {validStatuses.map(s => {
                const datum = data.find(d => d.status === s);
                if (!datum) {
                  return <GhostPill key={s} status={s} category={activeCategory} />;
                }
                return (
                  <StatusPill
                    key={s}
                    datum={datum}
                    total={total}
                    isHovered={hoveredStatus === s}
                    isActive={activeStatus === s}
                    onHover={setHoveredStatus}
                    onFilter={onStatusFilter}
                  />
                );
              })}
            </div>

            {/* Indicador del filtro activo */}
            {activeStatus !== 'all' && STATUS_CONFIG[activeStatus as CategoryStatus] && (
              <button
                type="button"
                className="mt-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-opacity hover:opacity-80"
                style={{
                  background: STATUS_CONFIG[activeStatus as CategoryStatus].bg,
                  color:      STATUS_CONFIG[activeStatus as CategoryStatus].color,
                }}
                onClick={() => onStatusFilter?.('all')}
              >
                <i className="ri-filter-line text-[10px]" />
                Filtrando: {getStatusLabel(activeStatus, activeCategory === 'all' ? undefined : activeCategory)}
                <i className="ri-close-line text-[10px]" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
