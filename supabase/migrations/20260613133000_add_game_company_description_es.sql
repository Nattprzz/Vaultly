-- ============================================================================
-- Nombre: add_game_company_description_es.sql
-- Descripción:
-- Añade descripción en español para compañías de videojuegos.
--
-- Tablas afectadas:
-- - game_companies
--
-- Autor: Vaultly
-- ============================================================================

-- Add optional Spanish description for imported IGDB game companies.

alter table public.game_companies
  add column if not exists description_es text;
