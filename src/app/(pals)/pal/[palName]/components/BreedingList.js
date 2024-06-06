"use client";

import React, { useState } from "react";
import BreedingCard from "./BreedingCard";
import SearchBar from "@/app/components/SearchBar";
import styles from "./styles/BreedingList.module.css";

export default function BreedingList({ breedingCombos, user, savedBreedingCombos }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) {
    return <p>User data is not available.</p>;
  }

  const filteredCombos = breedingCombos.filter((combo) => {
    const parent1Name = combo.parent1_name?.toLowerCase() || "";
    const parent2Name = combo.parent2_name?.toLowerCase() || "";
    return parent1Name.includes(searchTerm.toLowerCase()) || parent2Name.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchBar onSearch={setSearchTerm} />
      </div>
      {filteredCombos.length > 0 ? (
        <div className={styles.breedingList}>
          {filteredCombos.map((combo, index) => (
            <BreedingCard
              key={index}
              parent1={{ name: combo.parent1_name, image: combo.parent1_image }}
              parent2={{ name: combo.parent2_name, image: combo.parent2_image }}
              userId={user.id}
              breedingComboId={combo.id}
              savedBreedingCombos={savedBreedingCombos} // Pass the saved breeding combos
            />
          ))}
        </div>
      ) : (
        <p className={styles.noCombosMessage}>No breeding combinations available.</p>
      )}
    </div>
  );
}
