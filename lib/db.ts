import { createClient } from '@supabase/supabase-js'

// Server-side only — service role key bypasses RLS
// Only used in API routes, never on client-side
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Add it to your Vercel project settings → Vars.'
    )
  }

  if (!key) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'This must be set as a server-only variable in Vercel project settings → Vars. ' +
      'Do NOT use NEXT_PUBLIC_ prefix on this variable.'
    )
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
