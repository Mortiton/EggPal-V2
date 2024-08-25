"use client";

import React, { useState, useEffect } from "react";
import { useSavedCombinations } from "@/app/context/SavedCombinationsContext";
import ChildButton from "./ChildButton";
import SavedBreedingList from "./SavedBreedingList";
import styles from "./styles/BreedingCombosDisplay.module.css";

/**
 * @typedef {Object} BreedingCombo
 * @property {string} id - The unique identifier of the breeding combination
 * @property {string} breeding_combo_id - The identifier of the breeding combination
 * @property {string} parent1_id - The ID of the first parent pal
 * @property {string} parent1_name - The name of the first parent pal
 * @property {string} parent1_image - The image URL of the first parent pal
 * @property {string} parent2_id - The ID of the second parent pal
 * @property {string} parent2_name - The name of the second parent pal
 * @property {string} parent2_image - The image URL of the second parent pal
 * @property {string} child_id - The ID of the child pal
 * @property {string} child_name - The name of the child pal
 * @property {string} child_image - The image URL of the child pal
 */

/**
 * @component BreedingCombosDisplay
 * @description Displays saved breeding combinations grouped by child pal
 * @returns {JSX.Element} The rendered breeding combinations display
 */
export default function BreedingCombosDisplay() {
  const { savedCombinations, isLoading } = useSavedCombinations();
  const [selectedChild, setSelectedChild] = useState(null);
  const [groupedCombos, setGroupedCombos] = useState({});

  /**
   * Groups saved combinations by child pal
   */
  useEffect(() => {
    const grouped = savedCombinations.reduce((acc, combo) => {
      if (combo && combo.child && combo.child.name) {
        const childName = combo.child.name;
        if (!acc[childName]) {
          acc[childName] = [];
        }
        acc[childName].push(combo);
      }
      return acc;
    }, {});
    setGroupedCombos(grouped);
  }, [savedCombinations]);

  /**
   * Handles the click event on a child pal button
   * @param {string} child - The name of the clicked child pal
   */
  const handleChildClick = (child) => {
    setSelectedChild((prevChild) => (prevChild === child ? null : child));
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
