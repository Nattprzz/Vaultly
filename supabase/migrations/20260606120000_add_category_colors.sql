-- ============================================================================
-- Nombre: add_category_colors.sql
-- Descripción:
-- Añade configuración JSON de colores personalizados por categoría en perfiles.
--
-- Tablas afectadas:
-- - profiles
--
-- Autor: Vaultly
-- ============================================================================

-- Permite que cada usuario personalice el color de acento usado por categoría
-- (videojuegos, peliculas, series, libros, conciertos). Se guarda como mapa JSON:
-- ID de categoría -> color hexadecimal, por ejemplo {"videojuegos": "#84cc16"}.
-- No admite nulos y usa '{}' por defecto para conservar los colores de la aplicación.

alter table public.user_tracker_settings
  add column if not exists category_colors jsonb not null default '{}'::jsonb;

comment on column public.user_tracker_settings.category_colors is
  'User-defined accent color overrides per category id, e.g. {"videojuegos": "#84cc16"}. Empty object means "use app defaults".';
