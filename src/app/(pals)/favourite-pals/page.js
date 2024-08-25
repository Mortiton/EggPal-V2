import React from "react";
import FavouritePalsDisplay from "./components/FavouritePalsDisplay";

/**
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: "Your Favourite Pals",
  description: "View your favourite pals",
};

/**
 * @component FavouritePalsPage
 * @description Renders the page displaying the user's favourite pals
 * @returns {JSX.Element} The FavouritePalsDisplay component
 */
export default function FavouritePalsPage() {
  return <FavouritePalsDisplay />;
}
