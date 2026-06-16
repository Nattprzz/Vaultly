/**
 * privacy.ts — tipos e inicializadores para la configuración de privacidad.
 *
 * Define los flags que controlan qué datos del usuario son visibles
 * en su perfil público (/u/:username). Se almacenan en la tabla `profiles`
 * y se leen desde useAuth y usePublicTracker.
 */

// ─── Tipos ─────────────────────────────────────────────────────────────
/**
 * Configuración de visibilidad del perfil público de un usuario.
 * Todos los flags son false por defecto para nuevos usuarios.
 */
export interface PublicPrivacyFlags {
  /** El perfil es accesible públicamente */
  is_public: boolean;
  /** El tracker personal es visible para visitantes */
  share_tracker: boolean;
  /** Las puntuaciones son visibles en el perfil público */
  show_ratings: boolean;
  /** Las reseñas son visibles en el perfil público */
  show_reviews: boolean;
  /** La lista de amigos es visible (pendiente de implementar) */
  show_friends?: boolean;
  /** El estado de cada ítem (jugando, completado, etc.) es visible */
  show_item_status?: boolean;
}

/**
 * Valores por defecto para un perfil completamente privado.
 * Se usa como fallback cuando el usuario no tiene configuración de privacidad guardada.
 */
export const PRIVATE_PUBLIC_FLAGS: PublicPrivacyFlags = {
  is_public: false,
  share_tracker: false,
  show_ratings: false,
  show_reviews: false,
  show_friends: false,
  show_item_status: false,
};
