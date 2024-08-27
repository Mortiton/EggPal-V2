"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles/BreedingCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useSavedCombinations } from "@/app/context/SavedCombinationsContext";

/**
 * @typedef {Object} Parent
 * @property {string} id - The unique identifier of the parent pal
 * @property {string} name - The name of the parent pal
 * @property {string} image - The image URL of the parent pal
 */

/**
 * @typedef {Object} BreedingCardProps
 * @property {Parent} parent1 - The first parent in the breeding combination
 * @property {Parent} parent2 - The second parent in the breeding combination
 * @property {string} breedingComboId - The unique identifier for the breeding combination
 * @property {Object|null} user - The current user object, or null if not logged in
 */

/**
 * Displays a breeding combination card with parent information and save functionality
 * @param {BreedingCardProps} props - The component props
 * @returns {JSX.Element} The rendered breeding card
 */
export default function BreedingCard({
  parent1,
  parent2,
  breedingComboId,
  user,
}) {
  const { savedCombinations, addCombination, removeCombination } =
    useSavedCombinations();

  /**
   * Determines if the current breeding combination is saved
   * @type {boolean}
   */
  const isSaved = useMemo(
    () =>
      savedCombinations.some(
        (combo) => combo.breedingComboId === breedingComboId
      ),
    [savedCombinations, breedingComboId]
  );

  /**
   * Toggles the saved status of the breeding combination
   * @async
   * @function
   */
  const toggleSaved = useCallback(async () => {
    // Check if user is authenticated and display toast if not
    if (!user) {
      toast.info("Please log in to save breeding combinations.");
      return;
    }

    try {
      if (isSaved) {
        await removeCombination(breedingComboId);
      } else {
        await addCombination(breedingComboId);
      }
    } catch (error) {
      console.error("Error toggling saved status:", error.message);
    }
  }, [user, isSaved, breedingComboId, addCombination, removeCombination]);

  return (
    <div className={styles.card}>
      <div className={styles.parent}>
        <Link
          href={`/pal/${parent1.id}`}
          passHref
          aria-label={`Link to ${parent1.name}`}
        >
          <Image
            src={parent1.image}
            alt={parent1.name}
            className={styles.parentImage}
            height={80}
            width={80}
            loading="lazy"
          />
        </Link>
        <span className={styles.parentName}>{parent1.name}</span>
      </div>
      <FontAwesomeIcon
        icon={faPlus}
        className={styles.plusIcon}
        aria-label="plus"
      />
      <div className={styles.parent}>
        <Link
          href={`/pal/${parent2.id}`}
          passHref
          aria-label={`Link to ${parent2.name}`}
        >
          <Image
            src={parent2.image}
            alt={parent2.name}
            className={styles.parentImage}
            height={80}
            width={80}
            loading="lazy"
          />
        </Link>
        <span className={styles.parentName}>{parent2.name}</span>
      </div>
      <FontAwesomeIcon
        icon={isSaved ? fasHeart : farHeart}
        className={styles.favouriteIcon}
        onClick={toggleSaved}
        data-favourite={isSaved ? "filled" : "empty"}
        aria-label={isSaved ? "Remove from saved" : "Save combination"}
      />
    </div>
  );
}

BreedingCard.displayName = "BreedingCard";
