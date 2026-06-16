/**
 * index.ts — configuración e inicialización de i18next.
 *
 * Inicializa la instancia global de i18next con los recursos de traducción
 * cargados dinámicamente desde i18n/local/, el detector de idioma del navegador
 * y el plugin de integración con React. El idioma forzado a 'en' garantiza
 * que la UI muestre siempre la versión española independientemente del navegador,
 * ya que todas las cadenas visibles están en el archivo de traducción en español.
 */

// ─── Librerías externas ───────────────────────────────────────────────────────

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ─── Traducciones ─────────────────────────────────────────────────────────────

import messages from './local/index';

// ─── Configuración ───────────────────────────────────────────────────────────

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    resources: messages,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
