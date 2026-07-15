-- ============================================================
-- Update 02: competition template v2
-- Adds: banner/logo images, structured detail sections, contacts,
-- about-host, real view counting, public registration counts,
-- round types, and ENFORCED institute eligibility.
-- Run once in Supabase SQL Editor (safe to re-run).
-- ============================================================

-- ---------- new competition fields ----------
alter table public.competitions
  add column if not exists logo_url text,
  add column if not exists banners jsonb not null default '[]',
  add column if not exists eligibility_criteria jsonb not null default '[]',
  add column if not exists team_structure jsonb not null default '[]',
  add column if not exists institutes jsonb not null default '[]',
  add column if not exists comp_structure jsonb not null default '[]',
  add column if not exists submission_guidelines jsonb not null default '[]',
  add column if not exists contacts jsonb not null default '[]',
  add column if not exists about_host text not null default '',
  add column if not exists views integer not null default 0,
  add column if not exists view_boost integer not null default 0;

-- ---------- real view counting (anyone can bump, +1 only) ----------
create or replace function public.bump_views(cid text)
returns void
language sql security definer set search_path = public
as $$
  update public.competitions set views = views + 1 where id = cid and draft = false;
$$;
grant execute on function public.bump_views(text) to anon, authenticated;

-- ---------- public registration count (number only, no names) ----------
create or replace function public.reg_count(cid text)
returns integer
language sql stable security definer set search_path = public
as $$
  select count(*)::int from public.registrations where comp_id = cid;
$$;
grant execute on function public.reg_count(text) to anon, authenticated;

-- ---------- public bucket for banners & logos ----------
insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

drop policy if exists "assets admin insert" on storage.objects;
drop policy if exists "assets admin update" on storage.objects;
drop policy if exists "assets admin delete" on storage.objects;
drop policy if exists "assets public read"  on storage.objects;
create policy "assets admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'public-assets' and public.is_admin());
create policy "assets admin update" on storage.objects for update to authenticated
  using (bucket_id = 'public-assets' and public.is_admin());
create policy "assets admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'public-assets' and public.is_admin());
create policy "assets public read" on storage.objects for select
  using (bucket_id = 'public-assets');

-- ---------- ENFORCED institute eligibility on registration ----------
-- If a competition lists eligible institutes, the lead's college
-- must be one of them; an empty list means open to all.
drop policy if exists "regs insert own" on public.registrations;
create policy "regs insert own" on public.registrations for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.competitions c
    where c.id = comp_id
      and c.draft = false
      and c.fee = 0
      and now() between c.reg_open and c.reg_close
      and jsonb_array_length(members) between c.team_min and c.team_max
      and (
        jsonb_array_length(coalesce(c.institutes, '[]'::jsonb)) = 0
        or exists (
          select 1 from jsonb_array_elements_text(c.institutes) inst
          where inst = (members -> 0 ->> 'college')
        )
      )
  )
);

select 'update-02 applied' as result;
