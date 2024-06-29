import React from "react";
import { getFavouritePals } from "./actions";
import PalCard from "@/app/components/PalCard";
import styles from "./page.module.css";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export const metadata = {
  title: 'Your Favourite Pals',
  description: 'View your favourite pals',
};

/**
 * FavouritePalsPage component
 * Fetches and displays the user's favourite pals.
 * @returns {JSX.Element} The rendered JSX element
 */
export default async function FavouritePalsPage() {
  // Create a Supabase client
  const supabase = createClient();

  // Fetch the authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // If no user is authenticated, redirect to the login page
  if (!user) {
    redirect("/login"); 
    return null;
  }

  // Fetch the user's favourite pals
  const favouritePals = await getFavouritePals(user.id);

  // Render a message if no favourite pals are found
  if (!favouritePals || favouritePals.length === 0) {
    return <div className={styles.noFavText}>No favourite pals found. Click the star icon on their pages to see them here.</div>;
  }

  // Render the list of favourite pals
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Favourite Pals</h2>
      <p className={styles.description}>Below are your favourite pals. Click the pal to view their page.</p>
      <div className={styles.palGrid}>
        {favouritePals.map((pal) => (
          <Link
            className={styles.cardLink}
            key={pal.id}
            href={`/pal/${encodeURIComponent(pal.name)}`}
            passHref
            role="listitem"
            aria-label={`View details for ${pal.name}`}
          >
            <PalCard pal={pal} />
          </Link>
        ))}
      </div>
    </div>
  );
}

FavouritePalsPage.displayName = 'FavouritePalsPage'