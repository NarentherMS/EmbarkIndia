-- ============================================================
-- Update 03 (CUMULATIVE — includes updates 01 and 02, plus the
-- tagline field). Run this ONE file in the SQL Editor; you can
-- skip update-01.sql and update-02.sql. Safe to re-run.
-- ============================================================

-- ---------- from update-01: participants can see their comp's advancing list ----------
drop policy if exists "adv read own" on public.advancements;
drop policy if exists "adv read comp participants" on public.advancements;
create policy "adv read comp participants" on public.advancements for select using (
  exists (
    select 1 from public.registrations r
    where r.comp_id = advancements.comp_id and r.user_id = auth.uid()
  )
);

-- ---------- from update-02: template fields ----------
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

-- ---------- NEW in update-03: tagline under the title ----------
alter table public.competitions
  add column if not exists tagline text not null default '';

-- ---------- real view counting ----------
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

-- ---------- enforced institute eligibility on registration ----------
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

select 'update-03 applied (includes 01 + 02 + tagline)' as result;
