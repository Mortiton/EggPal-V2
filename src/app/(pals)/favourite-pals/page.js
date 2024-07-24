import React from "react";
import { getUser } from "@/app/services/authService";
import { getFavouritePals } from "@/app/services/userService";
import FavouritePalsDisplay from "./components/FavouritePalsDisplay";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your Favourite Pals",
  description: "View your favourite pals",
};

/**
 * FavouritePalsPage component
 * Fetches and displays the user's favourite pals.
 * @returns {JSX.Element} The rendered JSX element
 */
export default async function FavouritePalsPage() {
  // Fetch the authenticated user
  const user = await getUser();

  // If no user is authenticated, redirect to the login page
  if (!user) {
    return redirect("/login");
  }

  // Fetch the user's favourite pals
  const favouritePals = await getFavouritePals(user.id);

  // Pass data to the client component via context
  return (
    <FavouritePalsDisplay initialUser={user} initialFavourites={favouritePals} />
  );
}

FavouritePalsPage.displayName = "FavouritePalsPage";