"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import styles from "./styles/ChildButton.module.css";

/**
 * ChildButton component that displays the child image and name and shows the saved breeding combinations on click.
 *
 * @param {{ child: string, combos: Array, userId: string, onClick: function, isSelected: boolean }} props - The properties of the ChildButton component.
 * @returns {JSX.Element} A React component.
 */
export default function ChildButton({
  child,
  combos,
  onClick,
  isSelected,
}) {
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
