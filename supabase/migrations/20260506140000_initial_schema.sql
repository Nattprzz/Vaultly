-- Vaultly initial Supabase schema.
-- Apply with: supabase db push

create extension if not exists pgcrypto;

do $$
begin
  create type public.tracker_category as enum ('videojuegos', 'peliculas', 'series', 'libros', 'conciertos');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.tracker_status as enum ('pending', 'in_progress', 'completed', 'dropped');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text unique,
  display_name text,
  initials text,
  bio text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  status text not null default 'active' check (status in ('active', 'suspended', 'pending')),
  is_public boolean not null default true,
  show_ratings boolean not null default true,
  show_reviews boolean not null default true,
  show_item_status boolean not null default true,
  share_tracker boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_tracker_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  selected_categories text[] not null default array['peliculas', 'series', 'libros']::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint selected_categories_not_empty check (array_length(selected_categories, 1) >= 1),
  constraint selected_categories_allowed check (
    selected_categories <@ array['videojuegos', 'peliculas', 'series', 'libros', 'conciertos']::text[]
  )
);

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  category text not null check (category in ('videojuegos', 'peliculas', 'series', 'libros', 'conciertos')),
  source text not null default 'manual',
  source_item_id text,
  description text,
  image_url text,
  cover_url text,
  release_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, source, source_item_id),
  unique (category, slug)
);

create table if not exists public.user_item_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid references public.catalog_items(id) on delete set null,
  item_slug text not null,
  category text not null check (category in ('videojuegos', 'peliculas', 'series', 'libros', 'conciertos')),
  status_en text not null default 'pending' check (status_en in ('pending', 'in_progress', 'completed', 'dropped')),
  rating int check (rating between 1 and 10),
  review text,
  started_at date,
  finished_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, item_slug)
);

create table if not exists public.entities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  slug text not null unique,
  image text,
  bio text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.item_entities (
  item_id uuid not null references public.catalog_items(id) on delete cascade,
  entity_id uuid not null references public.entities(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  primary key (item_id, entity_id, role)
);

create table if not exists public.item_reports (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references public.catalog_items(id) on delete set null,
  item_slug text,
  item_title text not null default '',
  item_category text not null default '',
  item_cover text not null default '',
  user_id uuid references public.profiles(id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  resolved_at timestamptz,
  resolved_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_catalog_items_category on public.catalog_items(category);
create index if not exists idx_catalog_items_title on public.catalog_items using gin (to_tsvector('simple', title));
create index if not exists idx_tracking_user on public.user_item_tracking(user_id);
create index if not exists idx_tracking_item_slug on public.user_item_tracking(item_slug);
create index if not exists idx_entities_type on public.entities(type);
create index if not exists idx_item_reports_status on public.item_reports(status);
create index if not exists idx_admin_audit_created on public.admin_audit_logs(created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_user_tracker_settings_updated_at on public.user_tracker_settings;
create trigger set_user_tracker_settings_updated_at before update on public.user_tracker_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_catalog_items_updated_at on public.catalog_items;
create trigger set_catalog_items_updated_at before update on public.catalog_items
for each row execute function public.set_updated_at();

drop trigger if exists set_user_item_tracking_updated_at on public.user_item_tracking;
create trigger set_user_item_tracking_updated_at before update on public.user_item_tracking
for each row execute function public.set_updated_at();

drop trigger if exists set_entities_updated_at on public.entities;
create trigger set_entities_updated_at before update on public.entities
for each row execute function public.set_updated_at();

drop trigger if exists set_item_reports_updated_at on public.item_reports;
create trigger set_item_reports_updated_at before update on public.item_reports
for each row execute function public.set_updated_at();

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
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_username text;
  raw_display_name text;
begin
  raw_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  raw_display_name := coalesce(new.raw_user_meta_data->>'display_name', replace(raw_username, '_', ' '));

  insert into public.profiles (id, email, username, display_name, initials)
  values (
    new.id,
    new.email,
    raw_username,
    raw_display_name,
    coalesce(new.raw_user_meta_data->>'initials', upper(left(raw_username, 2)))
  )
  on conflict (id) do nothing;

  insert into public.user_tracker_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_tracker_settings enable row level security;
alter table public.catalog_items enable row level security;
alter table public.user_item_tracking enable row level security;
alter table public.entities enable row level security;
alter table public.item_entities enable row level security;
alter table public.item_reports enable row level security;
alter table public.admin_audit_logs enable row level security;

drop policy if exists "profiles public readable" on public.profiles;
create policy "profiles public readable" on public.profiles
for select using (is_public or id = auth.uid() or public.is_admin());

drop policy if exists "profiles owner update" on public.profiles;
create policy "profiles owner update" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists "profiles admin manage" on public.profiles;
create policy "profiles admin manage" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings owner read" on public.user_tracker_settings;
create policy "settings owner read" on public.user_tracker_settings
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "settings owner write" on public.user_tracker_settings;
create policy "settings owner write" on public.user_tracker_settings
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "catalog public read" on public.catalog_items;
create policy "catalog public read" on public.catalog_items
for select using (true);

drop policy if exists "catalog admin write" on public.catalog_items;
create policy "catalog admin write" on public.catalog_items
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tracking owner read" on public.user_item_tracking;
create policy "tracking owner read" on public.user_item_tracking
for select using (
  user_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.profiles p
    where p.id = user_item_tracking.user_id
      and p.is_public
      and p.share_tracker
  )
);

drop policy if exists "tracking owner write" on public.user_item_tracking;
create policy "tracking owner write" on public.user_item_tracking
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "entities public read" on public.entities;
create policy "entities public read" on public.entities
for select using (true);

drop policy if exists "entities admin write" on public.entities;
create policy "entities admin write" on public.entities
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "item entities public read" on public.item_entities;
create policy "item entities public read" on public.item_entities
for select using (true);

drop policy if exists "item entities admin write" on public.item_entities;
create policy "item entities admin write" on public.item_entities
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reports user create" on public.item_reports;
create policy "reports user create" on public.item_reports
for insert with check (user_id is null or user_id = auth.uid());

drop policy if exists "reports resolved public read" on public.item_reports;
create policy "reports resolved public read" on public.item_reports
for select using (status in ('resolved', 'dismissed'));

drop policy if exists "reports admin manage" on public.item_reports;
create policy "reports admin manage" on public.item_reports
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "audit admin read" on public.admin_audit_logs;
create policy "audit admin read" on public.admin_audit_logs
for select using (public.is_admin());

drop policy if exists "audit admin write" on public.admin_audit_logs;
create policy "audit admin write" on public.admin_audit_logs
for insert with check (public.is_admin());
