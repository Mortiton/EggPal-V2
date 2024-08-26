import React from "react";
import PalDetailsDisplay from "./components/PalDetailsDisplay";
import styles from "./page.module.css";
import { getPals, getBreedingCombinations } from "@/app/lib/api/supabase";
import { getUser } from "@/app/utils/getUser";

/**
 * @typedef {Object} Skill
 * @property {string} skill_name - The name of the skill
 * @property {number} work_order - The order of the skill in the work list
 * @property {number} skill_level - The level of the skill
 * @property {string} skill_icon_url - The URL of the skill's icon
 */

/**
 * @typedef {Object} Pal
 * @property {string} id - The unique identifier of the pal
 * @property {string} name - The name of the pal
 * @property {string} type1 - The primary type of the pal
 * @property {string|null} type2 - The secondary type of the pal, if any
 * @property {string} description - A description of the pal
 * @property {string} image_url - The URL of the pal's image
 * @property {string} type1_icon_url - The URL of the icon for the pal's primary type
 * @property {string|null} type2_icon_url - The URL of the icon for the pal's secondary type, if any
 * @property {Skill[]} skills - An array of skills the pal possesses
 */

/**
 * @typedef {Object} BreedingCombo
 * @property {string} id - The unique identifier of the saved breeding combination
 * @property {string} breeding_combo_id - The identifier of the breeding combination
 * @property {string} parent1_id - The ID of the first parent pal
 * @property {string} parent1_name - The name of the first parent pal
 * @property {string} parent1_image - The image URL of the first parent pal
 * @property {string} parent2_id - The ID of the second parent pal
 * @property {string} parent2_name - The name of the second parent pal
 * @property {string} parent2_image - The image URL of the second parent pal
 * @property {string} child_id - The ID of the child pal
 * @property {string} child_name - The name of the child pal
 * @property {string} child_image - The image URL of the child pal
 */

/**
 * Generates metadata for the pal page
 * @param {Object} params - The params object containing the palId
 * @param {string} params.palId - The ID of the pal
 * @returns {Promise<Object>} The metadata object for the page
 */
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
 * @component PalPage
 * @description Renders a page with detailed information about a specific pal, including breeding combinations
 * @param {Object} props - The component props
 * @param {Object} props.params - The route parameters
 * @param {string} props.params.palId - The ID of the pal to display
 * @returns {Promise<JSX.Element>} The rendered pal details page
 */
export default async function PalPage({ params }) {
  const user = await getUser();

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
      <PalDetailsDisplay
        pal={pal}
        breedingCombos={breedingCombos}
        user={user}
      />
    </div>
  );
}

PalPage.displayName = "PalPage";
