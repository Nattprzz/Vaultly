/**
 * CategoriesSection.tsx — sección de configuración de categorías activas.
 *
 * Muestra un selector de tarjetas para activar o desactivar cada categoría
 * del tracker y catálogo. Garantiza que siempre haya al menos una activa.
 * Incluye el editor de colores por categoría y un resumen visual del estado
 * actual con los colores personalizados del usuario.
 */

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useSettings }   from '@/hooks/useSettings';
import { useCategories } from '@/hooks/useCategoryColors';

// ─── Componentes ─────────────────────────────────────────────────────────────

import SettingsCard         from './SettingsCard';
import CategoryColorEditor  from './CategoryColorEditor';

// ─── Componente ──────────────────────────────────────────────────────────────

export default function CategoriesSection() {
  const { settings, toggleCategory } = useSettings();
  const categories = useCategories();

  return (
    <div className="flex flex-col gap-6">
      {/* Selector de categorías activas */}
      <SettingsCard
        title="Categorías activas"
        description="Selecciona qué categorías quieres ver en tu tracker, en el catálogo y en el navbar. Debes tener al menos una activa."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map(cat => {
            const isActive = settings.activeCategories.includes(cat.id);
            const isLast   = isActive && settings.activeCategories.length === 1;
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                disabled={isLast}
                className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                  isActive
                    ? 'border-transparent'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 opacity-60'
                } ${isLast ? 'cursor-not-allowed' : ''}`}
                style={isActive ? { borderColor: cat.accent, background: `${cat.accent}10` } : {}}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: `${cat.accent}1f`, color: cat.accent }}
                >
                  <i className={`${cat.icon} text-xl`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-zinc-900 dark:text-white text-sm">{cat.label}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{cat.description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isActive ? 'border-transparent' : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                  style={isActive ? { background: cat.accent } : {}}
                >
                  {isActive && <i className="ri-check-line text-white text-xs"></i>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-start gap-2">
          <i className="ri-information-line text-zinc-400 text-sm mt-0.5 flex-shrink-0"></i>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Las categorías desactivadas no aparecerán en tu tracker, en tu catálogo personalizado ni en el menú de navegación. Puedes volver a activarlas cuando quieras.
          </p>
        </div>
      </SettingsCard>

      {/* Editor de colores por categoría */}
      <CategoryColorEditor />

      {/* Resumen visual con los colores actuales */}
      <SettingsCard title="Resumen de tu tracker" description="Así se ven tus categorías activas con tus colores actuales.">
        <div className="flex flex-wrap gap-2">
          {categories.filter(cat => settings.activeCategories.includes(cat.id)).map(cat => (
            <div
              key={cat.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: `${cat.accent}1a`, color: cat.accent }}
            >
              <i className={`${cat.icon} text-sm`}></i>
              {cat.label}
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-400 mt-3">
          {settings.activeCategories.length} de {categories.length} categorías activas
        </p>
      </SettingsCard>
    </div>
  );
}
