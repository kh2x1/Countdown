#!/usr/bin/env node
/**
 * Sync FIFA World Cup fixtures from a football API into Supabase.
 *
 * Usage:
 *   node scripts/sync-fixtures.mjs
 *
 * Required env (see .env.example):
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *   FOOTBALL_API_KEY  (provider defaults to api-football)
 *
 * Run it on a schedule (Vercel Cron, GitHub Actions, Supabase Edge Function)
 * to keep statuses and scores current. Existing rows are upserted by id.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const API_KEY = process.env.FOOTBALL_API_KEY;
const LEAGUE_ID = 1; // FIFA World Cup
const SEASON = 2026;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}
if (!API_KEY) {
  console.error('Missing FOOTBALL_API_KEY.');
  process.exit(1);
}

const mapStatus = (s) =>
  ['1H', '2H', 'HT', 'ET', 'P', 'LIVE', 'BT'].includes(s)
    ? 'live'
    : ['FT', 'AET', 'PEN'].includes(s)
      ? 'finished'
      : 'upcoming';

const mapStage = (round = '') => {
  const r = round.toLowerCase();
  if (r.includes('final') && !r.includes('semi') && !r.includes('quarter')) return 'Final';
  if (r.includes('third') || r.includes('3rd')) return 'Third Place';
  if (r.includes('semi')) return 'Semi Final';
  if (r.includes('quarter')) return 'Quarter Final';
  if (r.includes('16')) return 'Round of 16';
  if (r.includes('32')) return 'Round of 32';
  return 'Group Stage';
};

async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  console.log('Fetching World Cup fixtures…');
  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID}&season=${SEASON}`,
    { headers: { 'x-apisports-key': API_KEY } }
  );
  if (!res.ok) throw new Error(`Football API ${res.status}`);
  const { response } = await res.json();
  console.log(`Received ${response.length} fixtures.`);

  // NOTE: matching API venues/teams to our stable ids is deployment-specific.
  // Here we only update mutable match state (status/score/minute/kickoff) for
  // rows that already exist, keyed by external_id.
  let updated = 0;
  for (const f of response) {
    const { error } = await supabase
      .from('matches')
      .update({
        kickoff: f.fixture.date,
        status: mapStatus(f.fixture.status.short),
        home_score: f.goals.home,
        away_score: f.goals.away,
        minute: f.fixture.status.elapsed ?? null,
        stage: mapStage(f.league.round),
      })
      .eq('external_id', String(f.fixture.id));
    if (!error) updated++;
  }

  console.log(`Done. Updated ${updated} matches.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
