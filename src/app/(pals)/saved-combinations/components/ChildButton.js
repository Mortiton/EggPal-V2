"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import SavedBreedingCard from './SavedBreedingCard';
import styles from './styles/ChildButton.module.css';

/**
 * ChildButton component that displays the child image and name and shows the saved breeding combinations on click.
 *
 * @param {{ child: string, combos: Array }} props
 * @returns {JSX.Element} A React component.
 */
export default function ChildButton({ child, combos }) {
  const [showCombos, setShowCombos] = useState(false);

  const toggleCombos = () => {
    setShowCombos(!showCombos);
  };

  const childImage = combos[0]?.child.image || '/images/default.png';
  const childName = combos[0]?.child.name || 'Unknown';

  return (
    <div className={styles.childContainer}>
      <div className={styles.childButton} onClick={toggleCombos}>
        <Image
          src={childImage}
          alt={childName}
          className={styles.childImage}
          width={100}
          height={100}
          unoptimized
        />
        <span className={styles.childName}>{childName}</span>
      </div>
      {showCombos && (
        <div className={styles.combosContainer}>
          {combos.map((combo, index) => (
            <SavedBreedingCard
              key={index}
              userId={combo.userId}
              breedingComboId={combo.breeding_combo_id}
              parent1={combo.parent1}
              parent2={combo.parent2}
            />
          ))}
        </div>
      )}
    </div>
  );
}
