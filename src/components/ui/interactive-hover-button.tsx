/**
 * interactive-hover-button.tsx — envoltorio de animación para CTAs de Vaultly.
 *
 * Implementa el efecto InteractiveHoverButton de Magic UI adaptado a los estilos
 * existentes de Vaultly. En hover: el contenido desliza hacia fuera, un círculo
 * opcional se expande cubriendo el fondo y el mismo contenido (con flecha opcional)
 * aparece desde el lado contrario. El componente es transparente en estilos: añade
 * únicamente `group relative overflow-hidden` y anima el contenido interno.
 *
 * Exporta:
 *  - `InteractiveHoverButton` — envuelve un `<button>` nativo.
 *  - `InteractiveHoverLink`   — envuelve un `<Link>` de React Router.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import type { ComponentPropsWithoutRef } from 'react';

// ─── Librerías externas ───────────────────────────────────────────────────────

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Utilidades ───────────────────────────────────────────────────────────────

import { cn } from '@/libs/utils';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props de animación compartidas por `InteractiveHoverButton` e `InteractiveHoverLink`. */
interface AnimationProps {
  /**
   * Clase Tailwind del color del círculo expansivo.
   * Debe coincidir con el color hover del botón (ej. `"bg-blue-500"`).
   * Si se omite, no se renderiza el círculo — sólo se anima el texto.
   */
  fillClassName?: string;
  /**
   * Muestra un `<ArrowRight />` de 16 px junto al texto en el estado hover.
   * Usar `false` en botones que ya tienen su propio icono de flecha o acción.
   * @default true
   */
  showArrow?: boolean;
}

// ─── Sub-componentes internos ─────────────────────────────────────────────────

/**
 * Texto que sale en hover + texto que entra.
 * Reutilizado por ambos componentes exportados.
 */
function AnimatedContent({
  children,
  showArrow,
}: {
  children: React.ReactNode;
  showArrow: boolean;
}) {
  return (
    <>
      <span className="relative z-10 inline-flex items-center justify-center gap-2 transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0">
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 -translate-x-10 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
      >
        {children}
        {showArrow && <ArrowRight className="h-4 w-4 flex-shrink-0" />}
      </span>
    </>
  );
}

/**
 * Círculo que se expande desde el centro para cubrir el fondo del botón.
 * `scale-[40]` sobre un dot de 12 px genera un radio de 240 px,
 * suficiente para cubrir cualquier CTA de Vaultly.
 */
function ExpandingDot({ fillClassName }: { fillClassName: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full scale-0 transition-transform duration-500 ease-out group-hover:scale-[40]',
        fillClassName,
      )}
    />
  );
}

// ─── InteractiveHoverButton ───────────────────────────────────────────────────

/**
 * Envoltorio de animación para elementos `<button>`.
 *
 * Añade `group relative overflow-hidden` y anima el contenido.
 * El resto de clases, manejadores y atributos se pasan al `<button>` sin cambios.
 *
 * @param fillClassName - Clase del color del círculo expansivo.
 * @param showArrow     - Muestra flecha `<ArrowRight />` en hover. Default `true`.
 */
export function InteractiveHoverButton({
  children,
  className,
  fillClassName,
  showArrow = true,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & AnimationProps) {
  return (
    <button
      className={cn('group relative overflow-hidden', className)}
      {...props}
    >
      {fillClassName && <ExpandingDot fillClassName={fillClassName} />}
      <AnimatedContent showArrow={showArrow}>{children}</AnimatedContent>
    </button>
  );
}

// ─── InteractiveHoverLink ─────────────────────────────────────────────────────

/**
 * Envoltorio de animación para enlaces React Router `<Link>`.
 *
 * Añade `group relative overflow-hidden` y anima el contenido.
 * El `to`, clases y demás props se pasan al `<Link>` sin cambios.
 *
 * @param fillClassName - Clase del color del círculo expansivo.
 * @param showArrow     - Muestra flecha `<ArrowRight />` en hover. Default `true`.
 */
export function InteractiveHoverLink({
  children,
  className,
  fillClassName,
  showArrow = true,
  ...props
}: ComponentPropsWithoutRef<typeof Link> & AnimationProps) {
  return (
    <Link
      className={cn('group relative overflow-hidden', className)}
      {...props}
    >
      {fillClassName && <ExpandingDot fillClassName={fillClassName} />}
      <AnimatedContent showArrow={showArrow}>{children}</AnimatedContent>
    </Link>
  );
}
