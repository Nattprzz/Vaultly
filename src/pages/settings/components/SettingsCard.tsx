/**
 * SettingsCard.tsx — tarjeta contenedora reutilizable para secciones de ajustes.
 *
 * Proporciona una cabecera con título y descripción opcional, y un cuerpo
 * para el contenido de cada sección de configuración. Exporta también
 * ToggleRow, un componente de fila con interruptor para opciones booleanas.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { ReactNode } from 'react';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props de la tarjeta contenedora de ajustes. */
interface Props {
  title:        string;
  description?: string;
  children:     ReactNode;
}

/** Props de la fila con interruptor toggle. */
interface ToggleRowProps {
  label:        string;
  description?: string;
  checked:      boolean;
  onChange:     (v: boolean) => void;
  disabled?:    boolean;
}

// ─── Componentes ─────────────────────────────────────────────────────────────

export default function SettingsCard({ title, description, children }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="font-bold text-zinc-900 dark:text-white text-base">{title}</h3>
        {description && <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/** Fila horizontal con etiqueta, descripción opcional e interruptor toggle. */
export function ToggleRow({ label, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-white">{label}</p>
        {description && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
          checked ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-700'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
            checked ? 'translate-x-5 bg-white dark:bg-zinc-900' : 'translate-x-0 bg-white dark:bg-zinc-400'
          }`}
        ></span>
      </button>
    </div>
  );
}
