import React from "react";
import FavouritePalsDisplay from "./components/FavouritePalsDisplay";

/**
 * Metadata for the favourite pal page
 * @type {Object} Represents the Metadata object from Next.js
 */
export const metadata = {
  title: "Your Favourite Pals",
  description: "View your favourite pals",
};

/**
 * Renders the page displaying the user's favourite pals
 * @returns {JSX.Element} The FavouritePalsDisplay component
 */
export default function FavouritePalsPage() {
  return <FavouritePalsDisplay />;
}
