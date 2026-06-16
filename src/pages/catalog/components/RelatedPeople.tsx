/**
 * RelatedPeople.tsx — panel de personas y estudios vinculados al ítem.
 *
 * Obtiene las entidades (directores, actores, estudios, etc.) del ítem
 * mediante useItemEntities y las agrupa por rol siguiendo un orden de
 * prioridad predefinido. Muestra un skeleton durante la carga y nada
 * si no hay entidades o no se dispone de itemId.
 * Las entidades con rol `developer`, `publisher` o `studio` son clicables
 * y enlazan a su página de compañía en `/company/:slug`.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import { ItemDetail } from '@/types/itemDetail';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useItemEntities, ROLE_CONFIG, type ItemEntity } from '@/hooks/useItemEntities';

// ─── Constantes ──────────────────────────────────────────────────────────────

/** Roles que corresponden a compañías y enlazan a `/company/:slug`. */
const COMPANY_ROLES = new Set(['developer', 'publisher', 'studio']);

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Genera un slug URL-safe a partir del nombre de una compañía.
 * Se usa como fallback cuando la entidad no tiene `slug` en base de datos.
 *
 * @param name - Nombre de la compañía (ej. "Rockstar Games").
 * @returns Slug kebab-case (ej. "rockstar-games").
 */
function generateCompanySlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/-+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del panel de personas y estudios. */
interface Props {
  item:    ItemDetail;
  itemId?: string | null;
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/**
 * Tarjeta individual de una entidad (persona o estudio).
 *
 * Si el rol es `developer`, `publisher` o `studio`, la tarjeta se renderiza
 * como un `<Link>` a `/company/:slug` con hover sutil y flecha indicativa.
 * Para el resto de roles (director, actor, etc.) se renderiza como `<div>`.
 *
 * @param entity - Datos de la entidad con rol, nombre, slug e imagen opcional.
 */
function EntityCard({ entity }: { entity: ItemEntity }) {
  const roleConf = ROLE_CONFIG[entity.role] ?? {
    label: entity.role,
    icon: 'ri-user-line',
    color: '#71717a',
    priority: 99,
  };

  const isCompany   = COMPANY_ROLES.has(entity.role);
  const companySlug = isCompany
    ? (entity.slug?.trim() || generateCompanySlug(entity.name))
    : null;

  const cardBody = (
    <>
      {/* Avatar con badge de rol */}
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700"
          style={{ background: entity.image ? undefined : `${roleConf.color}18` }}
        >
          {entity.image ? (
            <img
              src={entity.image}
              alt={entity.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className={`${roleConf.icon} text-lg`} style={{ color: roleConf.color }}></i>
            </div>
          )}
        </div>
        {/* Badge de rol superpuesto en la esquina inferior derecha */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-zinc-900"
          style={{ background: roleConf.color }}
        >
          <i className={`${roleConf.icon} text-white`} style={{ fontSize: 7 }}></i>
        </div>
      </div>

      {/* Nombre y etiqueta de rol */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-1">
          {entity.name}
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color: roleConf.color }}>
          {roleConf.label}
        </p>
      </div>

      {/* Flecha de navegación — visible en hover sólo para compañías */}
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        {isCompany && (
          <i className="ri-arrow-right-s-line text-sm text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
        )}
      </div>
    </>
  );

  if (isCompany && companySlug) {
    return (
      <Link
        to={`/company/${companySlug}`}
        aria-label={`Ver compañía ${entity.name}`}
        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        {cardBody}
      </Link>
    );
  }

  return (
    <div className="group flex items-center gap-3 p-3 rounded-xl">
      {cardBody}
    </div>
  );
}

/**
 * Skeleton de carga para el listado de entidades.
 * @param count - Número de filas de placeholder a mostrar.
 */
function EntitiesSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex-shrink-0"></div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-28"></div>
            <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Encabezado de grupo de rol con icono, etiqueta y contador.
 * @param label - Nombre del rol.
 * @param icon  - Clase de icono Remix Icon.
 * @param color - Color del rol.
 * @param count - Número de entidades en el grupo.
 */
function RoleGroupHeader({ label, icon, color, count }: { label: string; icon: string; color: string; count: number }) {
  return (
    <div className="flex items-center justify-between mb-1 px-1">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center">
          <i className={`${icon} text-sm`} style={{ color }}></i>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <span
        className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
        style={{ background: `${color}18`, color }}
      >
        {count}
      </span>
    </div>
  );
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function RelatedPeople({ item, itemId }: Props) {
  // ─── Datos derivados ──────────────────────────────────────────────────────

  const { entities, loading } = useItemEntities(itemId ?? null);
  void item;

  if (!itemId) return null;

  // ─── Renderizado ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Personas y estudios</h2>
        </div>
        <EntitiesSkeleton count={5} />
      </div>
    );
  }

  if (entities.length === 0) return null;

  const grouped = entities.reduce<Record<string, ItemEntity[]>>((acc, e) => {
    if (!acc[e.role]) acc[e.role] = [];
    acc[e.role].push(e);
    return acc;
  }, {});

  const roleOrder   = ['director', 'developer', 'author', 'artist', 'creator', 'studio', 'publisher', 'actor'];
  const sortedRoles = Object.keys(grouped).sort((a, b) => {
    const ia = roleOrder.indexOf(a);
    const ib = roleOrder.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Personas y estudios</h2>
        <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full font-medium">
          {entities.length}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {sortedRoles.map(role => {
          const conf = ROLE_CONFIG[role] ?? { label: role, icon: 'ri-user-line', color: '#71717a', priority: 99 };
          return (
            <div key={role}>
              <RoleGroupHeader
                label={conf.label}
                icon={conf.icon}
                color={conf.color}
                count={grouped[role].length}
              />
              <div className="flex flex-col">
                {grouped[role].map(entity => (
                  <EntityCard key={entity.id} entity={entity} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
