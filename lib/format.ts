import type { CountdownParts } from './types';

/** Resolve a flag image URL from an ISO country code via flagcdn.com. */
export function flagUrl(code: string, width = 80): string {
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;
}

/** Break a future timestamp into days/hours/minutes/seconds. */
export function getCountdownParts(target: string | Date): CountdownParts {
  const targetMs = new Date(target).getTime();
  const total = Math.max(0, targetMs - Date.now());

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { days, hours, minutes, seconds, total };
}

/** Format a kickoff date in the viewer's local timezone. */
export function formatMatchDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format a kickoff time in the viewer's local timezone. */
export function formatMatchTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'local time';
  }
}
