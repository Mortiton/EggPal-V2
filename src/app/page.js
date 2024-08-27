import React from "react";
import PalList from "./components/PalList";
import styles from "./page.module.css";
import { getCardData } from "./lib/api/supabase";

/**
 * Metadata for the home page
 * @type {Object} Represents the Metadata object from Next.js
 */
export const metadata = {
  title: "EggPal",
  description:
    "EggPal- The Palworld database for breeding combinations and pals",
  keywords:
    "home, pals, list, discover, palworld, pal, calculator, save, base skills, filter",
};

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
 * @typedef {Object} Skill
 * @property {string} skill_name - The name of the skill
 * @property {number} work_order - The order of the skill in the work list
 * @property {number} skill_level - The level of the skill
 * @property {string} skill_icon_url - The URL of the skill's icon
 */

/**
 * @typedef {Object} Icon
 * @property {string} icon_name - The name of the icon
 * @property {string} icon_url - The URL of the icon image
 * @property {string} category - The category of the icon (e.g., 'Work' or 'Type')
 * @property {number} work_order - The order for work types
 * @property {number} type_order - The order for pal types
 */

/**
 * @typedef {Icon} WorkType
 * @property {'Work'} category - Always 'Work' for work types
 */

/**
 * @typedef {Icon} PalType
 * @property {'Type'} category - Always 'Type' for pal types
 */

/**
 * Renders the home page with a list of pals
 * @returns {Promise<JSX.Element>} The rendered home page
 */
export default async function HomePage() {
  /**
   * Fetches the card data for pals, work types, and pal types
   * @type {{pals: Pal[], workTypes: WorkType[], types: PalType[]}}
   */
  const { pals, workTypes, types } = await getCardData();

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <PalList pals={pals} workTypes={workTypes} types={types} />
      </div>
    </div>
  );
}
HomePage.displayName = "HomePage";
