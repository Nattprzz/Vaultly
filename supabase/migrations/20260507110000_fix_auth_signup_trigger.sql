-- ============================================================================
-- Nombre: fix_auth_signup_trigger.sql
-- Descripción:
-- Ajusta el trigger de alta de usuarios autenticados para crear perfiles correctamente.
--
-- Tablas afectadas:
-- - profiles
--
-- Autor: Vaultly
-- ============================================================================

create or replace function public.normalize_username(value text, fallback text)
returns text
language sql
immutable
as $$
  select coalesce(
    nullif(
      regexp_replace(
        lower(coalesce(value, fallback, 'user')),
        '[^a-z0-9_]+',
        '_',
        'g'
      ),
      ''
    ),
    'user'
  );
$$;

create or replace function public.username_available(candidate text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from public.profiles
    where username = public.normalize_username(candidate, candidate)
  );
$$;

grant execute on function public.username_available(text) to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_username text;
  raw_display_name text;
  raw_email text;
  raw_categories text[];
  allowed_categories constant text[] := array['videojuegos', 'peliculas', 'series', 'libros', 'conciertos']::text[];
begin
  raw_email := coalesce(new.email, concat(new.id::text, '@vaultly.local'));
  raw_username := public.normalize_username(
    new.raw_user_meta_data->>'username',
    split_part(raw_email, '@', 1)
  );

  if exists (select 1 from public.profiles where username = raw_username and id <> new.id) then
    raw_username := concat(raw_username, '-', left(replace(new.id::text, '-', ''), 8));
  end if;

  raw_display_name := coalesce(
    nullif(new.raw_user_meta_data->>'display_name', ''),
    replace(raw_username, '_', ' ')
  );

  select array_agg(category)
  into raw_categories
  from (
    select value as category
    from jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'selected_categories', '[]'::jsonb))
    where value = any(allowed_categories)
  ) selected;

  if raw_categories is null or array_length(raw_categories, 1) is null then
    raw_categories := array['peliculas', 'series', 'libros']::text[];
  end if;

  insert into public.profiles (id, email, username, display_name, initials)
  values (
    new.id,
    raw_email,
    raw_username,
    raw_display_name,
    coalesce(new.raw_user_meta_data->>'initials', upper(left(raw_username, 2)))
  )
  on conflict (id) do update
  set
    email = excluded.email,
    username = excluded.username,
    display_name = excluded.display_name,
    initials = excluded.initials,
    updated_at = now();

  insert into public.user_tracker_settings (user_id, selected_categories)
  values (new.id, raw_categories)
  on conflict (user_id) do update
  set
    selected_categories = excluded.selected_categories,
    updated_at = now();

  return new;
end;
$$;
