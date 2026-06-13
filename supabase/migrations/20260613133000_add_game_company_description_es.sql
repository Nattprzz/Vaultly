-- Add optional Spanish description for imported IGDB game companies.

alter table public.game_companies
  add column if not exists description_es text;
