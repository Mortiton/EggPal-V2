import React from "react";
import { getPals, getTypes, getWorkTypes } from "./services/palService"
import PalList from "./components/PalList";
import styles from "./page.module.css";


/**
 * Metadata for the HomePage component.
 */
export const metadata = {
  title: "EggPal",
  description:
    "EggPal- The Palworld database for breeding combinations and pals",
  keywords:
    "home, pals, list, discover, palworld, pal, calculator, save, base skills, filter",
};

/**
 * HomePage component that renders the home page.
 * It fetches data about pals, work types, and types using service functions
 * and passes the data to the respective components.
 *
 * @component
 * @returns {JSX.Element} A React component.
 */
export default async function HomePage() {
  // Fetch data about pals, work types, and types
  const [pals, workTypes, types] = await Promise.all([
    getPals(),
    getWorkTypes(),
    getTypes()
  ]);

  // Render the home page with the PalList and dropdown components, passing the fetched data as props
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <PalList pals={pals} workTypes={workTypes} types={types} />
      </div>
    </div>
  );
}

HomePage.displayName = 'HomePage';