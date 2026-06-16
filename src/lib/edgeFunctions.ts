/**
 * edgeFunctions.ts — construcción de URLs de Edge Functions.
 *
 * Centraliza la composición de endpoints desplegados en Supabase Functions.
 *
 * Utilizado por servicios cliente que invocan backend serverless.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import { SUPABASE_FUNCTIONS_URL } from '@/lib/supabaseConfig';

/**
 * Construye la URL absoluta de una Edge Function desplegada.
 *
 * @param functionName Nombre de la función en Supabase.
 * @returns Endpoint listo para peticiones HTTP.
 */
export function edgeFunctionUrl(functionName: string): string {
  return `${SUPABASE_FUNCTIONS_URL.replace(/\/$/, '')}/${functionName}`;
}
