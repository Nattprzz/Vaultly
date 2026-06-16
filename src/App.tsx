/**
 * App.tsx — raíz de la aplicación React de Vaultly.
 *
 * Monta los providers globales en el orden correcto:
 * I18nextProvider para las traducciones, CategoryColorsProvider para los
 * colores de categoría accesibles vía contexto, y BrowserRouter para el
 * enrutamiento del lado del cliente. La variable __BASE_PATH__ se inyecta
 * en tiempo de build por Vite para soportar subdirectorios en producción.
 */

// ─── Librerías externas ───────────────────────────────────────────────────────

import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

// ─── Router ──────────────────────────────────────────────────────────────────

import { AppRoutes } from "./router";

// ─── Componentes ──────────────────────────────────────────────────────────────

import AppErrorBoundary from "./components/feature/AppErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";

// ─── i18n ────────────────────────────────────────────────────────────────────

import i18n from "./i18n";

// ─── Contextos ───────────────────────────────────────────────────────────────

import { CategoryColorsProvider } from "./hooks/useCategoryColors";

// ─── Componente ──────────────────────────────────────────────────────────────

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AuthProvider>
          <CategoryColorsProvider>
            <AppErrorBoundary>
              <AppRoutes />
            </AppErrorBoundary>
          </CategoryColorsProvider>
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
