import { CalendarClock, Radio, Trophy, Users } from 'lucide-react';
import { Hero } from '@/components/hero';
import { MatchExplorer } from '@/components/match-explorer';
import { StadiumsShowcase } from '@/components/stadiums-showcase';
import { getMatches } from '@/lib/data';
import { STADIUMS } from '@/lib/seed-data';
import type { Match } from '@/lib/types';

function pickFeatured(matches: Match[]): Match | null {
  const live = matches.find((m) => m.status === 'live');
  if (live) return live;
  const upcoming = matches
    .filter((m) => m.status === 'upcoming')
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  return upcoming[0] ?? matches[matches.length - 1] ?? null;
}

export default async function HomePage() {
  const matches = await getMatches();
  const featured = pickFeatured(matches);

  const liveCount = matches.filter((m) => m.status === 'live').length;
  const upcomingCount = matches.filter((m) => m.status === 'upcoming').length;
  const totalCapacity = STADIUMS.reduce((sum, s) => sum + (s.capacity ?? 0), 0);

  const stats = [
    { icon: <Trophy className="h-5 w-5" />, label: 'Matches', value: matches.length },
    { icon: <Radio className="h-5 w-5" />, label: 'Live now', value: liveCount },
    { icon: <CalendarClock className="h-5 w-5" />, label: 'Upcoming', value: upcomingCount },
    { icon: <Users className="h-5 w-5" />, label: 'Host venues', value: STADIUMS.length },
  ];

  return (
    <>
      <Hero featured={featured} />

      <div className="container space-y-16 py-12">
        {/* Stats strip */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass flex items-center gap-3 rounded-xl p-4"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                {s.icon}
              </span>
              <div>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        <MatchExplorer matches={matches} />
        <StadiumsShowcase />

        <p className="text-center text-xs text-muted-foreground">
          Combined seating capacity across host venues:{' '}
          <span className="font-semibold text-foreground">
            {totalCapacity.toLocaleString()}
          </span>{' '}
          fans.
        </p>
      </div>
    </>
  );
}
