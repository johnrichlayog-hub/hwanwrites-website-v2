-- HwanWrites inquiry database
create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  email text not null check (char_length(trim(email)) between 3 and 254),
  service text not null check (char_length(trim(service)) between 1 and 100),
  details text not null check (char_length(trim(details)) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries" on public.inquiries for insert to anon, authenticated with check (true);

drop policy if exists "Authenticated admins can read inquiries" on public.inquiries;
create policy "Authenticated admins can read inquiries" on public.inquiries for select to authenticated using (true);

drop policy if exists "Authenticated admins can update inquiries" on public.inquiries;
create policy "Authenticated admins can update inquiries" on public.inquiries for update to authenticated using (true) with check (true);

grant insert on public.inquiries to anon, authenticated;
grant select, update on public.inquiries to authenticated;
