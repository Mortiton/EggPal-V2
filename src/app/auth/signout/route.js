import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("Logout route triggered");
  const supabase = createClient();
  console.log("Supabase client created");

  try {
    // Check if a user's logged in
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError) {
      console.error("Error getting user:", getUserError);
      return NextResponse.redirect(new URL("/error", req.url), {
        status: 302,
      });
    }

    console.log(
      "User check completed. User:",
      user ? "Logged in" : "Not logged in"
    );

    // Always attempt to sign out, regardless of user state
    console.log("Attempting to sign out user");
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("Error signing out:", signOutError);
      return NextResponse.redirect(new URL("/error", req.url), {
        status: 302,
      });
    }

    console.log("Sign out attempt completed");

    // Revalidate the cache for the root path
    console.log("Revalidating cache");
    revalidatePath("/", "layout");

    // Redirect to the root path
    console.log("Redirecting to root path");
    return NextResponse.redirect(new URL("/", req.url), {
      status: 302,
    });
  } catch (error) {
    console.error("Unexpected error in logout route:", error);
    return NextResponse.redirect(new URL("/error", req.url), {
      status: 302,
    });
  }
}
