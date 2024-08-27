"use client";

import React from "react";
import { useFavourites } from "@/app/context/FavouritesContext";
import PalCard from "@/app/components/PalCard";
import styles from "../page.module.css";
import Link from "next/link";

/**
 * @typedef {Object} Skill
 * @property {string} skill_name - The name of the skill
 * @property {number} work_order - The order of the skill in the work list
 * @property {number} skill_level - The level of the skill
 * @property {string} skill_icon_url - The URL of the skill's icon
 */

/**
 * @typedef {Object} Pal
 * @property {string} id - The unique identifier of the pal
 * @property {string} name - The name of the pal
 * @property {string} type1 - The primary type of the pal
 * @property {string|null} type2 - The secondary type of the pal, if any
 * @property {string} description - A description of the pal
 * @property {string} image_url - The URL of the pal's image
 * @property {string} type1_icon_url - The URL of the icon for the pal's primary type
 * @property {string|null} type2_icon_url - The URL of the icon for the pal's secondary type, if any
 * @property {Skill[]} skills - An array of skills the pal possesses
 */

/**
 * Displays the user's favourite pals. Handles loading states, empty states, and renders a grid of PalCards for favourites.
 * @returns {JSX.Element} The rendered favourite pals display
 */
export default function FavouritePalsDisplay() {
  const { favourites, user, isLoading } = useFavourites();

  if (!user) {
    return <div>Please log in to view your favourite pals.</div>;
  }

  /**
   * Displays the user's favourite pals. Handles loading states, empty states, and renders a grid of PalCards for favourites.
   * * @returns {JSX.Element} The rendered favourite pals display
   */
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Favourite Pals</h2>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : (
        <>
          <p className={styles.description}>
            {favourites && favourites.length > 0
              ? "Below are your favourite pals. Click the pal to view their page."
              : "No favourite pals found. Click the star icon on pal pages to see them here."}
          </p>
          {favourites && favourites.length > 0 && (
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
          )}
        </>
      )}
    </div>
  );
}
