import React from "react";
import Image from "next/image";
import styles from "./styles/PalCard.module.css";
import WorkIcon from "./WorkIcon";
import { getBlurDataURL } from "../lib/imageUtils";

/**
 * @typedef {Object} Skill
 * @property {string} skill_name - The name of the skill
 * @property {number} work_order - The order of the skill in the work list
 * @property {number} skill_level - The level of the skill
 * @property {string} skill_icon_url - The URL of the skill's icon
 */

/**
 * @typedef {Object} Pal
 * @property {string} name - The name of the pal
 * @property {string} type1 - The primary type of the pal
 * @property {string|null} type2 - The secondary type of the pal, if any
 * @property {string} image_url - The URL of the pal's image
 * @property {string} type1_icon_url - The URL of the icon for the pal's primary type
 * @property {string|null} type2_icon_url - The URL of the icon for the pal's secondary type, if any
 * @property {Skill[]} skills - An array of skills the pal possesses
 */

/**
 * PalCard component for displaying information about a single pal.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Pal} props.pal - The pal object containing all the necessary information
 * @returns {JSX.Element} The rendered PalCard component
 */
export default function PalCard({ pal }) {
  /**
   * Sorts the pal's skills based on their work order.
   *
   * @type {Skill[]}
   */
  const sortedSkills = pal.skills.sort((a, b) => a.work_order - b.work_order);

  /**
   * Gets the blur data URL for the pal's image.
   *
   * @type {string}
   */
  const blurDataURL = getBlurDataURL();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.typeIcons} aria-label={`Types of ${pal.name}`}>
          {pal.type1_icon_url && (
            <Image
              src={pal.type1_icon_url}
              alt={`Type: ${pal.type1}`}
              width={24}
              height={24}
              className={styles.typeIcon}
              loading="lazy"
            />
          )}
          {pal.type2_icon_url && (
            <Image
              src={pal.type2_icon_url}
              alt={`Type: ${pal.type2}`}
              width={24}
              height={24}
              className={styles.typeIcon}
              loading="lazy"
            />
          )}
        </div>
        <div className={styles.cardImageWrapper}>
          {pal.image_url && (
            <Image
              className={styles.cardImage}
              src={pal.image_url}
              alt={`Image of ${pal.name}`}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
              loading="lazy"
              placeholder="blur"
              blurDataURL={blurDataURL}
            />
          )}
        </div>
        <h3 className={styles.cardTitle} aria-label={pal.name}>
          {pal.name}
        </h3>
        <div
          className={styles.workIcons}
          aria-label={`Work attributes of ${pal.name}`}
        >
          {sortedSkills.map((skill) => (
            <WorkIcon
              key={skill.skill_name}
              iconUrl={skill.skill_icon_url}
              value={skill.skill_level}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

PalCard.displayName = "PalCard";
