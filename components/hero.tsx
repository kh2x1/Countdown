'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from '@/components/countdown-timer';
import { flagUrl, formatMatchDate, formatMatchTime, localTimeZone } from '@/lib/format';
import type { Match } from '@/lib/types';

/** Big hero featuring the next upcoming match (or the live/most recent one). */
export function Hero({ featured }: { featured: Match | null }) {
  if (!featured) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={featured.stadium.image}
          alt={featured.stadium.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
      </div>

      <div className="container relative py-14 sm:py-20">
        <Badge variant="gold" className="mb-4">
          {featured.status === 'live' ? 'Live now' : 'Next kickoff'} ·{' '}
          {featured.group ? `Group ${featured.group}` : featured.stage}
        </Badge>

        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          The road to glory runs through{' '}
          <span className="bg-gradient-to-r from-wc-green via-wc-gold to-wc-red bg-clip-text text-transparent">
            North America
          </span>
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Team name={featured.homeTeam.name} code={featured.homeTeam.code} />
          <span className="text-2xl font-light text-muted-foreground">vs</span>
          <Team name={featured.awayTeam.name} code={featured.awayTeam.code} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatMatchDate(featured.kickoff)} · {formatMatchTime(featured.kickoff)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {featured.stadium.name}, {featured.stadium.city}
          </span>
        </div>

        {featured.status === 'upcoming' && (
          <div className="mt-7 max-w-md">
            <CountdownTimer target={featured.kickoff} size="lg" />
            <p className="mt-2 text-xs text-muted-foreground">
              Shown in your local time ({localTimeZone()})
            </p>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Button asChild size="lg">
            <Link href={`/match/${featured.id}`}>View match details</Link>
          </Button>
          <Button asChild variant="glass" size="lg">
            <Link href="#matches">Browse all matches</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Team({ name, code }: { name: string; code: string }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={flagUrl(code, 160)}
        alt={`${name} flag`}
        width={56}
        height={42}
        className="h-10 w-14 rounded object-cover ring-1 ring-white/20"
      />
      <span className="text-xl font-bold sm:text-2xl">{name}</span>
    </div>
  );
}
