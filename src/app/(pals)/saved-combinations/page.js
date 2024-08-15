import React from 'react';
import BreedingCombosDisplay from './components/BreedingCombosDisplay';
import styles from './page.module.css';

export const metadata = {
  title: 'Saved Breeding Combinations',
  description: 'View your saved breeding combinations',
};

export default function SavedBreedingPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Saved Breeding Combinations</h2>
      <BreedingCombosDisplay />
    </div>
  );
}