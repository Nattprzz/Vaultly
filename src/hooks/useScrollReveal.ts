import { useCallback, useRef } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Returns a callback ref to attach to any element.
 * When the element enters the viewport, the class `sr-visible` is added.
 * Using a callback ref (instead of useRef + useEffect) ensures the observer
 * is set up even when the element is added to the DOM after initial mount
 * (e.g. after a loading state with an early return).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {},
) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const disconnectRef = useRef<(() => void) | null>(null);

  return useCallback(
    (node: T | null) => {
      // Disconnect any previous observer (element swapped or unmounted)
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
