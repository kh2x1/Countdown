-- ============================================================================
-- World Cup 2026 Match Center — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- ============================================================================

-- Stadiums ------------------------------------------------------------------
create table if not exists public.stadiums (
  id          text primary key,
  name        text not null,
  city        text not null,
  country     text not null,
  capacity    integer,
  image       text not null,
  created_at  timestamptz not null default now()
);

-- Teams ---------------------------------------------------------------------
create table if not exists public.teams (
  id          text primary key,
  name        text not null,
  code        text not null,            -- ISO country code for the flag (e.g. 'us')
  group_name  text,                     -- group letter (A..L) during group stage
  created_at  timestamptz not null default now()
);

-- Matches -------------------------------------------------------------------
do $$ begin
  create type match_status as enum ('upcoming', 'live', 'finished');
exception when duplicate_object then null; end $$;

create table if not exists public.matches (
  id            text primary key,
  external_id   text unique,            -- id from the football API (for upserts)
  stage         text not null,          -- 'Group Stage', 'Round of 16', ...
  group_name    text,
  kickoff       timestamptz not null,
  status        match_status not null default 'upcoming',
  home_team_id  text not null references public.teams (id),
  away_team_id  text not null references public.teams (id),
  home_score    integer,
  away_score    integer,
  minute        integer,
  stadium_id    text not null references public.stadiums (id),
  updated_at    timestamptz not null default now()
);

create index if not exists matches_kickoff_idx on public.matches (kickoff);
create index if not exists matches_status_idx  on public.matches (status);

-- Row Level Security: the dashboard is public read-only --------------------
alter table public.stadiums enable row level security;
alter table public.teams    enable row level security;
alter table public.matches  enable row level security;

create policy "public read stadiums" on public.stadiums for select using (true);
create policy "public read teams"    on public.teams    for select using (true);
create policy "public read matches"  on public.matches  for select using (true);

-- Writes are performed by the sync job using the service-role key, which
-- bypasses RLS, so no insert/update policies are required for anon users.

-- Optional: keep updated_at fresh on every change --------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists matches_touch on public.matches;
create trigger matches_touch before update on public.matches
  for each row execute function public.touch_updated_at();
