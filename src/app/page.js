import React from "react";
import PalList from "./components/PalList";
import styles from "./page.module.css";
import { getCardData } from "./lib/api/supabase";
import AuthWrapper from "./components/AuthWrapper";
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

export default async function HomePage({ user }) {

  const { pals, workTypes, types } = await getCardData();

  return (
    <AuthWrapper user={user} requireAuth={false}>
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <PalList pals={pals} workTypes={workTypes} types={types} />
      </div>
    </div>
    </AuthWrapper>
  );
}
HomePage.displayName = 'HomePage';