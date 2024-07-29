import React from "react";
import { getPals } from "@/app/services/palService";
import PalDetailsDisplay from "./components/PalDetailsDisplay";
import styles from "./page.module.css";
import { getSession } from "@/app/services/authService";
import { FavouritesProvider } from "@/app/context/FavouritesContext";
import { SavedCombinationsProvider } from "@/app/context/SavedCombinationsContext";

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
  const palId = params.palId;
  const palData = await getPals([palId]);
  const session = await getSession();

  if (!palData || palData.length === 0) {
    return <div>No Pal information available.</div>;
  }

  const pal = palData[0];

  return (
    <FavouritesProvider initialSession={session}>
      <SavedCombinationsProvider initialSession={session}>
        <div className={styles.mainContainer}>
          <PalDetailsDisplay pal={pal} />
        </div>
      </SavedCombinationsProvider>
    </FavouritesProvider>
  );
}

PalPage.displayName = "PalPage";
