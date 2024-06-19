import React from 'react';
import { getPals } from './actions';
import PalList from './components/PalList';
import styles from './page.module.css';

/**
 * Metadata for the HomePage component.
 */
export const metadata = {
  title: 'EggPal',
  description: 'EggPal- The Palworld database for breeding combinations and pals',
  keywords: 'home, pals, list, discover, palworld, pal, calculator, save, base skills',
};

/**
 * HomePage component that renders the home page.
 * It fetches data about pals using the getPals function and passes the data to the PalList component.
 * If the getPals function returns null (indicating an error), the PalList component will receive null as a prop.
 *
 * @component
 * @returns {JSX.Element} A React component.
 */
export default async function HomePage() {
  // Fetch data about pals
  const pals = await getPals();

  // Render the home page with the PalList component, passing the fetched data as a prop
  return (
    <div className={styles.container}>
    <div className={styles.innerContainer}>
      <PalList pals={pals} />
      </div>
    </div>
  );
}