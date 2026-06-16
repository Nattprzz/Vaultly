/**
 * audit.ts — escritura de registros de auditoría para el panel de administración.
 *
 * Proporciona la función auditLog que inserta entradas en admin_audit_logs.
 * Se llama de forma fire-and-forget desde operaciones de administración
 * para no interrumpir el flujo principal en caso de error.
 */

// ─── Framework ─────────────────────────────────────────────────────────
// ─── Librerías externas ──────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Tipo de acción registrada en el log de auditoría. */
export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'link_entity'
  | 'unlink_entity';

/** Entidad del dominio sobre la que se realiza la acción auditada. */
export type AuditEntity =
  | 'profiles'
  | 'catalog_items'
  | 'entities'
  | 'item_entities'
  | 'item_reports'
  | 'reviews';

/**
 * Inserta un registro de auditoría en la tabla admin_audit_logs.
 * Opera de forma fire-and-forget: los errores se silencian para no interrumpir
 * la operación principal que provocó el log.
 *
 * @param action Tipo de acción realizada.
 * @param entity Entidad del dominio afectada.
 * @param entityId Identificador del registro afectado.
 * @param metadata Datos adicionales opcionales sobre la acción.
 */
export async function auditLog(
  action: AuditAction,
  entity: AuditEntity,
  entityId: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id ?? null;

    await supabase.from('admin_audit_logs').insert({
      user_id: userId,
      action,
      entity,
      entity_id: entityId,
      metadata: metadata ?? {},
    });
  } catch {
    // Silencioso a propósito: los fallos de auditoría no deben romper la operación principal.
  }
}
