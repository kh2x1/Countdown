'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/use-favorites';
import { cn } from '@/lib/utils';

export function FavoriteButton({
  matchId,
  className,
}: {
  matchId: string;
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(matchId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(matchId);
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur transition-all hover:bg-white/10',
        className
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all',
          active ? 'fill-wc-red text-wc-red' : 'text-muted-foreground'
        )}
      />
    </button>
  );
}
