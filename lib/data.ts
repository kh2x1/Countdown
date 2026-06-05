import 'server-only';
import { unstable_noStore as noStore } from 'next/cache';
import type { Match, MatchStatus, Stadium, Team } from './types';
import { getSeedMatches } from './seed-data';
import { createClient, isSupabaseConfigured } from './supabase/server';

/**
 * Shape of the joined row returned by the Supabase query below. Supabase
 * returns embedded relations as nested objects.
 */
interface MatchRow {
  id: string;
  stage: Match['stage'];
  group_name: string | null;
  kickoff: string;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  minute: number | null;
  home_team: TeamRow;
  away_team: TeamRow;
  stadium: StadiumRow;
}

interface TeamRow {
  id: string;
  name: string;
  code: string;
  group_name: string | null;
}

interface StadiumRow {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number | null;
  image: string;
}

function mapTeam(t: TeamRow): Team {
  return { id: t.id, name: t.name, code: t.code, group: t.group_name ?? undefined };
}

function mapStadium(s: StadiumRow): Stadium {
  return {
    id: s.id,
    name: s.name,
    city: s.city,
    country: s.country,
    capacity: s.capacity ?? undefined,
    image: s.image,
  };
}

function mapMatch(r: MatchRow): Match {
  return {
    id: r.id,
    stage: r.stage,
    group: r.group_name ?? undefined,
    kickoff: r.kickoff,
    status: r.status,
    homeScore: r.home_score,
    awayScore: r.away_score,
    minute: r.minute,
    homeTeam: mapTeam(r.home_team),
    awayTeam: mapTeam(r.away_team),
    stadium: mapStadium(r.stadium),
  };
}

const MATCH_SELECT = `
  id, stage, group_name, kickoff, status, home_score, away_score, minute,
  home_team:teams!matches_home_team_id_fkey ( id, name, code, group_name ),
  away_team:teams!matches_away_team_id_fkey ( id, name, code, group_name ),
  stadium:stadiums ( id, name, city, country, capacity, image )
`;

/**
 * Returns all World Cup matches. Prefers live Supabase data and falls back to
 * bundled seed fixtures when Supabase is unconfigured or unreachable.
 */
export async function getMatches(): Promise<Match[]> {
  noStore();
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('matches')
          .select(MATCH_SELECT)
          .order('kickoff', { ascending: true });
        if (!error && data && data.length > 0) {
          return (data as unknown as MatchRow[]).map(mapMatch);
        }
      }
    } catch {
      // fall through to seed data
    }
  }
  return getSeedMatches();
}

export async function getMatchById(id: string): Promise<Match | null> {
  const matches = await getMatches();
  return matches.find((m) => m.id === id) ?? null;
}
