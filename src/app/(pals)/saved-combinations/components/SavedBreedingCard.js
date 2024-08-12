"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles/SavedBreedingCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSavedCombinations } from "@/app/context/SavedCombinationsContext";

export default function SavedBreedingCard({
  breedingComboId,
  parent1,
  parent2,
}) {
  const { removeCombination, session } = useSavedCombinations();

  const handleRemove = async () => {
    if (session?.user) {
      await removeCombination(breedingComboId);
    }
  };
  return (
    <div className={styles.card}>
      <div className={styles.parent}>
        <Link
          href={`/pal/${encodeURIComponent(parent1.id)}`}
          passHref
          aria-label={`Link to ${parent1.name}`}
        >
          <Image
            src={parent1.image}
            alt={parent1.name}
            className={styles.parentImage}
            height={80}
            width={80}
            unoptimized="true"
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
          href={`/pal/${encodeURIComponent(parent2.id)}`}
          passHref
          aria-label={`Link to ${parent2.name}`}
        >
          <Image
            src={parent2.image}
            alt={parent2.name}
            className={styles.parentImage}
            height={80}
            width={80}
            unoptimized="true"
          />
        </Link>
        <span className={styles.parentName}>{parent2.name}</span>
      </div>
      <button
        className={styles.removeIcon}
        onClick={handleRemove}
        aria-label="remove"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
}
