"use client";

import React from "react";
import { useFavourites } from "@/app/context/FavouritesContext";
import PalCard from "@/app/components/PalCard";
import styles from "../page.module.css";
import Link from "next/link";

export default function FavouritePalsDisplay() {
  const { favourites, session, isLoading } = useFavourites();

  if (isLoading) {
    return <div>Loading your favourite pals...</div>;
  }

  if (!session) {
    return <div>Please log in to view your favourite pals.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Favourite Pals</h2>
      <p className={styles.description}>
        {favourites && favourites.length > 0
          ? "Below are your favourite pals. Click the pal to view their page."
          : "No favourite pals found. Click the star icon on pal pages to see them here."}
      </p>
      {favourites && favourites.length > 0 ? (
        <div className={styles.palGrid}>
          {favourites.map((pal) => (
            <Link
              className={styles.cardLink}
              key={pal.id}
              href={`/pal/${encodeURIComponent(pal.id)}`}
              passHref
              role="listitem"
              aria-label={`View details for ${pal.name}`}
            >
              <PalCard pal={pal} />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}