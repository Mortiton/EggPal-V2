"use client";

import React, { useState } from "react";
import BreedingCard from "./BreedingCard";
import SearchBar from "@/app/components/SearchBar";
import styles from "./styles/BreedingList.module.css";

/**
 * BreedingList component that renders a list of BreedingCard components.
 * It displays a search bar and a list of breeding combinations that match the search term.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {Array} props.breedingCombos - The breeding combinations.
 * @param {Object} props.user - The user.
 * @param {Array} props.savedBreedingCombos - The saved breeding combinations of the user.
 * @returns {JSX.Element} A React component.
 */
export default function BreedingList({ breedingCombos, user, savedBreedingCombos }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCombos = breedingCombos.filter((combo) => {
    const parent1Name = combo.parent1_name?.toLowerCase() || "";
    const parent2Name = combo.parent2_name?.toLowerCase() || "";
    return parent1Name.includes(searchTerm.toLowerCase()) || parent2Name.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchBar onSearch={setSearchTerm} aria-label="Search breeding combinations"/>
      </div>
      {filteredCombos.length > 0 ? (
        <div className={styles.breedingList} role="list" aria-label="List of breeding combinations">
          {filteredCombos.map((combo, index) => (
            <BreedingCard
              key={index}
              parent1={{ name: combo.parent1_name, image: combo.parent1_image }}
              parent2={{ name: combo.parent2_name, image: combo.parent2_image }}
              userId={user ? user.id : null}
              breedingComboId={combo.id}
              savedBreedingCombos={savedBreedingCombos}
              user={user} 
            />
          ))}
        </div>
      ) : (
        <p className={styles.noCombosMessage}>No breeding combinations available.</p>
      )}
    </div>
  );
}

BreedingList.displayName = 'BreedingList'