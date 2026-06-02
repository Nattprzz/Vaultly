import { useState, useRef, useEffect } from 'react';
import { PEOPLE_MOCK, type Person } from '@/mocks/people';

const ALL_ENTITIES = Object.values(PEOPLE_MOCK);

const ROLE_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  actor: { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'ri-user-smile-line' },
  actriz: { bg: 'bg-rose-100', text: 'text-rose-700', icon: 'ri-user-heart-line' },
  'actor/actriz': { bg: 'bg-rose-100', text: 'text-rose-700', icon: 'ri-user-heart-line' },
  director: { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'ri-movie-2-line' },
  autor: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'ri-quill-pen-line' },
  desarrollador: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: 'ri-gamepad-line' },
  publisher: { bg: 'bg-violet-100', text: 'text-violet-700', icon: 'ri-building-2-line' },
  artista: { bg: 'bg-pink-100', text: 'text-pink-700', icon: 'ri-music-2-line' },
};

function getRoleStyle(role: string) {
  return ROLE_COLORS[role.toLowerCase()] ?? { bg: 'bg-zinc-100', text: 'text-zinc-600', icon: 'ri-user-line' };
}

interface EntityPickerProps {
  label: string;
  accentColor: string;
  selected: Person | null;
  onSelect: (p: Person | null) => void;
  exclude?: string;
}

function EntityPicker({ label, accentColor, selected, onSelect, exclude }: EntityPickerProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = ALL_ENTITIES.filter(e => {
    if (exclude && e.id === exclude) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q) ||
      e.nationality.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (selected) {
    const roleStyle = getRoleStyle(selected.role);
    return (
      <div
        className="flex-1 min-w-0 rounded-2xl border-2 overflow-hidden transition-all"
        style={{ borderColor: accentColor }}
      >
        {/* Header strip */}
        <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

        <div className="p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100">
            <img src={selected.photo} alt={selected.name} className="w-full h-full object-cover object-top" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {selected.name}
              </h3>
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`}>
                <i className={`${roleStyle.icon} text-xs`}></i>
                {selected.role}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">{selected.nationality} · {selected.birthYear}</p>
            <p className="text-xs text-zinc-400 mt-1">{selected.works.length} obras en catálogo</p>
          </div>
          <button
            onClick={() => onSelect(null)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-600 transition-all cursor-pointer flex-shrink-0"
          >
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex-1 min-w-0 relative">
      <div
        className="rounded-2xl border-2 border-dashed p-5 flex flex-col gap-3 transition-all"
        style={{ borderColor: `${accentColor}60` }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
            <i className="ri-user-add-line text-sm" style={{ color: accentColor }}></i>
          </div>
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{label}</span>
        </div>

        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar actor, director, autor..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
          />
        </div>

        {open && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-xl z-50 overflow-hidden">
            {results.map(entity => {
              const rs = getRoleStyle(entity.role);
              return (
                <button
                  key={entity.id}
                  onClick={() => { onSelect(entity); setOpen(false); setQuery(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                    <img src={entity.photo} alt={entity.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{entity.name}</p>
                    <p className="text-xs text-zinc-400">{entity.nationality}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${rs.bg} ${rs.text}`}>
                    <i className={`${rs.icon} text-xs`}></i>
                    {entity.role}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  entityA: Person | null;
  entityB: Person | null;
  onSelectA: (p: Person | null) => void;
  onSelectB: (p: Person | null) => void;
}

export default function CompareSelector({ entityA, entityB, onSelectA, onSelectB }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <i className="ri-scales-3-line text-zinc-600 dark:text-zinc-400"></i>
        </div>
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Selecciona dos entidades
          </h2>
          <p className="text-xs text-zinc-400">Compara su evolución de ratings a lo largo de su carrera</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <EntityPicker
          label="Entidad A"
          accentColor="#f43f5e"
          selected={entityA}
          onSelect={onSelectA}
          exclude={entityB?.id}
        />

        <div className="flex-shrink-0 flex flex-col items-center justify-center pt-8 gap-1">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <i className="ri-arrow-left-right-line text-zinc-500 text-sm"></i>
          </div>
          <span className="text-xs text-zinc-400 font-semibold">VS</span>
        </div>

        <EntityPicker
          label="Entidad B"
          accentColor="#06b6d4"
          selected={entityB}
          onSelect={onSelectB}
          exclude={entityA?.id}
        />
      </div>
    </div>
  );
}
