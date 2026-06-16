-- ============================================================================
-- Nombre: verify_catalog_rls.sql
-- Descripcion:
-- Confirma y endurece las politicas RLS de catalog_items.
-- Auditoria RS2 (2026-06-17): la politica "catalog admin write" del schema
-- inicial ya aplica is_admin() para INSERT/UPDATE/DELETE correctamente.
-- Esta migracion refuerza las politicas separandolas por operacion para
-- mayor claridad y auditabilidad, y mantiene la lectura publica.
-- ============================================================================

-- Eliminar politicas anteriores para recrearlas de forma explicita
drop policy if exists "catalog public read"  on public.catalog_items;
drop policy if exists "catalog admin write"  on public.catalog_items;

-- SELECT: publico para todos (el catalogo es una vista publica)
create policy "catalog public read" on public.catalog_items
  for select using (true);

-- INSERT: solo admins activos
create policy "catalog admin insert" on public.catalog_items
  for insert with check (public.is_admin());

-- UPDATE: solo admins activos
create policy "catalog admin update" on public.catalog_items
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE: solo admins activos
create policy "catalog admin delete" on public.catalog_items
  for delete using (public.is_admin());
