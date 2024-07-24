"use client";

import React, { useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { useFavourites } from "@/app/context/FavouritesContext";
import PalCard from "@/app/components/PalCard";
import styles from "../page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FavouritePalsDisplay() {
  const { user } = useUser();
  const { favourites } = useFavourites();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null; 
  }

  if (!favourites || favourites.length === 0) {
    return (
      <div className={styles.noFavText}>
        No favourite pals found. Click the star icon on their pages to see them here.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Favourite Pals</h2>
      <p className={styles.description}>
        Below are your favourite pals. Click the pal to view their page.
      </p>
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
    </div>
  );
}