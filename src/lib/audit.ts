import { supabase } from '@/lib/supabase';

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'link_entity'
  | 'unlink_entity';

export type AuditEntity =
  | 'profiles'
  | 'catalog_items'
  | 'entities'
  | 'item_entities'
  | 'reviews';

/**
 * Writes a record to admin_audit_logs.
 * Fire-and-forget: errors are silently swallowed so they never break the main flow.
 */
export async function auditLog(
  action: AuditAction,
  entity: AuditEntity,
  entityId: string,
  payload?: Record<string, unknown>,
): Promise<void> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const actorId = sessionData?.session?.user?.id ?? null;

    await supabase.from('admin_audit_logs').insert({
      actor_id: actorId,
      action,
      entity,
      entity_id: entityId,
      payload: payload ?? null,
    });
  } catch {
    // Intentionally silent — audit failures must never break the main operation
  }
}
