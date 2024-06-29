import React from "react";
import { getPalDetailsAndFavorites, fetchSavedBreedingCombos } from "./actions";
import BreedingList from "./components/BreedingList";
import PalDetailsCard from "./components/PalDetailsCards";
import styles from "./page.module.css";
import { createClient } from "@/app/utils/supabase/server";

// Function to generate dynamic metadata based on the Pal's name.
export async function generateMetadata({ params }) {
  const palName = decodeURIComponent(params.palName);
  const data = await getPalDetailsAndFavorites(null, palName);

  if (!data || !data.pal_info) {
    return {
      title: "Pal not found",
      description: "No details available",
    };
  }

  return {
    title: `${data.pal_info.name} - Details and Breeding Combinations`,
    description: `All about ${data.pal_info.name}'s base skills and breeding combinations`,
  };
}

/**
 * PalPage component that renders a page with details and breeding combinations of a Pal.
 * It displays a PalDetailsCard component and a BreedingList component.
 *
 * @component
 * @param {Object} params - The parameters passed to the component.
 * @param {string} params.palName - The name of the Pal.
 * @returns {JSX.Element} A React component.
 */

export default async function PalPage({ params }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  const palName = decodeURIComponent(params.palName);
  const data = await getPalDetailsAndFavorites(user ? user.id : null, palName);
  
  if (!data || !data.pal_info) {
    return <div>No Pal information available.</div>;
  }

  const { pal_info: pal, breeding_combos: breedingCombos, favorites } = data;
  const savedBreedingCombos = user ? await fetchSavedBreedingCombos(user.id) : [];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.palDetailsContainer}>
        <PalDetailsCard pal={pal} user={user} userFavorites={favorites} />
      </div>
      <div className={styles.breedingContainer}>
        <h2>Breeding Combinations</h2>
        <BreedingList aria-label='List of breeding combinations' breedingCombos={breedingCombos} user={user} savedBreedingCombos={savedBreedingCombos} />
      </div>
    </div>
  );
}
PalPage.displayName = 'PalPage'