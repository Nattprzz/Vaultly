-- ============================================================
-- Vaultly — Migración: nuevo sistema de estados por categoría
-- ============================================================
-- Ejecutar con: supabase db push
--
-- Cambios:
--   1. Elimina el CHECK constraint restrictivo de status_en
--   2. Migra datos existentes al nuevo esquema de estados
--   3. Añade un CHECK constraint ampliado con todos los valores válidos
-- ============================================================

-- 1. Eliminar constraint antiguo (nombre autogenerado por PostgreSQL)
ALTER TABLE public.user_item_tracking
  DROP CONSTRAINT IF EXISTS user_item_tracking_status_en_check;

-- 2. Migrar datos: in_progress → estado activo por categoría
UPDATE public.user_item_tracking
  SET status_en = 'playing'
  WHERE status_en = 'in_progress' AND category = 'videojuegos';

UPDATE public.user_item_tracking
  SET status_en = 'watching'
  WHERE status_en = 'in_progress' AND category = 'peliculas';

UPDATE public.user_item_tracking
  SET status_en = 'watching'
  WHERE status_en = 'in_progress' AND category = 'series';

UPDATE public.user_item_tracking
  SET status_en = 'reading'
  WHERE status_en = 'in_progress' AND category = 'libros';

-- conciertos en progreso → attended (más lógico que "watching")
UPDATE public.user_item_tracking
  SET status_en = 'attended'
  WHERE status_en = 'in_progress' AND category = 'conciertos';

-- 3. Migrar datos: completed → estado completado por categoría
UPDATE public.user_item_tracking
  SET status_en = 'played'
  WHERE status_en = 'completed' AND category = 'videojuegos';

UPDATE public.user_item_tracking
  SET status_en = 'watched'
  WHERE status_en = 'completed' AND category = 'peliculas';

UPDATE public.user_item_tracking
  SET status_en = 'watched'
  WHERE status_en = 'completed' AND category = 'series';

UPDATE public.user_item_tracking
  SET status_en = 'read'
  WHERE status_en = 'completed' AND category = 'libros';

UPDATE public.user_item_tracking
  SET status_en = 'attended'
  WHERE status_en = 'completed' AND category = 'conciertos';

-- 4. Migrar datos: dropped → abandoned (nombre genérico mejorado)
UPDATE public.user_item_tracking
  SET status_en = 'abandoned'
  WHERE status_en = 'dropped';

-- 5. Casos especiales:
--    conciertos no tiene 'pending' — se mueve a 'wishlist'
UPDATE public.user_item_tracking
  SET status_en = 'wishlist'
  WHERE status_en = 'pending' AND category = 'conciertos';

-- 6. Seguridad: cualquier estado no reconocido → pending (o wishlist para conciertos)
--    Esto protege ante datos corruptos o de versiones anteriores muy antiguas.
UPDATE public.user_item_tracking
  SET status_en = 'wishlist'
  WHERE category = 'conciertos'
    AND status_en NOT IN ('wishlist', 'attended', 'missed');

UPDATE public.user_item_tracking
  SET status_en = 'pending'
  WHERE category = 'videojuegos'
    AND status_en NOT IN ('wishlist', 'pending', 'playing', 'played', 'completed', 'platinum', 'abandoned');

UPDATE public.user_item_tracking
  SET status_en = 'pending'
  WHERE category = 'peliculas'
    AND status_en NOT IN ('wishlist', 'pending', 'watching', 'watched', 'abandoned');

UPDATE public.user_item_tracking
  SET status_en = 'pending'
  WHERE category = 'series'
    AND status_en NOT IN ('wishlist', 'pending', 'watching', 'watched', 'waiting_season', 'waiting_episode', 'abandoned');

UPDATE public.user_item_tracking
  SET status_en = 'pending'
  WHERE category = 'libros'
    AND status_en NOT IN ('wishlist', 'pending', 'reading', 'read');

-- 7. Añadir nuevo CHECK constraint con todos los valores válidos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_item_tracking_status_en_check'
      AND conrelid = 'public.user_item_tracking'::regclass
  ) THEN
    ALTER TABLE public.user_item_tracking
      ADD CONSTRAINT user_item_tracking_status_en_check
      CHECK (status_en IN (
        -- Compartidos
        'wishlist',
        'pending',
        'abandoned',
        -- Videojuegos
        'playing',
        'played',
        'completed',
        'platinum',
        -- Películas & Series
        'watching',
        'watched',
        -- Series extra
        'waiting_season',
        'waiting_episode',
        -- Libros
        'reading',
        'read',
        -- Conciertos
        'attended',
        'missed'
      ));
  END IF;
END $$;

-- 8. Actualizar también el tipo enum si existe (puede estar obsoleto)
--    Lo dejamos solo como TEXT + CHECK para mayor flexibilidad futura
DO $$
BEGIN
  -- Eliminar el tipo enum antiguo si ya no es necesario
  -- (user_item_tracking usa TEXT, no este enum directamente)
  DROP TYPE IF EXISTS public.tracker_status;
EXCEPTION
  WHEN dependent_objects_still_exist THEN
    -- Si algo aún depende del tipo, no lo eliminamos
    NULL;
END $$;
