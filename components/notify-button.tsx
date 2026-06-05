'use client';

import { Bell, BellRing } from 'lucide-react';
import { useNotifications } from '@/lib/use-notifications';
import { cn } from '@/lib/utils';

export function NotifyButton({
  matchId,
  kickoff,
  className,
  withLabel = false,
}: {
  matchId: string;
  kickoff: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { isSet, toggle } = useNotifications();
  const active = isSet(matchId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void toggle(matchId, kickoff);
      }}
      aria-pressed={active}
      aria-label={active ? 'Cancel kickoff reminder' : 'Remind me before kickoff'}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur transition-all hover:bg-white/10',
        withLabel ? 'h-9 px-3 text-xs font-medium' : 'h-9 w-9',
        active && 'border-wc-gold/40 text-wc-gold',
        className
      )}
    >
      {active ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
      {withLabel && <span>{active ? 'Reminder on' : 'Remind me'}</span>}
    </button>
  );
}
