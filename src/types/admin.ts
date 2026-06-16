/**
 * admin.ts — tipos compartidos del panel de administración.
 *
 * Define las uniones de tipos que representan estados de moderación.
 * Se utiliza en los hooks de administración y en los componentes de reportes.
 */

// ─── Tipos ─────────────────────────────────────────────────────────────
/** Estado posible de un reporte de contenido enviado por un usuario. */
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';
