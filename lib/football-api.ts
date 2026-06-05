/**
 * Football data API integration.
 *
 * Supports API-Football (api-sports.io) out of the box. The fetched fixtures
 * are normalised into our `Match` shape and can be pushed into Supabase by the
 * `scripts/sync-fixtures.mjs` job (or any cron / serverless function).
 *
 * This module is provider-agnostic at the call site: swap `FOOTBALL_API_PROVIDER`
 * and implement another `fetch*` branch to support Football-Data.org etc.
 */

import type { Match, MatchStatus } from './types';

const WORLD_CUP_LEAGUE_ID = 1; // API-Football league id for the FIFA World Cup
const SEASON = 2026;

interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string };
    venue: { name: string | null; city: string | null };
  };
  league: { round: string };
  teams: {
    home: { name: string; logo: string };
    away: { name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
}

function mapStatus(short: string): MatchStatus {
  if (['1H', '2H', 'HT', 'ET', 'P', 'LIVE', 'BT'].includes(short)) return 'live';
  if (['FT', 'AET', 'PEN'].includes(short)) return 'finished';
  return 'upcoming';
}

function mapRoundToStage(round: string): Match['stage'] {
  const r = round.toLowerCase();
  if (r.includes('final') && !r.includes('semi') && !r.includes('quarter')) return 'Final';
  if (r.includes('3rd') || r.includes('third')) return 'Third Place';
  if (r.includes('semi')) return 'Semi Final';
  if (r.includes('quarter')) return 'Quarter Final';
  if (r.includes('16')) return 'Round of 16';
  if (r.includes('32')) return 'Round of 32';
  return 'Group Stage';
}

/** Raw, provider-normalised fixture used by the sync script. */
export interface NormalisedFixture {
  externalId: string;
  stage: Match['stage'];
  kickoff: string;
  status: MatchStatus;
  homeName: string;
  awayName: string;
  homeScore: number | null;
  awayScore: number | null;
  venueName: string | null;
  venueCity: string | null;
}

export async function fetchWorldCupFixtures(): Promise<NormalisedFixture[]> {
  const key = process.env.FOOTBALL_API_KEY;
  const provider = process.env.FOOTBALL_API_PROVIDER ?? 'api-football';
  if (!key) throw new Error('FOOTBALL_API_KEY is not set');

  if (provider !== 'api-football') {
    throw new Error(`Unsupported FOOTBALL_API_PROVIDER: ${provider}`);
  }

  const url = `https://v3.football.api-sports.io/fixtures?league=${WORLD_CUP_LEAGUE_ID}&season=${SEASON}`;
  const res = await fetch(url, {
    headers: { 'x-apisports-key': key },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Football API error: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { response: ApiFootballFixture[] };

  return json.response.map((f) => ({
    externalId: String(f.fixture.id),
    stage: mapRoundToStage(f.league.round),
    kickoff: f.fixture.date,
    status: mapStatus(f.fixture.status.short),
    homeName: f.teams.home.name,
    awayName: f.teams.away.name,
    homeScore: f.goals.home,
    awayScore: f.goals.away,
    venueName: f.fixture.venue.name,
    venueCity: f.fixture.venue.city,
  }));
}
