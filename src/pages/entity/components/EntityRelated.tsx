/**
 * EntityRelated.tsx — sección de colaboradores frecuentes de una entidad.
 *
 * Cruza los ítems de la entidad actual con los datos de `PEOPLE_MOCK` para
 * encontrar otras entidades que han trabajado en las mismas obras. Muestra las
 * obras en común, el conteo de colaboraciones y permite navegar al perfil de
 * cada colaborador. Limitado a 8 colaboradores por defecto, con "Ver más".
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useMemo, useState } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import type { EntityItem } from '@/hooks/useEntity';
import { TYPE_LABELS, TYPE_ICONS } from '@/hooks/useEntity';

// ─── Mocks ────────────────────────────────────────────────────────────────────

import { PEOPLE_MOCK } from '@/mocks/people';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del componente. */
interface Props {
  /** Lista de ítems vinculados a la entidad actual. */
  items: EntityItem[];
  /** Slug de la entidad actual (para excluirla de los resultados). */
  currentSlug: string;
}

/** Colaborador derivado del cruce con `PEOPLE_MOCK`. */
interface Collaborator {
  /** Identificador/slug del colaborador. */
  id: string;
  /** Nombre público del colaborador. */
  name: string;
  /** URL de la foto del colaborador. */
  photo: string;
  /** Rol descriptivo del colaborador (cadena libre de `PEOPLE_MOCK`). */
  role: string;
  /** IDs de los ítems compartidos. */
  sharedWorkIds: string[];
  /** Títulos de los ítems compartidos (para mostrar en la tarjeta). */
  sharedWorkTitles: string[];
  /** Número de obras en común. */
  collaborationCount: number;
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Convierte la cadena de rol de `PEOPLE_MOCK` al tipo de entidad canónico de Vaultly.
 * Usa coincidencia de subcadena en minúsculas; devuelve `'creator'` si no coincide.
 *
 * @param role - Cadena de rol libre (ej. "director de cine").
 * @returns Clave de tipo de entidad compatible con `TYPE_LABELS` y `TYPE_ICONS`.
 */
function roleToType(role: string): string {
  const r = role.toLowerCase();
  if (r.includes('director'))                          return 'director';
  if (r.includes('actor') || r.includes('actriz'))    return 'actor';
  if (r.includes('autor') || r.includes('author'))    return 'author';
  if (r.includes('artista') || r.includes('artist'))  return 'artist';
  if (r.includes('desarrollador') || r.includes('developer')) return 'developer';
  if (r.includes('publisher'))                         return 'publisher';
  return 'creator';
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function EntityRelated({ items, currentSlug }: Props) {
  // ─── Estado ───────────────────────────────────────────────────────────────

  const [showAll, setShowAll] = useState(false);

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const myItemIds = useMemo(
    () => new Set(items.map(i => i.id)),
    [items]
  );

  /** Colaboradores ordenados por número de obras en común (desc) y nombre (asc). */
  const collaborators = useMemo<Collaborator[]>(() => {
    if (myItemIds.size === 0) return [];

    const result: Collaborator[] = [];

    Object.values(PEOPLE_MOCK).forEach(person => {
      if (person.id === currentSlug) return;

      const shared = person.works.filter(w => myItemIds.has(w.id));
      if (shared.length === 0) return;

      result.push({
        id:                 person.id,
        name:               person.name,
        photo:              person.photo,
        role:               person.role,
        sharedWorkIds:      shared.map(w => w.id),
        sharedWorkTitles:   shared.map(w => w.title),
        collaborationCount: shared.length,
      });
    });

    return result.sort((a, b) =>
      b.collaborationCount - a.collaborationCount || a.name.localeCompare(b.name)
    );
  }, [myItemIds, currentSlug]);

  if (collaborators.length === 0) return null;

  const LIMIT    = 8;
  const displayed = showAll ? collaborators : collaborators.slice(0, LIMIT);
  const hasMore   = collaborators.length > LIMIT && !showAll;

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="mt-8">
      {/* Cabecera de sección */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-zinc-900 dark:text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Colaboradores frecuentes
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Personas y estudios que han trabajado en las mismas obras
          </p>
        </div>
        <span className="text-sm text-zinc-400 font-medium">
          {collaborators.length} encontrado{collaborators.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cuadrícula de colaboradores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayed.map(collab => {
          const type      = roleToType(collab.role);
          const typeIcon  = TYPE_ICONS[type]  ?? 'ri-user-line';
          const typeLabel = TYPE_LABELS[type] ?? collab.role;

          return (
            <Link
              key={collab.id}
              to={`/entity/${collab.id}`}
              className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {/* Avatar con badge de tipo */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={collab.photo}
                      alt={collab.name}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                    <i className={`${typeIcon} text-zinc-500 dark:text-zinc-400`} style={{ fontSize: 9 }}></i>
                  </div>
                </div>

                {/* Nombre y tipo */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                    {collab.name}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">{typeLabel}</p>
                </div>
              </div>

              {/* Badge de obras en común */}
              <div className="mt-3 flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                  <i className="ri-links-line text-zinc-400 text-xs"></i>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {collab.collaborationCount} obra{collab.collaborationCount !== 1 ? 's' : ''} en común
                  </span>
                </div>
              </div>

              {/* Lista de obras compartidas (máx. 2 + "X más") */}
              <div className="mt-2.5 flex flex-col gap-1">
                {collab.sharedWorkTitles.slice(0, 2).map((title, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 flex-shrink-0"></div>
                    <span className="text-xs text-zinc-400 truncate">{title}</span>
                  </div>
                ))}
                {collab.sharedWorkTitles.length > 2 && (
                  <span className="text-xs text-zinc-400 italic pl-2.5">
                    +{collab.sharedWorkTitles.length - 2} más
                  </span>
                )}
              </div>

              {/* Flecha de navegación al hover */}
              <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  Ver perfil
                  <i className="ri-arrow-right-line text-xs"></i>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Botón "Ver más colaboradores" */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line text-sm"></i>
            Ver {collaborators.length - LIMIT} colaboradores más
          </button>
        </div>
      )}
    </div>
  );
}
