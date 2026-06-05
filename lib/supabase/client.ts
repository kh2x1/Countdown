'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client. Returns `null` when the project has not been
 * configured, so callers can gracefully fall back to bundled seed data.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
