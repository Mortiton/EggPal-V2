"use client";

import React, { useState } from "react";
import SavedBreedingList from "./SavedBreedingList";
import ChildButton from "./ChildButton";
import styles from "./styles/BreedingCombosDisplay.module.css";

/**
 * BreedingCombos component that displays the breeding combinations for a selected child.
 *
 * @param {{ combos: Object }} props - The breeding combinations grouped by child.
 * @returns {JSX.Element} A React component.
 */
export default function BreedingCombosDisplay({ combos, userId }) {
  const [selectedChild, setSelectedChild] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChildClick = (child) => {
    setSelectedChild((prevChild) => {
      if (prevChild === child) {
        return null;
      } else {
        setSearchTerm(""); // Reset search term when a new child is selected
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
          />
        ))}
      </div>
      {selectedChild && (
        <>
          <h3 className={styles.subText}>
            Breeding combinations for {selectedChild}
          </h3>
          {/* <SavedBreedingList breedingCombos={combos[selectedChild]} userId={userId} /> */}
          <SavedBreedingList
            breedingCombos={combos[selectedChild]}
            userId={userId}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </>
      )}
    </div>
  );
}
