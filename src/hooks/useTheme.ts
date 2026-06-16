/**
 * useTheme.ts — modo de color de la interfaz (claro / oscuro).
 *
 * Lee la preferencia del sistema al inicializar y persiste el tema elegido
 * por el usuario en localStorage. Aplica la clase `dark` al elemento
 * raíz del documento para activar el modo oscuro de Tailwind.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Modo de color disponible en la aplicación. */
export type Theme = 'light' | 'dark';

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Clave de localStorage para persistir la preferencia de tema. */
const STORAGE_KEY = 'vaultly-theme';
const THEME_CHANGE_EVENT = 'vaultly-theme-change';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Obtiene el tema inicial desde localStorage o desde la preferencia del sistema.
 */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored) return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Gestiona el tema visual de la aplicación.
 *
 * Responsabilidades:
 * - Inicializar el tema desde localStorage o la preferencia del sistema.
 * - Aplicar/retirar la clase `dark` en el elemento raíz al cambiar el tema.
 * - Persistir la preferencia en localStorage.
 */
export function useTheme() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const syncTheme = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail;
      if (nextTheme === 'light' || nextTheme === 'dark') {
        setTheme(nextTheme);
      }
    };

    const syncStorageTheme = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === 'light' || event.newValue === 'dark') {
        setTheme(event.newValue);
      }
    };

    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    window.addEventListener('storage', syncStorageTheme);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
      window.removeEventListener('storage', syncStorageTheme);
    };
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  /** Alterna entre modo claro y oscuro. */
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
