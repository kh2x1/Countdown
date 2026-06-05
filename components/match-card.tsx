'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from '@/components/countdown-timer';
import { StatusBadge } from '@/components/status-badge';
import { FavoriteButton } from '@/components/favorite-button';
import { NotifyButton } from '@/components/notify-button';
import { flagUrl, formatMatchDate, formatMatchTime } from '@/lib/format';
import type { Match } from '@/lib/types';

function TeamRow({ name, code, score, showScore }: {
  name: string;
  code: string;
  score?: number | null;
  showScore: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <Image
          src={flagUrl(code, 80)}
          alt={`${name} flag`}
          width={32}
          height={24}
          className="h-6 w-9 rounded-sm object-cover ring-1 ring-white/10"
        />
        <span className="truncate font-semibold text-foreground">{name}</span>
      </div>
      {showScore && (
        <span className="text-xl font-bold tabular-nums text-foreground">
          {score ?? 0}
        </span>
      )}
    </div>
  );
}

export function MatchCard({ match }: { match: Match }) {
  const showScore = match.status !== 'upcoming';

  return (
    <Card className="group relative overflow-hidden bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40">
      {/* Stadium banner */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={match.stadium.image}
          alt={match.stadium.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <StatusBadge status={match.status} minute={match.minute} />
          <Badge variant="gold">{match.group ? `Group ${match.group}` : match.stage}</Badge>
        </div>
        <div className="absolute right-3 top-3">
          <FavoriteButton matchId={match.id} />
        </div>
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-xs text-white/90">
          <MapPin className="h-3.5 w-3.5" />
          <span className="font-medium drop-shadow">{match.stadium.name}</span>
        </div>
      </div>

      <Link href={`/match/${match.id}`} className="block p-5">
        <div className="space-y-3">
          <TeamRow {...match.homeTeam} score={match.homeScore} showScore={showScore} />
          <TeamRow {...match.awayTeam} score={match.awayScore} showScore={showScore} />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatMatchDate(match.kickoff)}</span>
          <span>{formatMatchTime(match.kickoff)} · {match.stadium.city}</span>
        </div>

        {match.status === 'upcoming' && (
          <div className="mt-4">
            <CountdownTimer target={match.kickoff} />
          </div>
        )}
      </Link>

      {match.status === 'upcoming' && (
        <div className="flex gap-2 px-5 pb-5">
          <NotifyButton matchId={match.id} kickoff={match.kickoff} withLabel className="flex-1" />
        </div>
      )}
    </Card>
  );
}
