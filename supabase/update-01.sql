-- Update 01: let registered participants see the advancing-team list
-- for competitions they are part of (so a team can see it did NOT
-- advance, not just that it did). Run once in SQL Editor.

drop policy if exists "adv read own" on public.advancements;
drop policy if exists "adv read comp participants" on public.advancements;
create policy "adv read comp participants" on public.advancements for select using (
  exists (
    select 1 from public.registrations r
    where r.comp_id = advancements.comp_id and r.user_id = auth.uid()
  )
);

select 'update-01 applied' as result;
