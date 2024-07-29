import { updateSession } from '@/app/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // First, update the session
  const response = await updateSession(request)

  // Check if the request is for the /profile page
  if (request.nextUrl.pathname === '/profile') {
    // Create a Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
        },
      }
    )

    // Get the session
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      // If there's no session, redirect to the login page
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // For all other routes, return the updated session response
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}