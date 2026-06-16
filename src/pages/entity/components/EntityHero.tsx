/**
 * EntityHero.tsx — sección hero de la página de entidad.
 *
 * Muestra el avatar de la entidad sobre un fondo de imagen desenfocada con gradiente,
 * junto a la etiqueta de tipo, el nombre, un extracto de la bio y cuatro métricas
 * rápidas: número de obras, rating medio, mejor rating y trayectoria en años.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { TYPE_LABELS, TYPE_ICONS } from '@/hooks/useEntity';
import type { EntityItem } from '@/hooks/useEntity';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Subconjunto de campos de la entidad requeridos por este componente. */
interface Entity {
  /** Nombre público de la entidad. */
  name: string;
  /** Tipo de entidad (director, actor, author, artist, studio…). */
  type: string;
  /** Texto de la biografía, opcional. */
  bio?: string | null;
  /** URL de la imagen principal, opcional. */
  image_url?: string | null;
}

/** Props del componente. */
interface Props {
  /** Datos de la entidad a mostrar. */
  entity: Entity;
  /** Lista de ítems del catálogo vinculados a la entidad. */
  items: EntityItem[];
  /** Slug de la URL de la entidad (para breadcrumb). */
  slug: string;
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Extrae el rating numérico de un ítem o devuelve `null` si no existe.
 *
 * @param item - Ítem del catálogo con campo `metadata.rating` opcional.
 * @returns Número del rating o `null`.
 */
function getItemRating(item: EntityItem): number | null {
  const r = item.metadata?.rating;
  return r != null ? Number(r) : null;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function EntityHero({ entity, items, slug }: Props) {
  // ─── Datos derivados ──────────────────────────────────────────────────────

  const typeLabel = TYPE_LABELS[entity.type] ?? entity.type;
  const typeIcon  = TYPE_ICONS[entity.type] ?? 'ri-user-line';

  const rated = items.filter(i => getItemRating(i) != null);

  const avgRating = rated.length > 0
    ? rated.reduce((s, i) => s + (getItemRating(i) ?? 0), 0) / rated.length
    : null;

  const topRated = rated.length > 0
    ? rated.reduce((best, i) => (getItemRating(i) ?? 0) > (getItemRating(best) ?? 0) ? i : best, rated[0])
    : null;

  const years = items.map(i => i.release_date?.slice(0, 4)).filter(Boolean) as string[];
  const minYear    = years.length > 0 ? Math.min(...years.map(Number)) : null;
  const maxYear    = years.length > 0 ? Math.max(...years.map(Number)) : null;
  const careerSpan = minYear && maxYear && minYear !== maxYear
    ? `${minYear} – ${maxYear}`
    : minYear ? String(minYear) : null;

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 360 }}>
      {/* Fondo desenfocado con la imagen de la entidad */}
      {entity.image_url && (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={entity.image_url}
            alt=""
            className="w-full h-full object-cover object-top scale-110 blur-md opacity-25"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-900/60" />

      {/* Patrón de cuadrícula decorativo */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-6 pt-10 pb-12">
        {/* Migas de pan */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors cursor-pointer">Inicio</Link>
          <i className="ri-arrow-right-s-line text-zinc-600"></i>
          <Link to="/catalog" className="hover:text-white transition-colors cursor-pointer">Catálogo</Link>
          <i className="ri-arrow-right-s-line text-zinc-600"></i>
          <span className="text-zinc-400">{entity.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-end">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-white/10 bg-zinc-800 shadow-2xl">
              {entity.image_url ? (
                <img
                  src={entity.image_url}
                  alt={entity.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className={`${typeIcon} text-4xl text-zinc-500`}></i>
                </div>
              )}
            </div>
            {/* Badge de tipo sobre el avatar */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700">
              <i className={`${typeIcon} text-sm text-zinc-300`}></i>
            </div>
          </div>

          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-zinc-300 text-xs font-medium mb-3">
              <i className={typeIcon}></i>
              {typeLabel}
            </span>

            <h1
              className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {entity.name}
            </h1>

            {entity.bio && (
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl line-clamp-2 mb-5">
                {entity.bio}
              </p>
            )}

            {/* Métricas rápidas */}
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10">
                  <i className="ri-film-line text-sm text-zinc-300"></i>
                </div>
                <div>
                  <p className="text-lg font-black text-white leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {items.length}
                  </p>
                  <p className="text-xs text-zinc-500">obras</p>
                </div>
              </div>

              {avgRating != null && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500/20">
                    <i className="ri-star-fill text-sm text-amber-400"></i>
                  </div>
                  <div>
                    <p className="text-lg font-black text-amber-400 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {avgRating.toFixed(1)}
                    </p>
                    <p className="text-xs text-zinc-500">media</p>
                  </div>
                </div>
              )}

              {topRated && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500/20">
                    <i className="ri-trophy-line text-sm text-emerald-400"></i>
                  </div>
                  <div>
                    <p className="text-lg font-black text-emerald-400 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {(getItemRating(topRated) ?? 0).toFixed(1)}
                    </p>
                    <p className="text-xs text-zinc-500">mejor obra</p>
                  </div>
                </div>
              )}

              {careerSpan && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10">
                    <i className="ri-calendar-line text-sm text-zinc-300"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {careerSpan}
                    </p>
                    <p className="text-xs text-zinc-500">trayectoria</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
