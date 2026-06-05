export type MatchStatus = 'upcoming' | 'live' | 'finished';

export type MatchStage =
  | 'Group Stage'
  | 'Round of 32'
  | 'Round of 16'
  | 'Quarter Final'
  | 'Semi Final'
  | 'Third Place'
  | 'Final';

export const MATCH_STAGES: MatchStage[] = [
  'Group Stage',
  'Round of 32',
  'Round of 16',
  'Quarter Final',
  'Semi Final',
  'Third Place',
  'Final',
];

export interface Team {
  id: string;
  name: string;
  /** ISO 3166-1 alpha-2 code used to resolve the flag image (e.g. "us"). */
  code: string;
  group?: string;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity?: number;
  image: string;
}

export interface Match {
  id: string;
  stage: MatchStage;
  group?: string;
  /** ISO 8601 UTC kickoff timestamp. */
  kickoff: string;
  status: MatchStatus;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number | null;
  awayScore?: number | null;
  /** Minute of play, only meaningful while `status === 'live'`. */
  minute?: number | null;
  stadium: Stadium;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}
