-- ──────────────────────────────────────────────────────────────────────────────
-- Migration: 20260616180000_add_backdrop_url_and_update_public_profiles.sql
-- Adds backdrop_url to profiles and exposes it (plus role) in public_profiles.
-- ──────────────────────────────────────────────────────────────────────────────

-- 1. New column on profiles (idempotent)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS backdrop_url TEXT;

-- 2. Recreate public_profiles view with backdrop_url and role
--    Keeps the security_barrier flag so RLS cannot be bypassed via the view.
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_barrier = true) AS
SELECT
  id,
  username,
  display_name,
  initials,
  bio,
  avatar_url,
  is_public,
  share_tracker,
  show_ratings,
  show_reviews,
  backdrop_url,
  role
FROM public.profiles
WHERE is_public = true
  AND status = 'active';

-- Grant read access to anon and authenticated roles (mirrors existing grant)
GRANT SELECT ON public.public_profiles TO anon, authenticated;
