"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles/BreedingCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { addSavedBreedingCombo, removeSavedBreedingCombo } from "../actions";
import { toast } from 'react-toastify';

/**
 * BreedingCard component that renders a card with two parent Pals and a favorite icon.
 * It displays images and names of the parent Pals, and a favorite icon that can be toggled.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {Object} props.parent1 - The first parent Pal.
 * @param {Object} props.parent2 - The second parent Pal.
 * @param {string} props.userId - The ID of the user.
 * @param {string} props.breedingComboId - The ID of the breeding combination.
 * @param {Array} props.savedBreedingCombos - The saved breeding combinations of the user.
 * @param {Object} props.user - The user.
 * @returns {JSX.Element} A React component.
 */
export default function BreedingCard({ parent1, parent2, userId, breedingComboId, savedBreedingCombos, user }) {
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    if (user) {
      setFavourite(savedBreedingCombos.some(combo => combo.breeding_combo_id === breedingComboId));
    }
  }, [savedBreedingCombos, breedingComboId, user]);

  const toggleFavourite = async () => {
    if (!user) {
      toast.info('Please log in to save breeding combinations.');
      return;
    }
    try {
      if (favourite) {
        await removeSavedBreedingCombo(userId, breedingComboId);
      } else {
        await addSavedBreedingCombo(userId, breedingComboId);
      }
      setFavourite(!favourite);
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
    }
  };

  const parent1Image = parent1?.image || '/images/default.png';
  const parent2Image = parent2?.image || '/images/default.png';

  return (
    <div className={styles.card}>
      <div className={styles.parent}>
        <Link href={`/pal/${encodeURIComponent(parent1.name)}`} passHref aria-label={`Link to ${parent1?.name || 'Unknown Parent'}`}>
          <Image
            src={parent1Image}
            alt={parent1?.name || 'Unknown Parent'}
            className={styles.parentImage}
            height={80}
            width={80}
            unoptimized
          />
        </Link>
        <span className={styles.parentName}>{parent1?.name || 'Unknown Parent'}</span>
      </div>
      <FontAwesomeIcon
        icon={faPlus}
        className={styles.plusIcon}
        aria-label="plus"
      />
      <div className={styles.parent}>
        <Link href={`/pal/${encodeURIComponent(parent2.name)}`} passHref aria-label={`Link to ${parent2?.name || 'Unknown Parent'}`}>
          <Image
            src={parent2Image}
            alt={parent2?.name || 'Unknown Parent'}
            className={styles.parentImage}
            height={80}
            width={80}
            unoptimized
          />
        </Link>
        <span className={styles.parentName}>{parent2?.name || 'Unknown Parent'}</span>
      </div>
      <FontAwesomeIcon
        icon={favourite ? fasHeart : farHeart}
        className={styles.favouriteIcon}
        onClick={toggleFavourite}
        data-favorite={favourite ? "filled" : "empty"}
        aria-label="favourite"
      />
    </div>
  );
}
