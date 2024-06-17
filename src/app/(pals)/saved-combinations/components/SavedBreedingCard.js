import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles/SavedBreedingCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { removeSavedBreedingCombo } from "../actions";

/**
 * SavedBreedingCard component that displays the breeding details for two parent entities and allows removal.
 *
 * @component
 * @param {{ userId: string, breedingComboId: string, parent1: { name: string, image: string }, parent2: { name: string, image: string } }} props
 * @returns {JSX.Element} A React component.
 */
export default function SavedBreedingCard({
  userId,
  breedingComboId,
  parent1,
  parent2,
}) {
  /**
   * Handles the remove event on the remove icon.
   */
  const handleRemove = async () => {
    await removeSavedBreedingCombo(userId, breedingComboId);
  };

  return (
    <div className={styles.card}>
      <div className={styles.parent}>
      <Link href={`/pal/${encodeURIComponent(parent1.name)}`} passHref aria-label={`Link to ${parent1.name}`}>
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
      <Link href={`/pal/${encodeURIComponent(parent2.name)}`} passHref aria-label={`Link to ${parent2.name}`}>
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
