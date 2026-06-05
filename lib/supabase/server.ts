import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Server Supabase client (read-only cookie handling is sufficient here since
 * the dashboard does not require authenticated mutations). Returns `null` when
 * the project is not configured.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // No-op: the public dashboard never needs to write cookies.
      },
    },
  });
}
