/**
 * supabaseConfig.ts — lectura y validación de variables de entorno de Supabase.
 *
 * Centraliza el acceso a las variables de entorno necesarias para conectar con Supabase.
 * Las variables requeridas lanzarán un error en tiempo de arranque si están ausentes,
 * lo que hace imposible ejecutar la aplicación en un entorno mal configurado.
 */

// ─── Tipos ─────────────────────────────────────────────────────────────
/**
 * Lee una variable de entorno obligatoria.
 * Lanza un error descriptivo si no está definida o está vacía.
 *
 * @param name Nombre de la variable de entorno.
 * @returns El valor de la variable, sin espacios al inicio ni al final.
 */
function requiredEnv(name: string): string {
  const value = import.meta.env[name] as string | undefined;
  if (!value || value.trim().length === 0) {
    throw new Error(`Falta configurar ${name}. Define esta variable en tu .env antes de iniciar Vaultly.`);
  }
  return value.trim();
}

/**
 * Lee una variable de entorno opcional.
 *
 * @param name Nombre de la variable de entorno.
 * @returns El valor de la variable o null si no está definida.
 */
function optionalEnv(name: string): string | null {
  const value = import.meta.env[name] as string | undefined;
  return value && value.trim().length > 0 ? value.trim() : null;
}

/** URL del proyecto Supabase. Obligatoria. */
export const SUPABASE_URL = requiredEnv('VITE_PUBLIC_SUPABASE_URL');

/** Clave anónima (pública) de Supabase. Obligatoria. */
export const SUPABASE_ANON_KEY = requiredEnv('VITE_PUBLIC_SUPABASE_ANON_KEY');

/**
 * URL base de las Edge Functions de Supabase.
 * Se puede sobreescribir via variable de entorno; si no se define,
 * se construye automáticamente a partir de SUPABASE_URL.
 */
export const SUPABASE_FUNCTIONS_URL =
  optionalEnv('VITE_PUBLIC_SUPABASE_FUNCTIONS_URL') ?? `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1`;
