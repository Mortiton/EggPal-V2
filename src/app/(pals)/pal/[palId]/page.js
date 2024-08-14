import React from "react";
import PalDetailsDisplay from "./components/PalDetailsDisplay";
import styles from "./page.module.css";
import { getPals, getBreedingCombinations } from '@/app/lib/api/supabase';
import { getUser } from '@/app/utils/getUser';

export async function generateMetadata({ params }) {
  const palId = params.palId;
  const palData = await getPals([palId]);

  if (!palData || palData.length === 0) {
    return {
      title: "Pal not found",
      description: "No details available",
    };
  }

  const pal = palData[0];

  return {
    title: `${pal.name} - Details and Breeding Combinations`,
    description: `All about ${pal.name}'s base skills and breeding combinations`,
  };
}

export default async function PalPage({ params }) {
  const user = await getUser();
  console.log('User in PalPage:', user);
  const palId = params.palId;
  //Fetch the palData based on Pal ID within the URL
  const palData = await getPals([palId]);

  //Display message if no pal data is returned
  if (!palData || palData.length === 0) {
    return <div>No Pal information available.</div>;
  }

  const pal = palData[0];
  //Fetch breeding combinations based on the pal name
  const breedingCombos = await getBreedingCombinations(pal.name);


  return (
    <div className={styles.mainContainer}>
      <PalDetailsDisplay pal={pal} breedingCombos={breedingCombos} user={user} />
    </div>
  );
}

PalPage.displayName = "PalPage";