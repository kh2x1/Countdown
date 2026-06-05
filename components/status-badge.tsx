import { Badge } from '@/components/ui/badge';
import type { MatchStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

export function StatusBadge({
  status,
  minute,
  className,
}: {
  status: MatchStatus;
  minute?: number | null;
  className?: string;
}) {
  if (status === 'live') {
    return (
      <Badge variant="live" className={cn('uppercase', className)}>
        <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-red-500" />
        Live{typeof minute === 'number' ? ` · ${minute}'` : ''}
      </Badge>
    );
  }
  if (status === 'finished') {
    return (
      <Badge variant="finished" className={cn('uppercase', className)}>
        Finished
      </Badge>
    );
  }
  return (
    <Badge variant="upcoming" className={cn('uppercase', className)}>
      Upcoming
    </Badge>
  );
}
