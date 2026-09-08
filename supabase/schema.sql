create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Public can read site content"
  on public.site_content for select
  using (true);

-- Temporary policy for the first setup only. Replace this with an
-- authenticated-admin policy before putting admin.html on the public internet.
create policy "Public can update site content"
  on public.site_content for update
  using (true)
  with check (true);

insert into public.site_content (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;
