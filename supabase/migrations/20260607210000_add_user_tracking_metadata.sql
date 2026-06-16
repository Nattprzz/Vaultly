-- ============================================================================
-- Nombre: add_user_tracking_metadata.sql
-- Descripción:
-- Añade metadatos de seguimiento personalizados por usuario.
--
-- Tablas afectadas:
-- - tracker_entries
--
-- Autor: Vaultly
-- ============================================================================

alter table public.user_item_tracking
add column if not exists metadata jsonb not null default '{}'::jsonb;
