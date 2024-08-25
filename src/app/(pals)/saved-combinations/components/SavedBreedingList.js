"use client";

import React from "react";
import SavedBreedingCard from "./SavedBreedingCard";
import styles from "./styles/SavedBreedingList.module.css";

/**
 * @typedef {Object} Parent
 * @property {string} id - The unique identifier of the parent pal
 * @property {string} name - The name of the parent pal
 * @property {string} image - The image URL of the parent pal
 */

/**
 * @typedef {Object} BreedingCombo
 * @property {string} id - The unique identifier of the saved breeding combination
 * @property {string} breedingComboId - The identifier of the breeding combination
 * @property {Parent} parent1 - The first parent in the breeding combination
 * @property {Parent} parent2 - The second parent in the breeding combination
 */

/**
 * @typedef {Object} SavedBreedingListProps
 * @property {BreedingCombo[]} [breedingCombos=[]] - Array of saved breeding combinations to display
 */

/**
 * @component SavedBreedingList
 * @description Renders a list of saved breeding combinations
 * @param {SavedBreedingListProps} props - The component props
 * @returns {JSX.Element} The rendered list of saved breeding combinations
 */
export default function SavedBreedingList({ breedingCombos = [] }) {
  return (
    <div className={styles.container}>
      {breedingCombos.length > 0 ? (
        <div className={styles.breedingList} role="list">
          {breedingCombos.map((combo) => (
            <SavedBreedingCard
              key={combo.id}
              breedingComboId={combo.breedingComboId}
              parent1={combo.parent1}
              parent2={combo.parent2}
            />
          ))}
        </div>
      ) : (
        <p>No combinations saved.</p>
      )}
    </div>
  );
}
