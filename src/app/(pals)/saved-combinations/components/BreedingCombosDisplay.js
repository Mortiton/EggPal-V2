"use client";

import React, { useState, useEffect } from "react";
import { useSavedCombinations } from "@/app/context/SavedCombinationsContext";
import ChildButton from "./ChildButton";
import SavedBreedingList from "./SavedBreedingList";
import styles from "./styles/BreedingCombosDisplay.module.css";

export default function BreedingCombosDisplay() {
  const { savedCombinations, isLoading } = useSavedCombinations();
  const [selectedChild, setSelectedChild] = useState(null);
  const [groupedCombos, setGroupedCombos] = useState({});

  useEffect(() => {
    const grouped = savedCombinations.reduce((acc, combo) => {
      const childName = combo.child.name;
      if (!acc[childName]) {
        acc[childName] = [];
      }
      acc[childName].push(combo);
      return acc;
    }, {});
    setGroupedCombos(grouped);
  }, [savedCombinations]);

  const handleChildClick = (child) => {
    setSelectedChild((prevChild) => prevChild === child ? null : child);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  const hasSavedCombos = Object.keys(groupedCombos).length > 0;

  return (
    <>
      <p className={styles.description}>
        {hasSavedCombos
          ? "Click on a pal to view its saved breeding combinations."
          : "No saved breeding combinations found. Click the heart icon on breeding combinations to save them here."}
      </p>
      {hasSavedCombos && (
        <div className={styles.container}>
          <div className={styles.childGrid}>
            {Object.entries(groupedCombos).map(([child, combos]) => (
              <ChildButton
                key={child}
                child={child}
                combos={combos}
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
              <SavedBreedingList
                breedingCombos={groupedCombos[selectedChild]}
                aria-label={`Saved breeding combinations for ${selectedChild}`}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}