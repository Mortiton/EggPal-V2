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
 * @returns {JSX.Element} A React component.
 */
const BreedingList = ({ breedingCombos }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCombos = breedingCombos.filter((combo) => {
    const parent1Name = combo.parent1_name?.toLowerCase() || "";
    const parent2Name = combo.parent2_name?.toLowerCase() || "";
    return parent1Name.includes(searchTerm.toLowerCase()) || parent2Name.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchBar onSearch={setSearchTerm} aria-label="Search breeding combinations" />
      </div>
      {filteredCombos.length > 0 ? (
        <div className={styles.breedingList} role="list" aria-label="List of breeding combinations">
          {filteredCombos.map((combo, index) => (
            <BreedingCard
              key={index}
              parent1={{ id: combo.parent1_id, name: combo.parent1_name, image: combo.parent1_image }}
              parent2={{ id: combo.parent2_id, name: combo.parent2_name, image: combo.parent2_image }}
              breedingComboId={combo.id}
            />
          ))}
        </div>
      ) : (
        <p className={styles.noCombosMessage}>No breeding combinations available.</p>
      )}
    </div>
  );
};

BreedingList.displayName = 'BreedingList';

export default React.memo(BreedingList);
