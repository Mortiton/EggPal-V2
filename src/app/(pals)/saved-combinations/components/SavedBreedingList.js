"use client";

import React, { useState } from 'react';
import SavedBreedingCard from './SavedBreedingCard';
import SearchBar from '@/app/components/SearchBar';
import styles from './styles/SavedBreedingList.module.css';

/**
 * SavedBreedingList component that filters and displays saved breeding combinations based on search terms.
 *
 * @param {{ userId: string, breedingCombos: Array }} props
 * @returns {JSX.Element} A React component.
 */
export default function SavedBreedingList({ userId, breedingCombos }) {
  const [searchTerm, setSearchTerm] = useState("");
  console.log(breedingCombos)

  const filteredCombos = breedingCombos.filter(combo =>
    combo.parent1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    combo.parent2.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <SearchBar onSearch={setSearchTerm} />
      {filteredCombos.length > 0 ? (
        <div className={styles.breedingList}>
          {filteredCombos.map((combo, index) => (
            <SavedBreedingCard
              key={index}
              userId={userId}
              breedingComboId={combo.breeding_combo_id}
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