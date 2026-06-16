/**
 * supabase.ts — instancia global del cliente de Supabase.
 *
 * Crea y exporta el cliente singleton que usa toda la aplicación
 * para comunicarse con la base de datos y el sistema de autenticación.
 * Falla en arranque si las variables de entorno no están definidas.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase env vars. URL=${supabaseUrl ? 'OK' : 'MISSING'} KEY=${supabaseAnonKey ? 'OK' : 'MISSING'}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
