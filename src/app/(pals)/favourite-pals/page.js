// app/favourite-pals/page.js
import React from "react";
import { getSession } from "@/app/services/authService";
import FavouritePalsDisplay from "./components/FavouritePalsDisplay";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your Favourite Pals",
  description: "View your favourite pals",
};

/**
 * FavouritePalsPage component
 * Fetches the session and renders the FavouritePalsDisplay component.
 * @returns {JSX.Element} The rendered JSX element
 */
export default async function FavouritePalsPage() {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  return <FavouritePalsDisplay initialSession={session} />;
}