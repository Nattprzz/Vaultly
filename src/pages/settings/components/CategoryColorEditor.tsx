import { useEffect, useRef, useState } from 'react';
import { useCategoryColors } from '@/hooks/useCategoryColors';
import { DEFAULT_CATEGORY_COLORS, isValidHexColor, normalizeHexColor } from '@/lib/categoryColors';
import { CATEGORIES } from '@/lib/categoryConfig';
import type { AppCategoryId } from '@/lib/categories';
import SettingsCard from './SettingsCard';

// A small curated set of swatches per category — variations on the default
// hue plus a couple of neutral/alternate options, so users get good results
// fast without needing to know color theory.
const SUGGESTED_SWATCHES: Record<AppCategoryId, string[]> = {
  videojuegos: ['#3b82f6', '#2563eb', '#0ea5e9', '#06b6d4', '#1d4ed8'],
  peliculas:   ['#f97316', '#ea580c', '#fb923c', '#f59e0b', '#c2410c'],
  series:      ['#8b5cf6', '#7c3aed', '#a78bfa', '#6366f1', '#9333ea'],
  libros:      ['#fbbf24', '#f59e0b', '#eab308', '#facc15', '#d97706'],
  conciertos:  ['#ec4899', '#db2777', '#f472b6', '#e11d48', '#d946ef'],
};

function ColorSwatchButton({ color, selected, onClick, label }: { color: string; selected: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`relative w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 ${
        selected ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-900' : ''
      }`}
      style={{ background: color }}
    >
      {selected && <i className="ri-check-line text-white text-sm absolute inset-0 flex items-center justify-center" />}
    </button>
  );
}

function CategoryColorRow({ catId }: { catId: AppCategoryId }) {
  const { colors, isCustomized, setColor, resetColor } = useCategoryColors();
  const cat = CATEGORIES.find(c => c.id === catId)!;
  const current = colors[catId];
  const isDefault = !isCustomized(catId);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const hexInputRef = useRef<HTMLInputElement>(null);
  const [hexDraft, setHexDraft] = useState(current);
  const [hexError, setHexError] = useState(false);

  // Keep the hex field in sync when the color changes from elsewhere
  // (swatches, native picker, reset) — but never while the user is typing in it.
  useEffect(() => {
    if (document.activeElement !== hexInputRef.current) {
      setHexDraft(current);
      setHexError(false);
    }
  }, [current]);

  const commitHex = (value: string) => {
    const trimmed = value.trim();
    if (isValidHexColor(trimmed)) {
      setColor(catId, normalizeHexColor(trimmed));
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  return (
    <div className="flex flex-col gap-3 py-4 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
      <div className="flex items-center gap-3">
        {/* Preview badge — exactly how this color looks in chips/badges across the app */}
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: `${current}1a`, color: current }}
        >
          <i className={`${cat.icon} text-lg`}></i>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{cat.label}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{cat.description}</p>
        </div>
        {!isDefault && (
          <button
            type="button"
            onClick={() => { resetColor(catId); setHexDraft(DEFAULT_CATEGORY_COLORS[catId]); setHexError(false); }}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer flex-shrink-0"
          >
            <i className="ri-arrow-go-back-line text-sm"></i>
            Restaurar
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 pl-[3.25rem]">
        {/* Suggested swatches */}
        <div className="flex items-center gap-2">
          {SUGGESTED_SWATCHES[catId].map(swatch => (
            <ColorSwatchButton
              key={swatch}
              color={swatch}
              selected={current.toLowerCase() === swatch.toLowerCase()}
              onClick={() => { setColor(catId, swatch); setHexDraft(swatch); setHexError(false); }}
              label={`Usar ${swatch} para ${cat.label}`}
            />
          ))}
        </div>

        <span className="w-px h-6 bg-zinc-100 dark:bg-zinc-800 hidden sm:block"></span>

        {/* Custom color: native picker + hex input */}
        <div className="flex items-center gap-2">
          <label
            className="relative w-8 h-8 rounded-full cursor-pointer overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
            title="Elegir color personalizado"
          >
            <i className="ri-palette-line text-xs text-zinc-400"></i>
            <input
              ref={colorInputRef}
              type="color"
              value={current}
              onChange={e => { setColor(catId, e.target.value); setHexDraft(e.target.value); setHexError(false); }}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label={`Color personalizado para ${cat.label}`}
            />
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 select-none">#</span>
            <input
              ref={hexInputRef}
              type="text"
              value={hexDraft.replace(/^#/, '')}
              onChange={e => setHexDraft('#' + e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6))}
              onBlur={e => commitHex('#' + e.target.value.replace(/^#/, ''))}
              onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              maxLength={6}
              spellCheck={false}
              className={`w-24 pl-5 pr-2 py-1.5 text-xs font-mono rounded-lg border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 transition-colors ${
                hexError
                  ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-900'
                  : 'border-zinc-200 dark:border-zinc-700 focus:ring-zinc-200 dark:focus:ring-zinc-700'
              }`}
              aria-label={`Código hexadecimal para ${cat.label}`}
              aria-invalid={hexError}
            />
          </div>
          {hexError && <span className="text-xs text-red-500">Código no válido</span>}
        </div>

        {!isDefault && (
          <span className="text-[11px] uppercase tracking-wide font-medium text-zinc-400 dark:text-zinc-500 ml-auto">
            Personalizado
          </span>
        )}
      </div>
    </div>
  );
}

export default function CategoryColorEditor() {
  const { resetAll, isCustomized } = useCategoryColors();
  const anyCustomized = CATEGORIES.some(c => isCustomized(c.id));

  return (
    <SettingsCard
      title="Colores por categoría"
      description="Cada categoría tiene un color de identidad que se usa en chips, insignias, bordes y filtros activos. Personalízalo a tu gusto."
    >
      <div className="flex flex-col">
        {CATEGORIES.map(cat => <CategoryColorRow key={cat.id} catId={cat.id} />)}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Los colores se aplican en todo Vaultly: catálogo, tracker, panel y perfil.
        </p>
        <button
          type="button"
          onClick={resetAll}
          disabled={!anyCustomized}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex-shrink-0"
        >
          <i className="ri-refresh-line text-sm"></i>
          Restaurar todos los valores por defecto
        </button>
      </div>
    </SettingsCard>
  );
}
