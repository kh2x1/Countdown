'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, RefreshCw, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MatchCard } from '@/components/match-card';
import { useFavorites } from '@/lib/use-favorites';
import { MATCH_STAGES, type Match, type MatchStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const STATUS_FILTERS: { label: string; value: 'all' | MatchStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Live', value: 'live' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Finished', value: 'finished' },
];

const STAGE_FILTERS = ['All', ...MATCH_STAGES] as const;

export function MatchExplorer({ matches }: { matches: Match[] }) {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | MatchStatus>('all');
  const [stage, setStage] = useState<(typeof STAGE_FILTERS)[number]>('All');
  const [favOnly, setFavOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Auto-refresh server data every 60s so live scores/status stay current.
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 60_000);
    return () => clearInterval(id);
  }, [router]);

  const manualRefresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return matches.filter((m) => {
      if (status !== 'all' && m.status !== status) return false;
      if (stage !== 'All' && m.stage !== stage) return false;
      if (favOnly && !favorites.includes(m.id)) return false;
      if (q) {
        const haystack = [
          m.homeTeam.name,
          m.awayTeam.name,
          m.stadium.name,
          m.stadium.city,
          m.stadium.country,
          m.stage,
          m.group ? `group ${m.group}` : '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [matches, query, status, stage, favOnly, favorites]);

  return (
    <section id="matches" className="space-y-6">
      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams, stadiums or cities…"
              className="pl-10"
              aria-label="Search matches"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={favOnly ? 'default' : 'glass'}
              onClick={() => setFavOnly((v) => !v)}
              className="shrink-0"
            >
              <Heart className={cn('h-4 w-4', favOnly && 'fill-current')} />
              Favorites
            </Button>
            <Button variant="glass" size="icon" onClick={manualRefresh} aria-label="Refresh">
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
            </Button>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                status === f.value
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Stage filter */}
        <div className="flex flex-wrap gap-2">
          {STAGE_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={cn(
                'rounded-full border px-3.5 py-1 text-xs font-medium transition-all',
                stage === s
                  ? 'border-wc-gold/40 bg-wc-gold/15 text-wc-gold'
                  : 'border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{' '}
        {matches.length} matches
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] py-16 text-center">
          <p className="text-lg font-semibold">No matches found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, i) => (
            <div
              key={m.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
            >
              <MatchCard match={m} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
