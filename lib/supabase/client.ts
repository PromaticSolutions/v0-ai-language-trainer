import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseKey) {
    console.error("[v0] Supabase environment variables not found in client")
    // Return a dummy client that won't crash the app
    throw new Error("Supabase configuration missing")
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
