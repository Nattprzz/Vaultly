-- ============================================================================
-- Nombre: add_edge_rate_limits_cleanup.sql
-- Descripcion:
-- Anade una funcion segura para limpiar buckets antiguos de edge_rate_limits.
-- No modifica RLS ni vistas publicas.
-- ============================================================================

create or replace function public.delete_edge_rate_limits_older_than(
  p_interval interval default interval '1 day'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  if p_interval is null or p_interval <= interval '0 seconds' then
    raise exception 'p_interval must be positive';
  end if;

  delete from public.edge_rate_limits
  where updated_at < now() - p_interval;

  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.delete_edge_rate_limits_older_than(interval) from public;
revoke all on function public.delete_edge_rate_limits_older_than(interval) from anon;
revoke all on function public.delete_edge_rate_limits_older_than(interval) from authenticated;
grant execute on function public.delete_edge_rate_limits_older_than(interval) to service_role;
