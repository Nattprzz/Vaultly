-- ============================================================================
-- Nombre: add_game_tracking_fields.sql
-- Descripción:
-- Añade campos específicos para seguimiento avanzado de videojuegos.
--
-- Tablas afectadas:
-- - tracker_entries
--
-- Autor: Vaultly
-- ============================================================================

-- ============================================================
-- Vaultly — Migración: campos de seguimiento para videojuegos
-- ============================================================
-- started_at y finished_at ya existen. Se añaden:
--   playing_platform, hours_played, achievements_unlocked
-- ============================================================

-- 1. Añadir columnas (solo si no existen)
ALTER TABLE public.user_item_tracking
  ADD COLUMN IF NOT EXISTS playing_platform    TEXT,
  ADD COLUMN IF NOT EXISTS hours_played        NUMERIC,
  ADD COLUMN IF NOT EXISTS achievements_unlocked INTEGER;

-- 2. CHECK: horas >= 0
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_item_tracking_hours_played_check'
      AND conrelid = 'public.user_item_tracking'::regclass
  ) THEN
    ALTER TABLE public.user_item_tracking
      ADD CONSTRAINT user_item_tracking_hours_played_check
      CHECK (hours_played >= 0);
  END IF;
END $$;

-- 3. CHECK: logros >= 0
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_item_tracking_achievements_unlocked_check'
      AND conrelid = 'public.user_item_tracking'::regclass
  ) THEN
    ALTER TABLE public.user_item_tracking
      ADD CONSTRAINT user_item_tracking_achievements_unlocked_check
      CHECK (achievements_unlocked >= 0);
  END IF;
END $$;

-- 4. Migrar valores que ya estuviesen en la columna metadata JSONB
UPDATE public.user_item_tracking
  SET
    playing_platform = COALESCE(
      playing_platform,
      NULLIF(metadata->>'playing_platform', '')
    ),
    achievements_unlocked = COALESCE(
      achievements_unlocked,
      CASE
        WHEN (metadata->>'achievements_unlocked') ~ '^[0-9]+$'
        THEN (metadata->>'achievements_unlocked')::INTEGER
      END
    )
  WHERE category = 'videojuegos'
    AND metadata IS NOT NULL
    AND metadata != '{}'::jsonb;
