import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for use in Client Components.
 *
 * Do not add get/set/remove cookie handlers here or anywhere else in this
 * project — @supabase/ssr uses getAll/setAll only. See lib/supabase/server.ts
 * and src/proxy.ts for the server-side equivalents.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
