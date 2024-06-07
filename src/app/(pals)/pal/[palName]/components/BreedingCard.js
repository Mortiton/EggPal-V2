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

export default function BreedingCard({ parent1, parent2, userId, breedingComboId, savedBreedingCombos }) {
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    setFavourite(savedBreedingCombos.some(combo => combo.breeding_combo_id === breedingComboId));
  }, [savedBreedingCombos, breedingComboId]);

  const toggleFavourite = async () => {
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
        <Link href={`/pal/${encodeURIComponent(parent1.name)}`} passHref>
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
        <Link href={`/pal/${encodeURIComponent(parent2.name)}`} passHref>
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
