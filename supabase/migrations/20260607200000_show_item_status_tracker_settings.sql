-- ============================================================================
-- Nombre: show_item_status_tracker_settings.sql
-- Descripción:
-- Normaliza la preferencia de visibilidad del estado de seguimiento dentro de settings.
--
-- Tablas afectadas:
-- - profiles
--
-- Autor: Vaultly
-- ============================================================================

-- Move show_item_status from profiles to user_tracker_settings.
-- profiles never reliably had this column (initial schema ran before it was added).
-- user_tracker_settings is the correct home for tracker privacy preferences.

alter table public.user_tracker_settings
  add column if not exists show_item_status boolean not null default true;

-- Allow reading tracker settings when the profile is public
-- (previously only the owner and admins could read).
drop policy if exists "settings owner read" on public.user_tracker_settings;

create policy "settings owner or public profile read" on public.user_tracker_settings
for select using (
  user_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.profiles p
    where p.id = user_tracker_settings.user_id
      and p.is_public = true
  )
);

-- Write policy unchanged: only the owner can modify their own row.
drop policy if exists "settings owner write" on public.user_tracker_settings;

create policy "settings owner write" on public.user_tracker_settings
for all
using  (user_id = auth.uid())
with check (user_id = auth.uid());
