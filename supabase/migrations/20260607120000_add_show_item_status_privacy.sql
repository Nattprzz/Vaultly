alter table public.profiles
add column if not exists show_item_status boolean not null default true;
