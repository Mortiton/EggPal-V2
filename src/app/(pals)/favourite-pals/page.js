import React from "react";
import { getUser } from "@/app/services/authService";
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
  const user = await getUser();

  if (!user) {
    return redirect("/login");
  }

  return <FavouritePalsDisplay />;
}