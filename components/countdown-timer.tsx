'use client';

import { useEffect, useState } from 'react';
import { getCountdownParts } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { CountdownParts } from '@/lib/types';

interface CountdownTimerProps {
  /** ISO kickoff timestamp. */
  target: string;
  size?: 'sm' | 'lg';
  className?: string;
  onComplete?: () => void;
}

const pad = (n: number) => n.toString().padStart(2, '0');

/**
 * Real-time countdown that ticks every second. Renders on the client only to
 * avoid hydration mismatches with the live clock.
 */
export function CountdownTimer({
  target,
  size = 'sm',
  className,
  onComplete,
}: CountdownTimerProps) {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const tick = () => {
      const next = getCountdownParts(target);
      setParts(next);
      if (next.total <= 0) onComplete?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target, onComplete]);

  const units = [
    { label: 'Days', value: parts?.days },
    { label: 'Hrs', value: parts?.hours },
    { label: 'Min', value: parts?.minutes },
    { label: 'Sec', value: parts?.seconds },
  ];

  return (
    <div
      className={cn('flex items-stretch gap-1.5', className)}
      role="timer"
      aria-label="Time until kickoff"
    >
      {units.map((u) => (
        <div
          key={u.label}
          className={cn(
            'flex flex-1 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 backdrop-blur',
            size === 'lg' ? 'min-w-[64px] px-3 py-2.5' : 'min-w-[44px] px-2 py-1.5'
          )}
        >
          <span
            className={cn(
              'font-bold tabular-nums tracking-tight text-foreground',
              size === 'lg' ? 'text-3xl' : 'text-lg'
            )}
          >
            {parts ? pad(u.value as number) : '--'}
          </span>
          <span
            className={cn(
              'uppercase tracking-widest text-muted-foreground',
              size === 'lg' ? 'text-[11px]' : 'text-[9px]'
            )}
          >
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
