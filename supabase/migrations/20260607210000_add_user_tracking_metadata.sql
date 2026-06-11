alter table public.user_item_tracking
add column if not exists metadata jsonb not null default '{}'::jsonb;
