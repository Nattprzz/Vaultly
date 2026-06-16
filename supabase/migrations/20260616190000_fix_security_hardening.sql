-- ============================================================================
-- Nombre: fix_security_hardening.sql
-- Descripcion:
-- Migracion de reparacion idempotente para estados parciales producidos por
-- 20260616170000_security_hardening.sql.
--
-- No elimina datos. Reconstruye vistas, funciones, permisos y policies de
-- seguridad afectadas para que el hardening quede en un estado consistente.
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists public.edge_rate_limits (
  key text primary key,
  function_name text not null,
  bucket_start timestamptz not null,
  request_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_edge_rate_limits_updated_at
on public.edge_rate_limits(updated_at);

alter table public.edge_rate_limits enable row level security;

drop policy if exists "edge rate limits service only" on public.edge_rate_limits;

alter table public.profiles
  add column if not exists backdrop_url text;

create or replace function public.is_active_user()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

create or replace function public.consume_edge_rate_limit(
  p_function_name text,
  p_identifier text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text;
  v_now timestamptz := now();
  v_bucket timestamptz;
  v_count integer;
begin
  if p_function_name is null
    or p_identifier is null
    or length(trim(p_function_name)) = 0
    or length(trim(p_identifier)) = 0
    or p_limit < 1
    or p_window_seconds < 1 then
    return false;
  end if;

  v_key := encode(
    digest(p_function_name || ':' || p_identifier || ':' || p_window_seconds::text, 'sha256'),
    'hex'
  );

  insert into public.edge_rate_limits as erl (
    key,
    function_name,
    bucket_start,
    request_count,
    updated_at
  )
  values (
    v_key,
    p_function_name,
    v_now,
    1,
    v_now
  )
  on conflict (key) do update
  set
    bucket_start = case
      when erl.bucket_start <= v_now - make_interval(secs => p_window_seconds)
      then v_now
      else erl.bucket_start
    end,
    request_count = case
      when erl.bucket_start <= v_now - make_interval(secs => p_window_seconds)
      then 1
      else erl.request_count + 1
    end,
    updated_at = v_now
  returning bucket_start, request_count
  into v_bucket, v_count;

  return v_count <= p_limit;
end;
$$;

revoke all on function public.consume_edge_rate_limit(text, text, integer, integer) from public;
revoke all on function public.consume_edge_rate_limit(text, text, integer, integer) from anon;
revoke all on function public.consume_edge_rate_limit(text, text, integer, integer) from authenticated;
grant execute on function public.consume_edge_rate_limit(text, text, integer, integer) to service_role;

grant execute on function public.is_active_user() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.prevent_profile_sensitive_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id and not public.is_admin() then
    if new.role is distinct from old.role
      or new.status is distinct from old.status
      or new.email is distinct from old.email then
      raise exception 'Cannot update protected profile fields';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_sensitive_self_update on public.profiles;
create trigger prevent_profile_sensitive_self_update
before update on public.profiles
for each row execute function public.prevent_profile_sensitive_self_update();

drop policy if exists "settings owner or public profile read" on public.user_tracker_settings;

drop view if exists public.public_user_item_tracking;
drop view if exists public.public_profiles;

create view public.public_profiles
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
  show_reviews,
  backdrop_url,
  role
from public.profiles
where is_public = true
  and status = 'active';

revoke all on public.public_profiles from public;
grant select on public.public_profiles to anon, authenticated;

create view public.public_user_item_tracking
with (security_barrier = true) as
select
  t.id,
  t.user_id,
  t.item_id,
  t.item_slug,
  t.category,
  case when coalesce(s.show_item_status, true) then t.status_en else null end as status_en,
  case when p.show_ratings then t.rating else null end as rating,
  case when p.show_reviews then t.review else null end as review,
  t.created_at,
  t.updated_at
from public.user_item_tracking t
join public.profiles p on p.id = t.user_id
left join public.user_tracker_settings s on s.user_id = t.user_id
where p.status = 'active'
  and p.is_public = true
  and p.share_tracker = true;

revoke all on public.public_user_item_tracking from public;
grant select on public.public_user_item_tracking to anon, authenticated;

drop policy if exists "profiles public readable" on public.profiles;
drop policy if exists "profiles owner read" on public.profiles;
drop policy if exists "profiles owner update" on public.profiles;
drop policy if exists "profiles owner update safe fields" on public.profiles;
drop policy if exists "profiles admin manage" on public.profiles;

create policy "profiles owner read" on public.profiles
for select using (id = auth.uid() or public.is_admin());

create policy "profiles owner update safe fields" on public.profiles
for update
using (id = auth.uid() and public.is_active_user())
with check (id = auth.uid() and public.is_active_user());

create policy "profiles admin manage" on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "settings owner read" on public.user_tracker_settings;
drop policy if exists "settings owner write" on public.user_tracker_settings;
drop policy if exists "settings active owner write" on public.user_tracker_settings;
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

create policy "settings active owner write" on public.user_tracker_settings
for all
using (user_id = auth.uid() and public.is_active_user())
with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "tracking owner read" on public.user_item_tracking;
drop policy if exists "tracking owner write" on public.user_item_tracking;
drop policy if exists "tracking owner or admin read" on public.user_item_tracking;
drop policy if exists "tracking active owner insert" on public.user_item_tracking;
drop policy if exists "tracking active owner update" on public.user_item_tracking;
drop policy if exists "tracking active owner delete" on public.user_item_tracking;
drop policy if exists "tracking admin manage" on public.user_item_tracking;

create policy "tracking owner or admin read" on public.user_item_tracking
for select using (user_id = auth.uid() or public.is_admin());

create policy "tracking active owner insert" on public.user_item_tracking
for insert with check (user_id = auth.uid() and public.is_active_user());

create policy "tracking active owner update" on public.user_item_tracking
for update
using (user_id = auth.uid() and public.is_active_user())
with check (user_id = auth.uid() and public.is_active_user());

create policy "tracking active owner delete" on public.user_item_tracking
for delete using (user_id = auth.uid() and public.is_active_user());

create policy "tracking admin manage" on public.user_item_tracking
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reports user create" on public.item_reports;
drop policy if exists "reports active user create" on public.item_reports;
drop policy if exists "reports admin manage" on public.item_reports;

create policy "reports active user create" on public.item_reports
for insert with check (user_id = auth.uid() and public.is_active_user());

create policy "reports admin manage" on public.item_reports
for all using (public.is_admin()) with check (public.is_admin());
