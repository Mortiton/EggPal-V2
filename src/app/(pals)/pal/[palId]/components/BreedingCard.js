"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles/BreedingCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { useSavedCombinations } from "@/app/context/SavedCombinationsContext";
import { useUser } from "@/app/context/UserContext";

export default function BreedingCard({ parent1, parent2, breedingComboId }) {
  const { user } = useUser();
  const { savedCombinations, addCombination, removeCombination } = useSavedCombinations();
  const [isSaved, setIsSaved] = useState(false);

  const checkIfSaved = useCallback(() => {
    if (user && savedCombinations) {
      return savedCombinations.some(combo => combo.breeding_combo_id === breedingComboId);
    }
    return false;
  }, [user, savedCombinations, breedingComboId]);

  useEffect(() => {
    setIsSaved(checkIfSaved());
  }, [checkIfSaved]);

  const toggleSaved = async () => {
    if (!user) {
      toast.info('Please log in to save breeding combinations.');
      return;
    }

    try {
      if (isSaved) {
        await removeCombination(breedingComboId);
      } else {
        await addCombination(breedingComboId);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling saved status:', error.message);
      toast.error('Failed to update saved status');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.parent}>
        <Link href={`/pal/${parent1.id}`} passHref aria-label={`Link to ${parent1.name}`}>
          <Image
            src={parent1.image}
            alt={parent1.name}
            className={styles.parentImage}
            height={80}
            width={80}
            unoptimized
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
        <Link href={`/pal/${parent2.id}`} passHref aria-label={`Link to ${parent2.name}`}>
          <Image
            src={parent2.image}
            alt={parent2.name}
            className={styles.parentImage}
            height={80}
            width={80}
            unoptimized
          />
        </Link>
        <span className={styles.parentName}>{parent2.name}</span>
      </div>
      <FontAwesomeIcon
        icon={isSaved ? fasHeart : farHeart}
        className={styles.favouriteIcon}
        onClick={toggleSaved}
        data-favorite={isSaved ? "filled" : "empty"}
        aria-label={isSaved ? "Remove from saved" : "Save combination"}
      />
    </div>
  );
}

BreedingCard.displayName = 'BreedingCard';