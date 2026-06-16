/**
 * AppearanceSection.tsx — sección de configuración de apariencia visual.
 *
 * Permite cambiar entre tema claro y oscuro, ajustar el tamaño de fuente
 * global y consulta dónde personalizar los colores de categoría. El tamaño
 * de fuente se persiste en localStorage y se aplica al documento en tiempo real.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useTheme } from '@/hooks/useTheme';

// ─── Componentes ─────────────────────────────────────────────────────────────

import SettingsCard from './SettingsCard';
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

// ─── Constantes ──────────────────────────────────────────────────────────────

/** Opciones de tema con sus estilos de previsualización miniatura. */
const THEME_OPTIONS = [
  {
    id:           'light',
    label:        'Claro',
    icon:         'ri-sun-line',
    preview:      'bg-white border-zinc-200',
    previewInner: 'bg-zinc-100',
    previewText:  'text-zinc-800',
  },
  {
    id:           'dark',
    label:        'Oscuro',
    icon:         'ri-moon-line',
    preview:      'bg-zinc-900 border-zinc-700',
    previewInner: 'bg-zinc-800',
    previewText:  'text-zinc-200',
  },
];

/** Opciones de tamaño de fuente con su clase de muestra. */
const FONT_SIZES = [
  { id: 'sm',   label: 'Pequeño', sample: 'text-xs'   },
  { id: 'base', label: 'Normal',  sample: 'text-sm'   },
  { id: 'lg',   label: 'Grande',  sample: 'text-base' },
];

/** Mapeo de tamaño de fuente a píxeles reales para `document.documentElement`. */
const FONT_SIZE_PX: Record<string, string> = { sm: '14px', base: '16px', lg: '18px' };

// ─── Componente ──────────────────────────────────────────────────────────────

export default function AppearanceSection() {
  const { theme, toggleTheme } = useTheme();

  // ─── Estado ───────────────────────────────────────────────────────────────

  const [savedFont, setSavedFont] = useState(() => localStorage.getItem('vaultly-font-size') ?? 'base');
  const [fontSaved, setFontSaved] = useState(false);

  // ─── Efectos ──────────────────────────────────────────────────────────────

  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZE_PX[savedFont] ?? '16px';
  }, [savedFont]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  /** Aplica el tamaño de fuente seleccionado y confirma visualmente con feedback. */
  const setFont = (id: string) => {
    if (id === savedFont) return;
    localStorage.setItem('vaultly-font-size', id);
    setSavedFont(id);
    setFontSaved(true);
    setTimeout(() => setFontSaved(false), 2000);
  };

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Selector de tema */}
      <SettingsCard title="Tema" description="Elige entre modo claro u oscuro para la interfaz.">
        <div className="grid grid-cols-2 gap-4">
          {THEME_OPTIONS.map(opt => {
            const isActive = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => { if (theme !== opt.id) toggleTheme(); }}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-zinc-900 dark:border-white'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                }`}
              >
                {/* Previsualización miniatura del tema */}
                <div className={`w-full h-20 rounded-lg border ${opt.preview} flex flex-col gap-1.5 p-2 overflow-hidden`}>
                  <div className={`h-2 w-16 rounded-full ${opt.previewInner}`}></div>
                  <div className={`h-2 w-10 rounded-full ${opt.previewInner} opacity-60`}></div>
                  <div className="flex gap-1 mt-1">
                    <div className={`h-6 w-8 rounded ${opt.previewInner}`}></div>
                    <div className={`h-6 w-8 rounded ${opt.previewInner} opacity-60`}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <i className={`${opt.icon} text-sm text-zinc-600 dark:text-zinc-400`}></i>
                  <span className={`text-sm font-semibold ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                    {opt.label}
                  </span>
                </div>
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white">
                    <i className="ri-check-line text-white dark:text-zinc-900 text-xs"></i>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3">
          Tu preferencia se guarda en este dispositivo y se aplica al instante en toda la aplicación.
        </p>
      </SettingsCard>

      {/* Enlace informativo a la sección de colores de categoría */}
      <SettingsCard
        title="Colores de categoría"
        description="El color de acento de Vaultly varía según la categoría (videojuegos, películas, series, libros, conciertos) para ayudarte a distinguirlas de un vistazo."
      >
        <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
          <i className="ri-palette-line text-zinc-400 text-base mt-0.5 flex-shrink-0"></i>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Puedes personalizar el color de cada categoría — se usa en chips, insignias, bordes y filtros activos en todo Vaultly.
            Ve a la pestaña <span className="font-semibold text-zinc-900 dark:text-white">Categorías</span> en el menú lateral para editarlos.
          </p>
        </div>
      </SettingsCard>

      {/* Selector de tamaño de fuente */}
      <SettingsCard title="Tamaño de texto" description="Ajusta el tamaño de la fuente en la interfaz.">
        <div className="flex items-center gap-3">
          {FONT_SIZES.map(fs => (
            <button
              key={fs.id}
              onClick={() => setFont(fs.id)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all cursor-pointer ${
                savedFont === fs.id
                  ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
              }`}
            >
              <span className={`font-semibold text-zinc-900 dark:text-white ${fs.sample}`}>Aa</span>
              <span className="text-xs text-zinc-500">{fs.label}</span>
            </button>
          ))}
        </div>
        {fontSaved && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-500 mt-3">
            <i className="ri-checkbox-circle-line"></i>
            Tamaño aplicado
          </p>
        )}
      </SettingsCard>
    </div>
  );
}
