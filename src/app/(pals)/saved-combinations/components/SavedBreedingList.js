"use client";

import React from "react";
import SavedBreedingCard from "./SavedBreedingCard";
import styles from "./styles/SavedBreedingList.module.css";

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