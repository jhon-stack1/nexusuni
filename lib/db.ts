import { createClient } from '@supabase/supabase-js'

// Server-side only — service role key bypasses RLS
// Sirf API routes mein use hoga, kabhi client-side nahi
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase environment variables not set')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
