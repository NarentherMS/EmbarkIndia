-- ============================================================
-- Embark India — Case Competition Portal, Phase 1 schema
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run
-- Safe to re-run (idempotent where possible).
-- No payments in this phase: only free competitions accept
-- registrations (enforced by policy below).
-- ============================================================

-- ---------- helper: who is admin ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  college text not null default '',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- auto-create a profile whenever someone signs up;
-- the founder's email becomes admin automatically
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    lower(new.email) = 'narentherms@gmail.com'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- competitions ----------
create table if not exists public.competitions (
  id text primary key,
  title text not null,
  host text not null default 'Embark India',
  category text not null default 'General Management',
  banner text not null default 'orange',
  fee integer not null default 0,
  team_min integer not null default 1,
  team_max integer not null default 4,
  eligibility text not null default '',
  about text not null default '',
  rules jsonb not null default '[]',
  prizes jsonb not null default '[]',
  ppo boolean not null default false,
  beginner boolean not null default false,
  draft boolean not null default true,
  reg_open timestamptz not null,
  reg_close timestamptz not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  result_at timestamptz,
  rounds jsonb not null default '[]',
  seed_regs integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- registrations ----------
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  comp_id text not null references public.competitions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  team_name text not null default '',
  members jsonb not null default '[]',  -- [{name, email, college}]
  created_at timestamptz not null default now(),
  unique (comp_id, user_id)
);

-- ---------- submissions (one per team per round) ----------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  comp_id text not null references public.competitions(id) on delete cascade,
  reg_id uuid not null references public.registrations(id) on delete cascade,
  round_idx integer not null,
  file_path text,
  link text,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reg_id, round_idx)
);

-- ---------- advancement (admin picks who proceeds) ----------
create table if not exists public.advancements (
  comp_id text not null references public.competitions(id) on delete cascade,
  reg_id uuid not null references public.registrations(id) on delete cascade,
  round_idx integer not null,
  created_at timestamptz not null default now(),
  primary key (comp_id, reg_id, round_idx)
);

-- ---------- winners (public results; team name snapshotted) ----------
create table if not exists public.winners (
  comp_id text not null references public.competitions(id) on delete cascade,
  reg_id uuid not null references public.registrations(id) on delete cascade,
  rank integer not null,
  team_name text not null,
  created_at timestamptz not null default now(),
  primary key (comp_id, reg_id)
);

-- ============================================================
-- Row Level Security: the "safety rules"
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.competitions  enable row level security;
alter table public.registrations enable row level security;
alter table public.submissions   enable row level security;
alter table public.advancements  enable row level security;
alter table public.winners       enable row level security;

-- profiles: you see/update your own; admin sees all
drop policy if exists "profiles own read"   on public.profiles;
drop policy if exists "profiles admin read" on public.profiles;
drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own read"   on public.profiles for select using (id = auth.uid());
create policy "profiles admin read" on public.profiles for select using (public.is_admin());
create policy "profiles own update" on public.profiles for update using (id = auth.uid());
revoke update on public.profiles from authenticated;
grant  update (name, college) on public.profiles to authenticated;  -- nobody can self-promote to admin

-- competitions: everyone reads published; admin does everything
drop policy if exists "comps public read" on public.competitions;
drop policy if exists "comps admin all"   on public.competitions;
create policy "comps public read" on public.competitions for select using (draft = false or public.is_admin());
create policy "comps admin all"   on public.competitions for all using (public.is_admin()) with check (public.is_admin());

-- registrations: register yourself, only while the window is open,
-- only for published FREE competitions, with a valid team size
drop policy if exists "regs insert own" on public.registrations;
drop policy if exists "regs read own"   on public.registrations;
drop policy if exists "regs admin all"  on public.registrations;
create policy "regs insert own" on public.registrations for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.competitions c
    where c.id = comp_id
      and c.draft = false
      and c.fee = 0                                   -- Phase 1: free comps only
      and now() between c.reg_open and c.reg_close    -- server-enforced window
      and jsonb_array_length(members) between c.team_min and c.team_max
  )
);
create policy "regs read own"  on public.registrations for select using (user_id = auth.uid());
create policy "regs admin all" on public.registrations for all using (public.is_admin()) with check (public.is_admin());

