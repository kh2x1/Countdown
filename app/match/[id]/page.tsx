import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, CalendarDays, Clock, CloudSun, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from '@/components/countdown-timer';
import { StatusBadge } from '@/components/status-badge';
import { StadiumSection } from '@/components/stadium-section';
import { FavoriteButton } from '@/components/favorite-button';
import { NotifyButton } from '@/components/notify-button';
import { getMatchById } from '@/lib/data';
import { flagUrl, formatMatchDate, formatMatchTime, localTimeZone } from '@/lib/format';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatchById(id);
  if (!match) return { title: 'Match not found' };
  const title = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
  return {
    title,
    description: `${title} — ${match.stage} at ${match.stadium.name}, ${match.stadium.city}. ${formatMatchDate(
      match.kickoff
    )}.`,
  };
}

function TeamBlock({
  name,
  code,
  score,
  showScore,
}: {
  name: string;
  code: string;
  score?: number | null;
  showScore: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3 text-center">
      <Image
        src={flagUrl(code, 160)}
        alt={`${name} flag`}
        width={84}
        height={63}
        className="h-16 w-24 rounded-md object-cover ring-1 ring-white/20"
      />
      <span className="text-lg font-bold sm:text-xl">{name}</span>
      {showScore && (
        <span className="text-4xl font-extrabold tabular-nums">{score ?? 0}</span>
      )}
    </div>
  );
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const match = await getMatchById(id);
  if (!match) notFound();

  const showScore = match.status !== 'upcoming';

  return (
    <div>
      {/* Large stadium banner */}
      <section className="relative h-64 w-full overflow-hidden sm:h-96">
        <Image
          src={match.stadium.image}
          alt={match.stadium.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="container relative flex h-full flex-col justify-end pb-6">
          <Link
            href="/"
            className="absolute left-4 top-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-sm backdrop-blur transition-colors hover:bg-black/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <StatusBadge status={match.status} minute={match.minute} />
            <Badge variant="gold">
              {match.group ? `Group ${match.group}` : match.stage}
            </Badge>
          </div>
        </div>
      </section>

      <div className="container space-y-8 py-8">
        {/* Scoreline / matchup */}
        <Card className="bg-white/[0.03] backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <TeamBlock {...match.homeTeam} score={match.homeScore} showScore={showScore} />
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <span className="text-sm font-medium uppercase tracking-widest">
                  {match.status === 'finished' ? 'Full time' : 'vs'}
                </span>
                <Clock className="h-4 w-4" />
                <span className="text-xs">{formatMatchTime(match.kickoff)}</span>
              </div>
              <TeamBlock {...match.awayTeam} score={match.awayScore} showScore={showScore} />
            </div>

            {match.status === 'upcoming' && (
              <div className="mx-auto mt-8 max-w-md">
                <p className="mb-2 text-center text-sm text-muted-foreground">
                  Kicks off in
                </p>
                <CountdownTimer target={match.kickoff} size="lg" />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {formatMatchDate(match.kickoff)} · your local time ({localTimeZone()})
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-center gap-3">
              <FavoriteButton matchId={match.id} className="h-10 w-10" />
              {match.status === 'upcoming' && (
                <NotifyButton
                  matchId={match.id}
                  kickoff={match.kickoff}
                  withLabel
                  className="h-10"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Match info + weather */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-white/[0.03] backdrop-blur-xl lg:col-span-2">
            <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
              <Info icon={<CalendarDays className="h-4 w-4" />} label="Date" value={formatMatchDate(match.kickoff)} />
              <Info icon={<Clock className="h-4 w-4" />} label="Kickoff (local)" value={formatMatchTime(match.kickoff)} />
              <Info icon={<MapPin className="h-4 w-4" />} label="Venue" value={`${match.stadium.name}, ${match.stadium.city}`} />
              <Info icon={<CalendarDays className="h-4 w-4" />} label="Stage" value={match.group ? `Group ${match.group}` : match.stage} />
            </CardContent>
          </Card>

          {/* Optional weather (placeholder forecast) */}
          <Card className="bg-white/[0.03] backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <CloudSun className="h-4 w-4 text-wc-gold" />
                Match-day weather
              </p>
              <p className="mt-3 text-3xl font-bold">24°C</p>
              <p className="text-sm text-muted-foreground">
                Partly cloudy in {match.stadium.city}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Connect a weather API for live forecasts.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stadium details */}
        <div>
          <h2 className="mb-4 text-xl font-bold tracking-tight">Stadium</h2>
          <StadiumSection stadium={match.stadium} />
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 font-semibold">{value}</p>
    </div>
  );
}
