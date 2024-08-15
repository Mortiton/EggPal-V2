import React from "react";
import FavouritePalsDisplay from "./components/FavouritePalsDisplay";
import { redirect } from "next/navigation";
import { getUser } from '@/app/utils/getUser';

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
  const user = await getUser();

  if (!user) {
    return redirect("/login");
  }

  return (

      <FavouritePalsDisplay />

  );
}