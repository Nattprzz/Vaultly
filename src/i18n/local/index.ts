/**
 * index.ts — cargador dinámico de archivos de traducción.
 *
 * Carga todos los archivos *.ts dentro de los subdirectorios de locale
 * (p.ej. en/, es/) usando import.meta.glob de Vite y los combina en el
 * objeto de recursos que espera i18next. El nombre del directorio es el
 * código de idioma (en, es, etc.) y cada archivo dentro contribuye
 * sus claves al namespace "translation" de ese idioma.
 */

// ─── Carga dinámica de módulos ───────────────────────────────────────────────

const modules = import.meta.glob('./*/*.ts', { eager: true });

const messages: Record<string, { translation: Record<string, string> }> = {};

Object.keys(modules).forEach((path) => {
  const match = path.match(/\.\/([^/]+)\/([^/]+)\.ts$/);
  if (match) {
    const [, lang] = match;
    const module = modules[path] as { default?: Record<string, string> };

    if (!messages[lang]) {
      messages[lang] = { translation: {} };
    }

    if (module.default) {
      messages[lang].translation = {
        ...messages[lang].translation,
        ...module.default
      };
    }
  }
});

export default messages;
