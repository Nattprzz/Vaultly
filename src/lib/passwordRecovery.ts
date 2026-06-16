/**
 * passwordRecovery.ts — estado temporal del flujo de recuperación.
 *
 * Supabase crea una sesión efímera al abrir el enlace de recuperación.
 * Esta marca permite distinguirla de un inicio de sesión normal y evitar
 * redirecciones automáticas al dashboard antes de cambiar la contraseña.
 */

// ─── Constantes ──────────────────────────────────────────────────────────────

const PASSWORD_RECOVERY_KEY = 'vaultly-password-recovery';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Marca el navegador actual como dentro del flujo de recuperación.
 */
export function markPasswordRecoveryPending() {
  sessionStorage.setItem(PASSWORD_RECOVERY_KEY, 'true');
}

/**
 * Indica si el navegador actual está completando una recuperación.
 */
export function isPasswordRecoveryPending() {
  return sessionStorage.getItem(PASSWORD_RECOVERY_KEY) === 'true';
}

/**
 * Limpia la marca temporal al terminar o cancelar el flujo.
 */
export function clearPasswordRecoveryPending() {
  sessionStorage.removeItem(PASSWORD_RECOVERY_KEY);
}

/**
 * Ruta pública donde se completa el cambio de contraseña.
 */
export const PASSWORD_RECOVERY_ROUTE = '/reset-password';
