import React from "react";
import { getPals } from "@/app/services/palService";
import PalDetailsDisplay from "./components/PalDetailsDisplay";
import styles from "./page.module.css";
import { getUser } from "@/app/services/authService";

// Function to generate dynamic metadata based on the Pal's ID.
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

/**
 * PalPage component that renders a page with details and breeding combinations of a Pal.
 * It displays a PalDetailsCard component and a BreedingList component.
 *
 * @component
 * @param {Object} params - The parameters passed to the component.
 * @param {string} params.palId - The ID of the Pal.
 * @returns {JSX.Element} A React component.
 */
export default async function PalPage({ params }) {
  // let user = null;
  // try {
  //   user = await getUser();
  // } catch (error) {
  //   console.error('Failed to fetch user:', error);
  // }
  
  const palId = params.palId;
  const palData = await getPals([palId]);

  if (!palData || palData.length === 0) {
    return <div>No Pal information available.</div>;
  }

  const pal = palData[0];

  return (
    <div className={styles.mainContainer}>
      <PalDetailsDisplay pal={pal}  />
    </div>
  );
}

PalPage.displayName = 'PalPage';