-- submissions: upload only for your own team, only while that
-- round's window is open, and only if you advanced past the previous round
drop policy if exists "subs insert own"  on public.submissions;
drop policy if exists "subs update own"  on public.submissions;
drop policy if exists "subs read own"    on public.submissions;
drop policy if exists "subs admin all"   on public.submissions;
create policy "subs insert own" on public.submissions for insert with check (
  exists (select 1 from public.registrations r where r.id = reg_id and r.user_id = auth.uid())
  and exists (
    select 1 from public.competitions c
    where c.id = comp_id
      and now() >= ((c.rounds -> round_idx) ->> 'opens')::timestamptz
      and now() <= ((c.rounds -> round_idx) ->> 'closes')::timestamptz  -- the unbribeable clock
  )
  and (
    round_idx = 0
    or exists (select 1 from public.advancements a
               where a.reg_id = submissions.reg_id and a.round_idx = submissions.round_idx - 1)
  )
);
create policy "subs update own" on public.submissions for update using (
  exists (select 1 from public.registrations r where r.id = reg_id and r.user_id = auth.uid())
  and exists (
    select 1 from public.competitions c
    where c.id = comp_id
      and now() <= ((c.rounds -> round_idx) ->> 'closes')::timestamptz
  )
);
create policy "subs read own"  on public.submissions for select using (
  exists (select 1 from public.registrations r where r.id = reg_id and r.user_id = auth.uid())
);
create policy "subs admin all" on public.submissions for all using (public.is_admin()) with check (public.is_admin());

-- advancements: participants see their own; admin decides
drop policy if exists "adv read own"  on public.advancements;
drop policy if exists "adv admin all" on public.advancements;
create policy "adv read own"  on public.advancements for select using (
  exists (select 1 from public.registrations r where r.id = reg_id and r.user_id = auth.uid())
);
create policy "adv admin all" on public.advancements for all using (public.is_admin()) with check (public.is_admin());

-- winners: public results; admin writes
drop policy if exists "winners public read" on public.winners;
drop policy if exists "winners admin all"   on public.winners;
create policy "winners public read" on public.winners for select using (true);
create policy "winners admin all"   on public.winners for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- Storage: private cupboard for submission files
-- path convention: {user_id}/{comp_id}/round{n}/{filename}
-- ============================================================
insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

