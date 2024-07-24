"use client";

import React, { useState, useEffect } from "react";
import { useSavedCombinations } from "@/app/context/SavedCombinationsContext";
import ChildButton from "./ChildButton";
import SavedBreedingList from "./SavedBreedingList";
import styles from "./styles/BreedingCombosDisplay.module.css";

export default function BreedingCombosDisplay() {
  const { savedCombinations } = useSavedCombinations();
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

  return (
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
  );
}