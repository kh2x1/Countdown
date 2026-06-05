import type { Match, Stadium, Team } from './types';

/**
 * Bundled FIFA World Cup 2026 reference data.
 *
 * This lets the app render a complete, professional dashboard with zero
 * external configuration. When Supabase / a football API is configured the
 * `lib/data.ts` layer transparently prefers live data over this seed.
 *
 * Fixtures below use the real 16 host venues and confirmed tournament window
 * (11 Jun – 19 Jul 2026). Group pairings are illustrative sample fixtures.
 */

// --- Stadiums (16 official host venues) -------------------------------------

const STADIUM_IMAGES = [
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1540552965541-37a52ea60bb1?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=1400&q=80',
];

const img = (i: number) => STADIUM_IMAGES[i % STADIUM_IMAGES.length];

export const STADIUMS: Stadium[] = [
  { id: 'azteca', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 87523, image: img(0) },
  { id: 'metlife', name: 'MetLife Stadium', city: 'East Rutherford', country: 'USA', capacity: 82500, image: img(1) },
  { id: 'att', name: 'AT&T Stadium', city: 'Arlington', country: 'USA', capacity: 80000, image: img(2) },
  { id: 'sofi', name: 'SoFi Stadium', city: 'Inglewood', country: 'USA', capacity: 70240, image: img(3) },
  { id: 'mercedes', name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA', capacity: 71000, image: img(4) },
  { id: 'nrg', name: 'NRG Stadium', city: 'Houston', country: 'USA', capacity: 72220, image: img(5) },
  { id: 'arrowhead', name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', capacity: 76416, image: img(6) },
  { id: 'lincoln', name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', capacity: 69596, image: img(7) },
  { id: 'gillette', name: 'Gillette Stadium', city: 'Foxborough', country: 'USA', capacity: 65878, image: img(1) },
  { id: 'hardrock', name: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA', capacity: 64767, image: img(2) },
  { id: 'levis', name: "Levi's Stadium", city: 'Santa Clara', country: 'USA', capacity: 68500, image: img(3) },
  { id: 'lumen', name: 'Lumen Field', city: 'Seattle', country: 'USA', capacity: 68740, image: img(4) },
  { id: 'akron', name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', capacity: 48071, image: img(5) },
  { id: 'bbva', name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', capacity: 53500, image: img(6) },
  { id: 'bmo', name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: 45500, image: img(7) },
  { id: 'bcplace', name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: 54500, image: img(0) },
];

const stadium = (id: string): Stadium =>
  STADIUMS.find((s) => s.id === id) ?? STADIUMS[0];

// --- Teams ------------------------------------------------------------------

export const TEAMS: Team[] = [
  { id: 'mex', name: 'Mexico', code: 'mx', group: 'A' },
  { id: 'can', name: 'Canada', code: 'ca', group: 'B' },
  { id: 'usa', name: 'United States', code: 'us', group: 'D' },
  { id: 'arg', name: 'Argentina', code: 'ar', group: 'C' },
  { id: 'bra', name: 'Brazil', code: 'br', group: 'E' },
  { id: 'fra', name: 'France', code: 'fr', group: 'F' },
  { id: 'eng', name: 'England', code: 'gb-eng', group: 'G' },
  { id: 'esp', name: 'Spain', code: 'es', group: 'H' },
  { id: 'ger', name: 'Germany', code: 'de', group: 'A' },
  { id: 'por', name: 'Portugal', code: 'pt', group: 'B' },
  { id: 'ned', name: 'Netherlands', code: 'nl', group: 'C' },
  { id: 'bel', name: 'Belgium', code: 'be', group: 'D' },
  { id: 'cro', name: 'Croatia', code: 'hr', group: 'E' },
  { id: 'uru', name: 'Uruguay', code: 'uy', group: 'F' },
  { id: 'jpn', name: 'Japan', code: 'jp', group: 'G' },
  { id: 'mar', name: 'Morocco', code: 'ma', group: 'H' },
];

const team = (id: string): Team =>
  TEAMS.find((t) => t.id === id) ?? TEAMS[0];

// --- Match schedule ---------------------------------------------------------
// Times are anchored to the real tournament window. We compute concrete ISO
// timestamps so countdown timers and statuses behave correctly.

interface SeedFixture {
  id: string;
  stage: Match['stage'];
  group?: string;
  date: string; // YYYY-MM-DD (local-to-UTC handled below)
  time: string; // HH:mm in UTC
  home: string;
  away: string;
  stadium: string;
  status?: Match['status'];
  homeScore?: number;
  awayScore?: number;
  minute?: number;
}

const FIXTURES: SeedFixture[] = [
  // Opening match
  { id: 'm01', stage: 'Group Stage', group: 'A', date: '2026-06-11', time: '00:00', home: 'mex', away: 'ger', stadium: 'azteca' },
  { id: 'm02', stage: 'Group Stage', group: 'B', date: '2026-06-12', time: '20:00', home: 'can', away: 'por', stadium: 'bmo' },
  { id: 'm03', stage: 'Group Stage', group: 'D', date: '2026-06-12', time: '23:00', home: 'usa', away: 'bel', stadium: 'sofi' },
  { id: 'm04', stage: 'Group Stage', group: 'C', date: '2026-06-13', time: '19:00', home: 'arg', away: 'ned', stadium: 'metlife' },
  { id: 'm05', stage: 'Group Stage', group: 'E', date: '2026-06-13', time: '22:00', home: 'bra', away: 'cro', stadium: 'mercedes' },
  { id: 'm06', stage: 'Group Stage', group: 'F', date: '2026-06-14', time: '18:00', home: 'fra', away: 'uru', stadium: 'att' },
  { id: 'm07', stage: 'Group Stage', group: 'G', date: '2026-06-14', time: '21:00', home: 'eng', away: 'jpn', stadium: 'lumen' },
  { id: 'm08', stage: 'Group Stage', group: 'H', date: '2026-06-15', time: '20:00', home: 'esp', away: 'mar', stadium: 'hardrock' },
  // Second round of group games
  { id: 'm09', stage: 'Group Stage', group: 'A', date: '2026-06-18', time: '23:00', home: 'ger', away: 'mex', stadium: 'nrg' },
  { id: 'm10', stage: 'Group Stage', group: 'C', date: '2026-06-19', time: '19:00', home: 'ned', away: 'arg', stadium: 'lincoln' },
  { id: 'm11', stage: 'Group Stage', group: 'E', date: '2026-06-20', time: '22:00', home: 'cro', away: 'bra', stadium: 'levis' },
  { id: 'm12', stage: 'Group Stage', group: 'F', date: '2026-06-21', time: '18:00', home: 'uru', away: 'fra', stadium: 'arrowhead' },
  // Knockouts
  { id: 'm13', stage: 'Round of 32', date: '2026-06-28', time: '20:00', home: 'arg', away: 'jpn', stadium: 'akron' },
  { id: 'm14', stage: 'Round of 16', date: '2026-07-04', time: '23:00', home: 'bra', away: 'esp', stadium: 'bbva' },
  { id: 'm15', stage: 'Quarter Final', date: '2026-07-10', time: '21:00', home: 'fra', away: 'eng', stadium: 'gillette' },
  { id: 'm16', stage: 'Semi Final', date: '2026-07-14', time: '23:00', home: 'arg', away: 'bra', stadium: 'att' },
  { id: 'm17', stage: 'Third Place', date: '2026-07-18', time: '20:00', home: 'esp', away: 'fra', stadium: 'hardrock' },
  { id: 'm18', stage: 'Final', date: '2026-07-19', time: '19:00', home: 'arg', away: 'bra', stadium: 'metlife' },
];

function toMatch(f: SeedFixture): Match {
  const kickoff = new Date(`${f.date}T${f.time}:00Z`);
  const now = Date.now();
  const start = kickoff.getTime();
  const end = start + 110 * 60 * 1000; // ~110 min window incl. stoppage/half-time

  let status: Match['status'];
  let minute: number | null = null;
  let homeScore: number | null = null;
  let awayScore: number | null = null;

  if (f.status) {
    status = f.status;
    homeScore = f.homeScore ?? null;
    awayScore = f.awayScore ?? null;
    minute = f.minute ?? null;
  } else if (now < start) {
    status = 'upcoming';
  } else if (now >= start && now < end) {
    status = 'live';
    minute = Math.min(90, Math.floor((now - start) / 60000));
    homeScore = f.homeScore ?? 0;
    awayScore = f.awayScore ?? 0;
  } else {
    status = 'finished';
    homeScore = f.homeScore ?? 1;
    awayScore = f.awayScore ?? 0;
  }

  return {
    id: f.id,
    stage: f.stage,
    group: f.group,
    kickoff: kickoff.toISOString(),
    status,
    minute,
    homeScore,
    awayScore,
    homeTeam: team(f.home),
    awayTeam: team(f.away),
    stadium: stadium(f.stadium),
  };
}

export function getSeedMatches(): Match[] {
  return FIXTURES.map(toMatch).sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );
}