drop policy if exists "subs files upload own"  on storage.objects;
drop policy if exists "subs files read own"    on storage.objects;
drop policy if exists "subs files read admin"  on storage.objects;
create policy "subs files upload own" on storage.objects for insert to authenticated with check (
  bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "subs files read own" on storage.objects for select to authenticated using (
  bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "subs files read admin" on storage.objects for select to authenticated using (
  bucket_id = 'submissions' and public.is_admin()
);

-- ============================================================
-- Seed competitions (same five as the prototype, dates relative
-- to the moment you run this script; all free in Phase 1)
-- ============================================================
insert into public.competitions
  (id, title, host, category, banner, fee, team_min, team_max, eligibility, about, rules, prizes, ppo, beginner, draft, reg_open, reg_close, start_at, end_at, result_at, rounds, seed_regs)
values
(
  'fmcg-growth-sprint',
  'Embark Case Sprint: FMCG Growth Challenge',
  'Embark India × Meridian Consumer Goods',
  'Marketing', 'orange', 0, 1, 4,
  'MBA/PGDM students of any year, any B-school in India. Cross-college teams allowed.',
  'A real growth problem from a national FMCG player: a heritage brand losing shelf share to D2C challengers. Three rounds from screening deck to a live boardroom pitch. Built for Tier 2 talent hunting a resume signal — and the sponsor is watching for PPI candidates.',
  '["Teams of 1–4; one submission per team per round","Decks in PDF, max 12 slides plus appendix","Plagiarism = disqualification; data sources must be cited","Judging is offline by the sponsor and Embark panel; decisions are final"]',
  '[["Winner","₹30,000 + PPI interviews with the sponsor"],["1st runner-up","₹15,000 + PPI interviews"],["2nd runner-up","₹5,000"],["All finalists","Winner-track certificate + mentor session"]]',
  true, false, false,
  now() - interval '5 days', now() + interval '4 days',
  now() - interval '2 days', now() + interval '12 days', now() + interval '15 days',
  jsonb_build_array(
    jsonb_build_object('name','Round 1 — Screening deck','brief','Diagnose the share loss and propose your growth thesis in 5 slides.','opens', to_char(now() - interval '24 hours','YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'closes', to_char(now() + interval '72 hours','YYYY-MM-DD"T"HH24:MI:SS"Z"')),
    jsonb_build_object('name','Round 2 — Full solution','brief','Complete 12-slide strategy: portfolio, pricing, channel and media plan with financials.','opens', to_char(now() + interval '5 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'closes', to_char(now() + interval '8 days','YYYY-MM-DD"T"HH24:MI:SS"Z"')),
    jsonb_build_object('name','Finals — Live boardroom pitch','brief','Online pitch to the sponsor CXO panel. 10 minutes, then Q&A.','opens', to_char(now() + interval '10 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'closes', to_char(now() + interval '11 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'))
  ),
  87
),
(
  'quickcommerce-ops-clash',
  'SwiftCart Quick-Commerce Ops Clash',
  'Embark India × SwiftCart',
  'Operations', 'green', 0, 2, 4,
  'MBA/PGDM students of any year. Teams of 2–4 from any college.',
  'Dark-store economics under 10-minute delivery pressure: design the network, the labour model and the unit economics that survive a price war. Two rounds, judged by operators.',
  '["Teams of 2–4","Round 1 is a structured working file plus 6-slide summary","Cite every external data source"]',
  '[["Winner","₹25,000 + PPI conversations"],["Runner-up","₹10,000"],["Top 8","Winner-track certificates"]]',
  true, false, false,
  now() + interval '2 days', now() + interval '10 days',
  now() + interval '11 days', now() + interval '24 days', now() + interval '27 days',
  jsonb_build_array(
    jsonb_build_object('name','Round 1 — Ops model','brief','Network design and unit economics working file.','opens', to_char(now() + interval '11 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'closes', to_char(now() + interval '15 days','YYYY-MM-DD"T"HH24:MI:SS"Z"')),
    jsonb_build_object('name','Finals — Live defence','brief','Defend your model to a panel of quick-commerce operators.','opens', to_char(now() + interval '20 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'closes', to_char(now() + interval '22 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'))
  ),
  0
),
(
  'bharat-marketing-league',
  'Bharat Marketing League',
  'Embark India',
  'Marketing', 'dark', 0, 1, 3,
  'Open to all MBA/PGDM students. Tier 2 and Tier 3 college teams especially encouraged.',
  'Go-to-market for the next 500 million: a rural-first launch challenge. Two rounds, fully online, designed so a strong team from any campus can beat a brand-name college on the merits.',
  '["Teams of 1–3, any college mix","Round 1 is a 3-slide concept note","All submissions in English or Hinglish — clarity beats polish"]',
  '[["Winner","₹20,000 + feature on The eMBArk Times"],["Runner-up","₹10,000"],["Top 10","Winner-track certificates"]]',
  false, true, false,
  now() + interval '6 days', now() + interval '14 days',
  now() + interval '15 days', now() + interval '30 days', now() + interval '33 days',
  jsonb_build_array(
    jsonb_build_object('name','Round 1 — Concept note','brief','Pick a category, define the wedge, three slides.','opens', to_char(now() + interval '15 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'closes', to_char(now() + interval '20 days','YYYY-MM-DD"T"HH24:MI:SS"Z"')),
    jsonb_build_object('name','Finals — Full GTM','brief','Complete rural go-to-market with budget and channel math.','opens', to_char(now() + interval '24 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'closes', to_char(now() + interval '28 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'))
  ),
  0
),
(
  'analytics-case-cup',
  'Northline Analytics Case Cup',
  'Embark India × Northline Analytics',
  'Analytics', 'charcoal', 0, 1, 4,
  'MBA/PGDM students with an interest in analytics. No coding required for Round 1.',
  'Turn a messy retail dataset into a boardroom decision. Business judgement first, tools second — exactly how analytics interviews actually work.',
  '["Teams of 1–4","Round 1 is insight-first: charts optional, thinking mandatory","Finalists present live"]',
  '[["Winner","₹20,000 + PPI interviews"],["Runner-up","₹8,000"],["Top 10","Winner-track certificates"]]',
  true, false, false,
  now() - interval '30 days', now() - interval '20 days',
  now() - interval '19 days', now() - interval '6 days', now() - interval '3 days',
  jsonb_build_array(
    jsonb_build_object('name','Round 1 — Insight memo','brief','From dataset to decision memo.','opens', to_char(now() - interval '19 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'closes', to_char(now() - interval '14 days','YYYY-MM-DD"T"HH24:MI:SS"Z"')),
    jsonb_build_object('name','Finals — Live readout','brief','Present the decision to the panel.','opens', to_char(now() - interval '9 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'closes', to_char(now() - interval '7 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'))
  ),
  214
),
(
  'people-case-challenge',
  'The People Case Challenge',
  'Embark India',
  'Human Resources', 'green', 0, 1, 4,
  'Draft — being finalised.',
  'An HR transformation case. Draft — not yet published.',
  '["Draft"]',
  '[["Winner","TBD"]]',
  false, false, true,
  now() + interval '20 days', now() + interval '30 days',
  now() + interval '31 days', now() + interval '45 days', now() + interval '48 days',
  jsonb_build_array(
    jsonb_build_object('name','Round 1','brief','TBD','opens', to_char(now() + interval '31 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'closes', to_char(now() + interval '35 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'))
  ),
  0
)
on conflict (id) do nothing;

-- done
select 'Embark India schema installed. Competitions: ' || count(*)::text as result from public.competitions;
