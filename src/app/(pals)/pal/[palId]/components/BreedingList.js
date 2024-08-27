"use client";

import React, { useState } from "react";
import BreedingCard from "./BreedingCard";
import SearchBar from "@/app/components/SearchBar";
import styles from "./styles/BreedingList.module.css";

/**
 * @typedef {Object} BreedingCombo
 * @property {string} id - The unique identifier of the breeding combination
 * @property {string} parent1_id - The ID of the first parent pal
 * @property {string} parent1_name - The name of the first parent pal
 * @property {string} parent1_image - The image URL of the first parent pal
 * @property {string} parent2_id - The ID of the second parent pal
 * @property {string} parent2_name - The name of the second parent pal
 * @property {string} parent2_image - The image URL of the second parent pal
 */

/**
 * @typedef {Object} BreedingListProps
 * @property {BreedingCombo[]} breedingCombos - Array of breeding combinations to display
 * @property {Object|null} user - The current user object, or null if not logged in
 */

/**
 * Displays a list of breeding combinations with search functionality
 * @param {BreedingListProps} props - The component props
 * @returns {JSX.Element} The rendered breeding list
 */
const BreedingList = ({ breedingCombos, user }) => {
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Filters the breeding combinations based on the search term
   * @type {BreedingCombo[]}
   */
  const filteredCombos = breedingCombos.filter((combo) => {
    const parent1Name = combo.parent1_name?.toLowerCase() || "";
    const parent2Name = combo.parent2_name?.toLowerCase() || "";
    return (
      parent1Name.includes(searchTerm.toLowerCase()) ||
      parent2Name.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchBar
          onSearch={setSearchTerm}
          aria-label="Search breeding combinations"
        />
      </div>
      {filteredCombos.length > 0 ? (
        <div
          className={styles.breedingList}
          role="list"
          aria-label="List of breeding combinations"
        >
          {filteredCombos.map((combo, index) => (
            <BreedingCard
              key={index}
              parent1={{
                id: combo.parent1_id,
                name: combo.parent1_name,
                image: combo.parent1_image,
              }}
              parent2={{
                id: combo.parent2_id,
                name: combo.parent2_name,
                image: combo.parent2_image,
              }}
              breedingComboId={combo.id}
              user={user}
            />
          ))}
        </div>
      ) : (
        <p className={styles.noCombosMessage}>
          No breeding combinations available.
        </p>
      )}
    </div>
  );
};

BreedingList.displayName = "BreedingList";

export default React.memo(BreedingList);
