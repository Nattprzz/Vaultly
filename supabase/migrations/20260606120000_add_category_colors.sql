-- Allow each user to personalise the accent color used for each content category
-- (videojuegos, peliculas, series, libros, conciertos). Stored as a JSON map of
-- category id -> hex color string, e.g. {"videojuegos": "#84cc16"}.
-- Nullable / defaults to '{}' so existing rows keep using the app defaults.

alter table public.user_tracker_settings
  add column if not exists category_colors jsonb not null default '{}'::jsonb;

comment on column public.user_tracker_settings.category_colors is
  'User-defined accent color overrides per category id, e.g. {"videojuegos": "#84cc16"}. Empty object means "use app defaults".';
