import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

/**
 * POST function to handle POST requests.
 * It checks if a user is logged in. If a user is logged in, it signs out the user.
 * After signing out the user, it revalidates the cache for the root path and redirects to the root path.
 *
 * @param {Object} req - The request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 */
export async function POST(req) {
  const supabase = createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If a user is logged in, sign out the user
  if (user) {
    await supabase.auth.signOut()
  }

  // Revalidate the cache for the root path
  revalidatePath('/', 'layout')

  // Redirect to the root path
  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}