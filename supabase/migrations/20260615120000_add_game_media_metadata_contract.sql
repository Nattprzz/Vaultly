-- ============================================================================
-- Nombre: add_game_media_metadata_contract.sql
-- Descripcion:
-- Documenta y optimiza el contrato JSONB de videojuegos dentro de catalog_items.metadata.
-- No cambia columnas existentes ni migra datos antiguos; mantiene compatibilidad
-- con el cache actual y permite guardar imagenes, trailers, mapas externos y
-- juegos relacionados dentro de metadata.
--
-- Tablas afectadas:
-- - catalog_items
--
-- Autor: Vaultly
-- ============================================================================

comment on column public.catalog_items.metadata is
'Metadatos JSONB por categoria. Para videojuegos puede incluir screenshots, artworks, trailers, interactive_map_url, interactive_map_source, themes, franchise_name y related_games.';

create index if not exists idx_catalog_items_game_metadata_media
on public.catalog_items
using gin (metadata jsonb_path_ops)
where category = 'videojuegos';

create index if not exists idx_catalog_items_game_metadata_franchise
on public.catalog_items ((metadata->>'franchise_name'))
where category = 'videojuegos' and metadata ? 'franchise_name';
