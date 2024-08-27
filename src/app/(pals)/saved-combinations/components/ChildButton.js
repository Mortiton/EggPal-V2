"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import styles from "./styles/ChildButton.module.css";

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
 * @typedef {Object} ChildButtonProps
 * @property {string} child - The name of the child pal
 * @property {BreedingCombo[]} combos - Array of breeding combinations for this child
 * @property {Function} onClick - Callback function to handle button click
 * @property {boolean} isSelected - Whether this child button is currently selected
 */

/**
 * Renders a button for a child pal in the breeding combinations display
 * @param {ChildButtonProps} props - The component props
 * @returns {JSX.Element} The rendered child button
 */
export default function ChildButton({ child, combos, onClick, isSelected }) {
  /**
   * Handles the click event on the button
   * @function
   */
  const handleClick = () => {
    onClick(child, combos);
  };

  const childImage = combos[0]?.child.image || "/images/default.png";
  const childName = combos[0]?.child.name || "Unknown";

  return (
    <div className={styles.childContainer}>
      <button
        className={`${styles.childButton} ${isSelected ? styles.selected : ""}`}
        onClick={handleClick}
        aria-pressed={isSelected}
      >
        <Image
          src={childImage}
          alt={childName}
          className={styles.childImage}
          width={100}
          height={100}
          unoptimized
        />
        <span className={styles.childName}>{childName}</span>
      </button>
    </div>
  );
}

ChildButton.displayName = "ChildButton";
