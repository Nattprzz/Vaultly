/**
 * main.tsx — punto de entrada de la aplicación Vaultly.
 *
 * Inicializa i18next antes de montar React para garantizar que las
 * traducciones estén disponibles desde el primer render. Monta la app
 * en modo estricto sobre el elemento root del HTML.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// ─── i18n ────────────────────────────────────────────────────────────────────

import './i18n';

// ─── Estilos ─────────────────────────────────────────────────────────────────

import './index.css';

// ─── App ─────────────────────────────────────────────────────────────────────

import App from './App.tsx';

// ─── Bootstrap ───────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
