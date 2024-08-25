"use client";

import React, { useMemo, useCallback } from "react";
import { useFavourites } from "@/app/context/FavouritesContext";
import PalDetailsCard from "./PalDetailsCard";
import BreedingList from "./BreedingList";
import styles from "../page.module.css";
import { toast } from "react-toastify";

/**
 * @typedef {Object} Pal
 * @property {string} id - The unique identifier of the pal
 * @property {string} name - The name of the pal
 * @property {string} image_url - The URL of the pal's image
 * @property {string} description - A description of the pal
 * @property {Object[]} skills - An array of the pal's skills
 */

/**
 * @typedef {Object} BreedingCombo
 * @property {string} id - The unique identifier of the breeding combination
 * @property {string} parent1_id - The ID of the first parent pal
 * @property {string} parent1_name - The name of the first parent pal
 * @property {string} parent1_image - The image URL of the first parent pal
 * @property {string} parent2_id - The ID of the second parent pal
 * @property {string} parent2_name - The name of the second parent pal
 * @property {string} parent2_image - The image URL of the second parent pal
 */

/**
 * @typedef {Object} PalDetailsDisplayProps
 * @property {Pal} pal - The pal object containing detailed information
 * @property {BreedingCombo[]} breedingCombos - Array of breeding combinations for the pal
 * @property {Object|null} user - The current user object, or null if not logged in
 */

/**
 * @component PalDetailsDisplay
 * @description Displays detailed information about a pal, including its details and breeding combinations
 * @param {PalDetailsDisplayProps} props - The component props
 * @returns {JSX.Element} The rendered pal details display
 */
const PalDetailsDisplay = ({ pal, breedingCombos, user }) => {
  const { favourites, addFavourite, removeFavourite } = useFavourites();

  /**
   * Determines if the current pal is favourited by the user
   * @type {boolean}
   */
  const isFavourited = useMemo(
    () => (user ? favourites.some((fav) => fav.id === pal.id) : false),
    [user, favourites, pal.id]
  );

  /**
   * Handles toggling the favourite status of the pal
   * @function
   */
  const handleToggleFavourite = useCallback(() => {
    if (!user) {
      toast.info("Please log in to favourite pals.");
      return;
    }
    if (isFavourited) {
      removeFavourite(pal.id);
    } else {
      addFavourite(pal);
    }
  }, [user, isFavourited, pal, addFavourite, removeFavourite]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.palDetailsContainer}>
        <PalDetailsCard
          pal={pal}
          isFavourited={isFavourited}
          onToggleFavourite={handleToggleFavourite}
          user={user}
        />
      </div>
      <div className={styles.breedingContainer}>
        <h2>Breeding Combinations</h2>
        <BreedingList breedingCombos={breedingCombos} user={user} />
      </div>
    </div>
  );
};

PalDetailsDisplay.displayName = "PalDetailsDisplay";

export default React.memo(PalDetailsDisplay);
