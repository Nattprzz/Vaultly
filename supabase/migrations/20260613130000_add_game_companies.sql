-- ============================================================================
-- Nombre: add_game_companies.sql
-- Descripción:
-- Crea la tabla de compañías de videojuegos y sus metadatos enriquecidos.
--
-- Tablas afectadas:
-- - game_companies
--
-- Autor: Vaultly
-- ============================================================================

-- ============================================================
-- Vaultly - Caché de compañías de videojuegos para páginas procedentes de IGDB
-- ============================================================

create table if not exists public.game_companies (
  id uuid primary key default gen_random_uuid(),
  igdb_id integer unique not null,
  slug text unique not null,
  name text not null,
  description text,
  logo_url text,
  country text,
  status text,
  start_date date,
  changed_date date,
  parent_company_id integer,
  parent_company_name text,
  company_size text,
  website_url text,
  twitter_url text,
  discord_url text,
  wikipedia_url text,
  linkedin_url text,
  developed_count integer not null default 0,
  published_count integer not null default 0,
  ported_count integer not null default 0,
  supported_count integer not null default 0,
  dlc_count integer not null default 0,
  cancelled_count integer not null default 0,
  average_rating numeric,
  rating_count integer not null default 0,
  popular_games jsonb not null default '[]'::jsonb,
  related_companies jsonb not null default '[]'::jsonb,
  genres jsonb not null default '[]'::jsonb,
  platforms jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_game_companies_slug on public.game_companies(slug);
create index if not exists idx_game_companies_igdb_id on public.game_companies(igdb_id);
create index if not exists idx_game_companies_name on public.game_companies(name);
create index if not exists idx_game_companies_last_synced_at on public.game_companies(last_synced_at);

drop trigger if exists set_game_companies_updated_at on public.game_companies;
create trigger set_game_companies_updated_at before update on public.game_companies
for each row execute function public.set_updated_at();

alter table public.game_companies enable row level security;

drop policy if exists "game companies public read" on public.game_companies;
create policy "game companies public read" on public.game_companies
for select using (true);

-- No insert/update/delete policies are created intentionally.
-- Edge Functions use the service role key and bypass RLS; normal users cannot mutate this cache.
