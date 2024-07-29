import React from 'react';
import { getSession } from "@/app/services/authService";
import BreedingCombosDisplay from './components/BreedingCombosDisplay';
import { SavedCombinationsProvider } from '@/app/context/SavedCombinationsContext';
import styles from './page.module.css';

export const metadata = {
  title: 'Saved breeding combinations',
  description: 'View your saved breeding combinations',
};

export default async function SavedBreedingPage() {
  const session = await getSession();

  if (!session) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <SavedCombinationsProvider initialSession={session}>
      <div className={styles.container}>
        <h2 className={styles.title}>Saved Breeding Combinations</h2>
        <p className={styles.description}>Click on a pal to view its saved breeding combinations.</p>
        <BreedingCombosDisplay />
      </div>
    </SavedCombinationsProvider>
  );
}