/**
 * ErrorStatePage.tsx — pantalla de error reutilizable para 403, 404, 500 y 503.
 *
 * Componente presentacional puro: recibe código de error, textos, icono y
 * acciones, y renderiza una pantalla centrada coherente con el diseño de Vaultly.
 * No gestiona navegación interna: las acciones se pasan como props desde cada
 * página de error para que cada una controle su propia lógica de navegación.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Una acción del footer de la pantalla de error. */
export interface ErrorAction {
  /** Texto del botón. */
  label: string;
  /** Clase de icono Remix. */
  icon: string;
  /** Si se indica, el botón será un <Link> de React Router. */
  to?: string;
  /** Callback alternativo cuando no hay ruta (back, reload, etc.). */
  onClick?: () => void;
  /** 'primary' relleno oscuro/claro; 'secondary' con borde. Por defecto el primero es primary. */
  variant?: 'primary' | 'secondary';
}

interface Props {
  /** Código HTTP que identifica el tipo de error. */
  code: 403 | 404 | 500 | 503;
  /** Título principal de la pantalla. */
  title: string;
  /** Descripción extendida del error. */
  description: string;
  /** Clase de icono Remix que se muestra en el cuadro superior. */
  icon: string;
  /** Lista de acciones disponibles. El primero se trata como primario salvo que se indique variant. */
  actions: ErrorAction[];
}

// ─── Esquema de colores por código ───────────────────────────────────────────

interface ColorScheme {
  iconBg:    string;
  iconColor: string;
  badge:     string;
}

const SCHEME: Record<number, ColorScheme> = {
  403: {
    iconBg:    'bg-red-100 dark:bg-red-950/50',
    iconColor: 'text-red-500',
    badge:     'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
  },
  404: {
    iconBg:    'bg-brand/10 dark:bg-brand-dark/10',
    iconColor: 'text-brand dark:text-brand-dark',
    badge:     'bg-brand/10 dark:bg-brand-dark/10 text-brand dark:text-brand-dark',
  },
  500: {
    iconBg:    'bg-orange-100 dark:bg-orange-950/50',
    iconColor: 'text-orange-500',
    badge:     'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
  },
  503: {
    iconBg:    'bg-amber-100 dark:bg-amber-950/50',
    iconColor: 'text-amber-500',
    badge:     'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  },
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ErrorStatePage({ code, title, description, icon, actions }: Props) {
  const scheme = SCHEME[code] ?? SCHEME[500];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Gradient blobs decorativos */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand/5 dark:bg-brand-dark/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand/4 dark:bg-brand-dark/4 blur-3xl" />
      </div>

      {/* Código como marca de agua */}
      <span
        className="absolute bottom-0 inset-x-0 text-center font-black leading-none select-none pointer-events-none text-[18rem] md:text-[22rem] text-zinc-100 dark:text-zinc-900"
        aria-hidden="true"
      >
        {code}
      </span>

      {/* Tarjeta de error */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-xl shadow-zinc-200/60 dark:shadow-black/50 flex flex-col items-center gap-7 text-center">

        {/* Icono */}
        <div
          className={`w-16 h-16 flex items-center justify-center rounded-2xl flex-shrink-0 ${scheme.iconBg}`}
          aria-hidden="true"
        >
          <i className={`${icon} text-3xl ${scheme.iconColor}`}></i>
        </div>

        {/* Textos */}
        <div className="flex flex-col gap-3">
          <span className={`self-center text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${scheme.badge}`}>
            Error {code}
          </span>
          <h1
            className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2 w-full">
          {actions.map((action, i) => {
            const isPrimary = action.variant === 'primary' || (action.variant === undefined && i === 0);
            const base = 'flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer whitespace-nowrap';
            const cls = isPrimary
              ? `${base} bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 focus-visible:ring-zinc-900 dark:focus-visible:ring-white`
              : `${base} border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus-visible:ring-zinc-400`;

            if (action.to) {
              return (
                <Link key={i} to={action.to} className={cls}>
                  <i className={`${action.icon} text-sm`} aria-hidden="true"></i>
                  {action.label}
                </Link>
              );
            }
            return (
              <button key={i} type="button" onClick={action.onClick} className={cls}>
                <i className={`${action.icon} text-sm`} aria-hidden="true"></i>
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
