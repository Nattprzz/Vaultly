/**
 * animated-list.tsx — lista animada con aparición progresiva de elementos.
 *
 * AnimatedList muestra los elementos hijos uno a uno con un intervalo configurable,
 * añadiendo cada nuevo ítem con una animación de escala via Framer Motion.
 * Los ítems más recientes aparecen al principio (orden inverso).
 * Se usa en la sección de características de la landing page de Vaultly.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import React, {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
} from "react";

// ─── Librerías externas ───────────────────────────────────────────────────────

import { AnimatePresence, motion, type MotionProps } from "motion/react";

// ─── Utilidades ───────────────────────────────────────────────────────────────

import { cn } from "@/libs/utils";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  /** Ítems de la lista (se muestran progresivamente) */
  children: React.ReactNode;
  /** Intervalo en ms entre la aparición de cada ítem. Por defecto 1000ms. */
  delay?: number;
}

// ─── Componentes ─────────────────────────────────────────────────────────────

/** Envuelve un ítem individual con la animación de entrada/salida. */
export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations: MotionProps = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}

/**
 * Muestra los hijos progresivamente, añadiendo un nuevo ítem cada `delay` ms.
 * Los ítems más recientes se colocan al principio de la lista.
 */
export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    );

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null;

      if (index < childrenArray.length - 1) {
        timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
        }, delay);
      }

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout);
        }
      };
    }, [index, delay, childrenArray.length]);

    const itemsToShow = useMemo(() => {
      const result = childrenArray.slice(0, index + 1).reverse();
      return result;
    }, [index, childrenArray]);

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";
