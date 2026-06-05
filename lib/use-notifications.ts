'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'wc2026:reminders';
const EVENT = 'wc2026:reminders-changed';
const LEAD_MS = 15 * 60 * 1000; // notify 15 minutes before kickoff

function read(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function write(value: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Schedules a browser notification ~15 minutes before kickoff. Reminders are
 * persisted so they survive reloads; pending ones are re-armed on mount.
 */
export function useNotifications() {
  const [reminders, setReminders] = useState<Record<string, number>>({});
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setReminders(read());
    if ('Notification' in window) setPermission(Notification.permission);
    const sync = () => setReminders(read());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  // Re-arm timers for any pending reminders.
  useEffect(() => {
    if (!('Notification' in window)) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const [id, kickoff] of Object.entries(reminders)) {
      const fireAt = kickoff - LEAD_MS;
      const delay = fireAt - Date.now();
      if (delay <= 0 || delay > 1000 * 60 * 60 * 24) continue; // skip past / >24h
      timers.push(
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification('⚽ Kickoff soon!', {
              body: 'A match you follow starts in about 15 minutes.',
              icon: '/icons/icon-192.png',
              tag: `wc-${id}`,
            });
          }
        }, delay)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [reminders]);

  const toggle = useCallback(
    async (id: string, kickoffIso: string) => {
      if ('Notification' in window && Notification.permission === 'default') {
        const result = await Notification.requestPermission();
        setPermission(result);
      }
      const current = read();
      if (current[id]) {
        delete current[id];
      } else {
        current[id] = new Date(kickoffIso).getTime();
      }
      write(current);
    },
    []
  );

  const isSet = useCallback((id: string) => Boolean(reminders[id]), [reminders]);

  return { reminders, toggle, isSet, permission };
}
