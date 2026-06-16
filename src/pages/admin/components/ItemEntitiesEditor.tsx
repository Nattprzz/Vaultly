/**
 * ItemEntitiesEditor.tsx — editor de entidades vinculadas a un ítem del catálogo.
 *
 * Permite buscar entidades (personas/estudios) con debounce de 350 ms y vincularlas
 * a un ítem del catálogo con un rol específico. Muestra las entidades ya vinculadas
 * agrupadas por rol en el orden canónico definido por `roleOrder`. Cada chip incluye
 * un botón de desvinculación visible al pasar el cursor.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAdminItemEntities, AVAILABLE_ROLES, type EntitySearchResult } from '@/hooks/useAdminItemEntities';
import { ROLE_CONFIG } from '@/hooks/useItemEntities';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del componente principal. */
interface Props {
  /** ID del ítem de catálogo cuyas entidades se gestionan. */
  itemId: string;
}

/** Props del selector de roles. */
interface RoleSelectorProps {
  /** Rol actualmente seleccionado. */
  value: string;
  /** Callback al cambiar la selección. */
  onChange: (v: string) => void;
}

/** Props de la fila de resultado de búsqueda. */
interface SearchResultRowProps {
  /** Entidad encontrada en la búsqueda. */
  entity: EntitySearchResult;
  /** Rol que se asignará al vincular. */
  selectedRole: string;
  /** Callback que recibe el ID de la entidad a vincular. */
  onLink: (entityId: string) => void;
  /** Indica si hay una vinculación en curso (deshabilita el botón). */
  linking: boolean;
}

/** Props del chip de entidad vinculada. */
interface LinkedEntityChipProps {
  /** Nombre de la entidad. */
  name: string;
  /** URL de la imagen de la entidad, o `null` si no tiene. */
  image: string | null;
  /** Tipo de entidad (coincide con clave de `ROLE_CONFIG`). */
  type: string;
  /** Rol asignado al ítem (coincide con clave de `ROLE_CONFIG`). */
  role: string;
  /** Callback para desvincular esta entidad. */
  onUnlink: () => void;
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/**
 * Cuadrícula de 4 columnas para elegir el rol de la próxima vinculación.
 *
 * @param value    - Rol actualmente seleccionado.
 * @param onChange - Callback al seleccionar un rol distinto.
 */
function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {AVAILABLE_ROLES.map(r => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all cursor-pointer ${
            value === r.value
              ? 'border-white/30 bg-white/10'
              : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700'
          }`}
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className={`${r.icon} text-xs`} style={{ color: r.color }}></i>
          </div>
          <span className="text-[10px] text-zinc-300 leading-tight">{r.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Fila de resultado de búsqueda con avatar, nombre, tipo/slug y botón "Vincular".
 *
 * @param entity       - Entidad encontrada.
 * @param selectedRole - Rol que se usará al vincular.
 * @param onLink       - Callback con el ID de la entidad a vincular.
 * @param linking      - Bloquea el botón mientras hay una vinculación en curso.
 */
function SearchResultRow({ entity, selectedRole, onLink, linking }: SearchResultRowProps) {
  const roleConf = ROLE_CONFIG[entity.type] ?? ROLE_CONFIG['creator'];

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
        {entity.image ? (
          <img src={entity.image} alt={entity.name} className="w-full h-full object-cover object-top" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `${roleConf?.color ?? '#71717a'}20` }}
          >
            <i className={`${roleConf?.icon ?? 'ri-user-line'} text-sm`} style={{ color: roleConf?.color ?? '#71717a' }}></i>
          </div>
        )}
      </div>

      {/* Nombre y tipo */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{entity.name}</p>
        <p className="text-xs text-zinc-500 truncate">{entity.type} · {entity.slug}</p>
      </div>

      {/* Botón de vinculación */}
      <button
        onClick={() => onLink(entity.id)}
        disabled={linking}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-bold hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
      >
        {linking ? (
          <div className="w-3 h-3 border border-zinc-400 border-t-zinc-900 rounded-full animate-spin"></div>
        ) : (
          <i className="ri-link text-xs"></i>
        )}
        Vincular
      </button>
    </div>
  );
}

/**
 * Chip de entidad ya vinculada con avatar, nombre, badge de rol y botón de desvinculación.
 * El botón de desvinculación solo es visible cuando el cursor está sobre el chip.
 *
 * @param name     - Nombre de la entidad.
 * @param image    - URL de la imagen o `null`.
 * @param type     - Tipo de entidad para derivar el icono del avatar sin imagen.
 * @param role     - Rol asignado para mostrar el badge de color.
 * @param onUnlink - Callback al pulsar el botón de desvinculación.
 */
function LinkedEntityChip({ name, image, type, role, onUnlink }: LinkedEntityChipProps) {
  const roleConf = ROLE_CONFIG[role] ?? ROLE_CONFIG['creator'];
  const typeConf = ROLE_CONFIG[type] ?? roleConf;

  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 group">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover object-top" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `${typeConf.color}20` }}
          >
            <i className={`${typeConf.icon} text-xs`} style={{ color: typeConf.color }}></i>
          </div>
        )}
      </div>

      {/* Nombre y badge de rol */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate">{name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <div className="w-3 h-3 flex items-center justify-center">
            <i className={`${roleConf.icon} text-[10px]`} style={{ color: roleConf.color }}></i>
          </div>
          <span className="text-[10px] font-medium" style={{ color: roleConf.color }}>
            {roleConf.label}
          </span>
        </div>
      </div>

      {/* Botón de desvinculación (visible al hover) */}
      <button
        onClick={onUnlink}
        className="w-6 h-6 flex items-center justify-center rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 flex-shrink-0"
        title="Desvincular"
      >
        <i className="ri-close-line text-xs"></i>
      </button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ItemEntitiesEditor({ itemId }: Props) {
  const {
    linked, loadingLinked,
    searchResults, searching,
    linking, error, setError,
    searchEntities,
    linkEntity,
    unlinkEntity,
  } = useAdminItemEntities(itemId);

  // ─── Estado ───────────────────────────────────────────────────────────────

  const [query,        setQuery]        = useState('');
  const [selectedRole, setSelectedRole] = useState('actor');
  const [showSearch,   setShowSearch]   = useState(false);
  const [toast,        setToast]        = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef   = useRef<HTMLDivElement>(null);

  // ─── Efectos ──────────────────────────────────────────────────────────────

  /** Lanza la búsqueda con debounce de 350 ms cuando `query` cambia. */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => searchEntities(query), 350);
    } else {
      searchEntities('');
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, searchEntities]);

  /** Cierra el desplegable de búsqueda al hacer clic fuera del contenedor. */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /** Convierte errores del hook en toasts temporales de 3 segundos. */
  useEffect(() => {
    if (error) {
      setToast({ msg: error, type: 'err' });
      setError(null);
      setTimeout(() => setToast(null), 3000);
    }
  }, [error, setError]);

  // ─── Datos derivados ──────────────────────────────────────────────────────

  /** Entidades vinculadas agrupadas por rol para renderizar por secciones. */
  const groupedLinked = linked.reduce<Record<string, typeof linked>>((acc, e) => {
    if (!acc[e.role]) acc[e.role] = [];
    acc[e.role].push(e);
    return acc;
  }, {});

  /** Orden canónico de roles; los roles desconocidos se colocan al final. */
  const roleOrder   = ['director', 'developer', 'author', 'artist', 'creator', 'studio', 'publisher', 'actor'];
  const sortedRoles = Object.keys(groupedLinked).sort((a, b) => {
    const ia = roleOrder.indexOf(a);
    const ib = roleOrder.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────

  /**
   * Vincula una entidad al ítem con el rol actualmente seleccionado.
   * Muestra toast de éxito y limpia el campo de búsqueda.
   *
   * @param entityId - ID de la entidad a vincular.
   */
  const handleLink = async (entityId: string) => {
    const ok = await linkEntity(entityId, selectedRole);
    if (ok) {
      setToast({ msg: 'Entidad vinculada correctamente', type: 'ok' });
      setTimeout(() => setToast(null), 2500);
      setQuery('');
      setShowSearch(false);
    }
  };

  /**
   * Desvincula una entidad del ítem.
   *
   * @param entityId - ID de la entidad.
   * @param role     - Rol bajo el que está vinculada.
   */
  const handleUnlink = async (entityId: string, role: string) => {
    await unlinkEntity(entityId, role);
  };

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      {/* Cabecera de sección */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-user-star-line text-sm text-zinc-400"></i>
          </div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Entidades vinculadas
          </span>
          {linked.length > 0 && (
            <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full font-medium">
              {linked.length}
            </span>
          )}
        </div>
      </div>

      {/* Toast de confirmación / error */}
      {toast && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
          toast.type === 'ok'
            ? 'bg-emerald-900/50 border border-emerald-800 text-emerald-300'
            : 'bg-red-900/50 border border-red-800 text-red-300'
        }`}>
          <i className={toast.type === 'ok' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'}></i>
          {toast.msg}
        </div>
      )}

