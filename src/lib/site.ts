/**
 * site.ts — resolución de URL pública del sitio.
 *
 * Devuelve una URL canónica estable desde variables de entorno o navegador.
 *
 * Utilizado por SEO, enlaces compartidos y metadatos.
 */

// ─── Tipos ─────────────────────────────────────────────────────────────
/**
 * Resuelve la URL pública del sitio para enlaces y metadatos.
 *
 * @returns URL base sin barra final.
 */
export function getSiteUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  const fallback = globalThis.location?.origin ?? 'http://localhost:5173';
  return (configured ?? fallback).replace(/\/$/, '');
}
