/**
 * useScrollReveal.ts — animaciones de entrada al hacer scroll.
 *
 * Devuelve una callback ref que, al asignarse a un elemento del DOM,
 * añade la clase `sr-visible` cuando el elemento entra en el viewport.
 * Usa IntersectionObserver para evitar el coste de listeners de scroll.
 * La callback ref garantiza que el observer se registre incluso cuando
 * el elemento se monta después del render inicial (p.ej. tras un loading state).
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useCallback, useRef } from 'react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/**
 * Opciones de configuración del observer de scroll reveal.
 */
interface ScrollRevealOptions {
  /** Fracción del elemento que debe ser visible para activar la animación (0-1). */
  threshold?: number;
  /** Margen respecto al viewport (formato CSS). Negativo recorta el área de intersección. */
  rootMargin?: string;
  /** Si true, la clase solo se añade una vez y el observer se desconecta. */
  once?: boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Genera una callback ref para animar un elemento al entrar en el viewport.
 *
 * Uso:
 * ```tsx
 * const ref = useScrollReveal();
 * return <div ref={ref} className="sr-hidden">...</div>;
 * ```
 *
 * @param options Opciones de configuración del IntersectionObserver.
 * @returns Callback ref para asignar al elemento del DOM.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {},
) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const disconnectRef = useRef<(() => void) | null>(null);

  return useCallback(
    (node: T | null) => {
      disconnectRef.current?.();
      disconnectRef.current = null;

      if (!node) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            node.classList.add('sr-visible');
            if (once) {
              observer.disconnect();
              disconnectRef.current = null;
            }
          } else if (!once) {
            node.classList.remove('sr-visible');
          }
        },
        { threshold, rootMargin },
      );

      observer.observe(node);
      disconnectRef.current = () => observer.disconnect();
    },
    [threshold, rootMargin, once],
  );
}
