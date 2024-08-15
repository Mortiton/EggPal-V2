import React from 'react';
import BreedingCombosDisplay from './components/BreedingCombosDisplay';
import { getUser } from '@/app/utils/getUser';
import styles from './page.module.css';

export const metadata = {
  title: 'Saved breeding combinations',
  description: 'View your saved breeding combinations',
};

export default async function SavedBreedingPage() {
  const user = await getUser();


  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (

      <div className={styles.container}>
        <h2 className={styles.title}>Saved Breeding Combinations</h2>
        <BreedingCombosDisplay />
      </div>

  );
}