import { updateSession } from "@/app/utils/supabase/middleware";
import { NextResponse } from "next/server";

/**
 * @typedef {Object} UserInfo
 * @property {string} userId - The unique identifier of the user
 * @property {string} userEmail - The email address of the user
 */

/**
 * Middleware function to handle session updates, user authentication, and route protection
 * @async
 * @function middleware
 * @param {Object} request - The incoming request object (NextRequest from next/server)
 * @returns {Promise<Object>} The response object (NextResponse from next/server)
 */
export async function middleware(request) {
  // First, update the session
  const response = await updateSession(request);

  /**
   * Extract user information from the response headers
   * @type {UserInfo}
   */
  const userId = response.headers.get("x-user-id");
  const userEmail = response.headers.get("x-user-email");

  // If there is user information, ensure it's set in the headers for all routes
  if (userId && userEmail) {
    response.headers.set("x-user-id", userId);
    response.headers.set("x-user-email", userEmail);
  } else {
    // If no user info, remove the headers
    response.headers.delete("x-user-id");
    response.headers.delete("x-user-email");
  }

  /**
   * List of routes that require authentication
   * @type {string[]}
   */
  const protectedRoutes = [
    "/profile",
    "/favourite-pals",
    "/saved-combinations",
  ];

  // Check if the request is for a protected route
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!userId || !userEmail) {
      // If there's no user information, redirect to the login page
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // For all routes, ensure the user information is available in the headers
  if (userId && userEmail) {
    response.headers.set("x-user-id", userId);
    response.headers.set("x-user-email", userEmail);
  }

  return response;
}

/**
 * Configuration object for the middleware
 * @type {Object}
 * @property {string[]} matcher - Array of route patterns to match for middleware execution
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
