/**
 * index.ts — punto de exportación del router y utilidad de navegación imperativa.
 *
 * Expone AppRoutes (componente que monta las rutas con useRoutes) y
 * navigatePromise, una promesa que se resuelve con la función navigate
 * de React Router en cuanto el árbol se monta por primera vez.
 * Esto permite disparar navegaciones desde código fuera del árbol React
 * (p.ej. servicios o manejadores de errores globales).
 */

// ─── Librerías externas ───────────────────────────────────────────────────────

import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useRoutes } from "react-router-dom";

// ─── React ───────────────────────────────────────────────────────────────────

import { useEffect } from "react";

// ─── Router ──────────────────────────────────────────────────────────────────

import routes from "./config";

// ─── Navegación imperativa ───────────────────────────────────────────────────

let navigateResolver: (navigate: ReturnType<typeof useNavigate>) => void;

declare global {
  interface Window {
    REACT_APP_NAVIGATE: ReturnType<typeof useNavigate>;
  }
}

/**
 * Promesa que se resuelve con la función navigate de React Router
 * en cuanto AppRoutes se monta por primera vez.
 */
export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});

// ─── Componente ──────────────────────────────────────────────────────────────

/**
 * Monta el árbol de rutas y expone navigate en window para uso imperativo.
 * Debe renderizarse dentro de un BrowserRouter.
 */
export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();
  useEffect(() => {
    window.REACT_APP_NAVIGATE = navigate;
    navigateResolver(window.REACT_APP_NAVIGATE);
  }, [navigate]);
  return element;
}
