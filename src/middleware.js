import { updateSession } from '@/app/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // First, update the session
  const response = await updateSession(request)

  // Get the user information from the headers
  const userId = response.headers.get('x-user-id')
  const userEmail = response.headers.get('x-user-email')

  // If there is user information, ensure it's set in the headers for all routes
  if (userId && userEmail) {
    response.headers.set('x-user-id', userId)
    response.headers.set('x-user-email', userEmail)
  } else {
    // If no user info, remove the headers to ensure consistency
    response.headers.delete('x-user-id')
    response.headers.delete('x-user-email')
  }

  // Check if the request is for a protected route 
  const protectedRoutes = ['/profile', '/favourite-pals', '/saved-combinations']
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!userId || !userEmail) {
      // If there's no user information, redirect to the login page
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // For all routes, ensure the user information is available in the headers
  if (userId && userEmail) {
    response.headers.set('x-user-id', userId)
    response.headers.set('x-user-email', userEmail)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}