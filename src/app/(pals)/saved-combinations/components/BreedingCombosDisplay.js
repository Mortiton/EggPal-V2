"use client";

import React, { useState } from "react";
import SavedBreedingList from "./SavedBreedingList";
import ChildButton from "./ChildButton";
import styles from "./styles/BreedingCombosDisplay.module.css";

/**
 * BreedingCombos component that displays the breeding combinations for a selected child.
 *
 * @param {{ combos: Object }} props - The breeding combinations grouped by child.
 * @param {string} props.userId - The user ID.
 * @returns {JSX.Element} A React component.
 */
export default function BreedingCombosDisplay({ combos, userId }) {
  const [selectedChild, setSelectedChild] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Handles the click event on a child button.
   *
   * @param {string} child - The child that was clicked.
   */
  const handleChildClick = (child) => {
    setSelectedChild((prevChild) => {
      if (prevChild === child) {
        return null;
      } else {
        setSearchTerm("");
        return child;
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.childGrid}>
        {Object.entries(combos).map(([child, combos]) => (
          <ChildButton
            key={child}
            child={child}
            combos={combos}
            userId={userId}
            onClick={handleChildClick}
            isSelected={selectedChild === child}
            aria-pressed={selectedChild === child}
          />
        ))}
      </div>
      {selectedChild && (
        <>
          <h3 className={styles.subText}>
            Breeding combinations for {selectedChild}
          </h3>
          <SavedBreedingList
            breedingCombos={combos[selectedChild]}
            userId={userId}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            aria-label={`Saved breeding combinations for ${selectedChild}`}
          />
        </>
      )}
    </div>
  );
}

BreedingCombosDisplay.displayName = 'BreedingCombosDisplay'