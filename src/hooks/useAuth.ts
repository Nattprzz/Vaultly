/**
 * useAuth.ts — re-exporta la API de autenticación desde AuthContext.
 *
 * La lógica de sesión vive en src/contexts/AuthContext.tsx (un único Provider
 * con una sola suscripción a supabase.auth.onAuthStateChange).
 * Este fichero mantiene la misma API pública que tenía antes para que
 * todos los consumidores existentes funcionen sin cambios.
 */

export type { AuthProfile, AuthState } from '@/contexts/AuthContext';
export { useAuthContext as useAuth }   from '@/contexts/AuthContext';
