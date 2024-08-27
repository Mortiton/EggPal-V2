import React from "react";
import BreedingCombosDisplay from "./components/BreedingCombosDisplay";
import styles from "./page.module.css";

/**
 * Metadata for the saved combinations page
 * @type {Object} Represents the Metadata object from Next.js
 */
export const metadata = {
  title: "Saved Breeding Combinations",
  description: "View your saved breeding combinations",
};

/**
 * Renders the page displaying the user's saved breeding combinations
 * @returns {JSX.Element} The rendered saved breeding combinations page
 */
export default function SavedBreedingPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Saved Breeding Combinations</h2>
      <BreedingCombosDisplay />
    </div>
  );
}
