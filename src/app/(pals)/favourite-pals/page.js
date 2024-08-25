import React from "react";
import FavouritePalsDisplay from "./components/FavouritePalsDisplay";

export const metadata = {
  title: "Your Favourite Pals",
  description: "View your favourite pals",
};

/**
 * FavouritePalsPage component
 * Renders the FavouritePalsDisplay component for authenticated users.
 * @returns {JSX.Element} The rendered JSX element
 */
export default function FavouritePalsPage() {
  return <FavouritePalsDisplay />;
}