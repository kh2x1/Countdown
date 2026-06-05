import Link from 'next/link';
import { Trophy } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-wc-green via-wc-blue to-wc-red shadow-lg">
            <Trophy className="h-5 w-5 text-white" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight">World Cup 2026</span>
            <span className="text-[11px] text-muted-foreground">Match Center</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/#matches"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            Matches
          </Link>
          <Link
            href="/#stadiums"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            Stadiums
          </Link>
        </nav>
      </div>
    </header>
  );
}
