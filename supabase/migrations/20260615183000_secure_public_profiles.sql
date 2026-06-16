-- ============================================================================
-- Nombre: secure_public_profiles.sql
-- Descripción:
-- Separa la lectura pública de perfiles de los datos privados almacenados en profiles.
--
-- Crea una vista segura para perfiles públicos y endurece las políticas RLS
-- de profiles para que email, role y status solo sean accesibles por el propio
-- usuario o por administradores.
--
-- Tablas afectadas:
-- - profiles
-- - user_tracker_settings
--
-- Autor: Vaultly
-- ============================================================================

create or replace view public.public_profiles
with (security_barrier = true) as
select
  id,
  username,
  display_name,
  initials,
  bio,
  avatar_url,
  is_public,
  share_tracker,
  show_ratings,
  show_reviews
from public.profiles
where is_public = true;

revoke all on public.public_profiles from public;
grant select on public.public_profiles to anon, authenticated;

drop policy if exists "profiles public readable" on public.profiles;
drop policy if exists "profiles owner read" on public.profiles;

create policy "profiles owner read" on public.profiles
for select using (
  id = auth.uid()
);

drop policy if exists "settings owner or public profile read" on public.user_tracker_settings;

create policy "settings owner or public profile read" on public.user_tracker_settings
for select using (
  user_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.public_profiles p
    where p.id = user_tracker_settings.user_id
  )
);