      {/* Selector de rol para la próxima vinculación */}
      <div>
        <p className="text-xs text-zinc-500 mb-2">Rol para la próxima vinculación:</p>
        <RoleSelector value={selectedRole} onChange={setSelectedRole} />
      </div>

      {/* Buscador de entidades con desplegable */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></i>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            placeholder="Buscar entidad por nombre..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Resultados del desplegable */}
        {showSearch && query.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl z-30 overflow-hidden max-h-64 overflow-y-auto">
            {searching && searchResults.length === 0 ? (
              <div className="px-4 py-3 text-xs text-zinc-500 text-center">Buscando...</div>
            ) : searchResults.length === 0 ? (
              <div className="px-4 py-3 text-xs text-zinc-500 text-center">
                Sin resultados — prueba otro nombre o crea la entidad primero
              </div>
            ) : (
              <div className="p-2 flex flex-col gap-1.5">
                {searchResults.map(entity => (
                  <SearchResultRow
                    key={entity.id}
                    entity={entity}
                    selectedRole={selectedRole}
                    onLink={handleLink}
                    linking={linking}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de entidades vinculadas agrupadas por rol */}
      {loadingLinked ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 rounded-xl bg-zinc-800 animate-pulse"></div>
          ))}
        </div>
      ) : linked.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 border border-dashed border-zinc-700 rounded-xl">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800">
            <i className="ri-user-star-line text-zinc-600 text-sm"></i>
          </div>
          <p className="text-xs text-zinc-600 text-center">
            Sin entidades vinculadas todavía.<br />Busca y añade directores, actores, desarrolladores...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedRoles.map(role => (
            <div key={role}>
              {/* Etiqueta de grupo por rol */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i
                    className={`${ROLE_CONFIG[role]?.icon ?? 'ri-user-line'} text-xs`}
                    style={{ color: ROLE_CONFIG[role]?.color ?? '#71717a' }}
                  ></i>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {ROLE_CONFIG[role]?.label ?? role}
                </span>
                <span className="text-[10px] text-zinc-700">({groupedLinked[role].length})</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {groupedLinked[role].map(e => (
                  <LinkedEntityChip
                    key={e.linkId}
                    name={e.name}
                    image={e.image}
                    type={e.type}
                    role={e.role}
                    onUnlink={() => handleUnlink(e.entityId, e.role)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
