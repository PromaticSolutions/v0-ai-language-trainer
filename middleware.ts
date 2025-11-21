import { updateSession } from "@/lib/supabase/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  if (response.status !== 200) {
    return response
  }

  if (request.nextUrl.pathname === "/") {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If Supabase is configured, check if user is logged in
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const { createClient } = await import("@/lib/supabase/server")
        const supabase = await createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      } catch (error) {
        // Silently fail - let user access homepage
      }
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
