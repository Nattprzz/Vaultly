/**
 * shine-border.tsx — borde animado con efecto de brillo giratorio.
 *
 * Crea un pseudo-borde usando radial-gradient animado con clip-path mask.
 * El color y la velocidad de la animación son configurables.
 * Se posiciona en absolute para cubrir al contenedor padre con position: relative.
 * Se usa en tarjetas de la landing page para añadir detalle visual sin afectar el layout.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import * as React from "react";

// ─── Utilidades ───────────────────────────────────────────────────────────────

import { cn } from "@/libs/utils";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grosor del borde en píxeles. Por defecto 1. */
  borderWidth?: number;
  /** Duración de la animación de brillo en segundos. Por defecto 14. */
  duration?: number;
  /** Color o array de colores del brillo (acepta cualquier valor CSS). Por defecto "#000000". */
  shineColor?: string | string[];
}

// ─── Componente ──────────────────────────────────────────────────────────────

/**
 * Superpone un borde animado de brillo sobre el contenedor padre.
 * El padre debe tener `position: relative` y `overflow: hidden`.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          backgroundImage: `radial-gradient(transparent,transparent, ${
            Array.isArray(shineColor) ? shineColor.join(",") : shineColor
          },transparent,transparent)`,
          backgroundSize: "300% 300%",
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]",
        className
      )}
      {...props}
    />
  );
}
