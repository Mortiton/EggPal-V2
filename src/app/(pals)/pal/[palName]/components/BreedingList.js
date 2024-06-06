"use client";

import React, { useState } from "react";
import BreedingCard from "./BreedingCard";
import SearchBar from "@/app/components/SearchBar";
import styles from "./styles/BreedingList.module.css";

export default function BreedingList({ breedingCombos }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCombos = breedingCombos.filter((combo) =>
        combo.parent1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        combo.parent2.name.toLowerCase().includes(searchTerm.toLowerCase())
);

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
                        parent1={combo.parent1}
                        parent2={combo.parent2}
                    />
                ))}
            </div>
        ) : (
            <p className={styles.noCombosMessage}>No breeding combinations available.</p>
        )}
    </div>
);
}