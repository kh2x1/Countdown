import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">Match not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        We couldn&apos;t find that fixture. It may have been rescheduled or removed.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to match center</Link>
      </Button>
    </div>
  );
}
