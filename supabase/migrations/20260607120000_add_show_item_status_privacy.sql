-- ============================================================================
-- Nombre: add_show_item_status_privacy.sql
-- Descripción:
-- Añade una preferencia de privacidad para mostrar el estado de seguimiento de elementos.
--
-- Tablas afectadas:
-- - profiles
--
-- Autor: Vaultly
-- ============================================================================

alter table public.profiles
add column if not exists show_item_status boolean not null default true;
