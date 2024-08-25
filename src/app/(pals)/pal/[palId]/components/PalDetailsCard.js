"use client";
import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import styles from "./styles/PalDetailsCard.module.css";

/**
 * @typedef {Object} Skill
 * @property {string} skill_name - The name of the skill
 * @property {number} skill_level - The level of the skill
 * @property {string} skill_icon_url - The URL of the skill's icon
 */

/**
 * @typedef {Object} Pal
 * @property {string} name - The name of the pal
 * @property {string} image_url - The URL of the pal's image
 * @property {string} description - A description of the pal
 * @property {Skill[]} skills - An array of the pal's skills
 */

/**
 * @typedef {Object} PalDetailsCardProps
 * @property {Pal} pal - The pal object containing detailed information
 * @property {boolean} isFavourited - Whether the pal is currently favourited
 * @property {Function} onToggleFavourite - Function to toggle the favourite status
 * @property {Object|null} user - The current user object, or null if not logged in
 */

/**
 * @component PalDetailsCard
 * @description Displays detailed information about a pal, including its skills and favourite status
 * @param {PalDetailsCardProps} props - The component props
 * @returns {JSX.Element} The rendered pal details card
 */
export default function PalDetailsCard({
  pal,
  isFavourited,
  onToggleFavourite,
  user,
}) {
  const { skills } = pal;

  /**
   * Handles the click event on the favourite icon
   * @function
   */
  const handleFavouriteClick = () => {
    // Check if the user is authenticated and display a toast if not
    if (!user) {
      toast.info("Please sign in to favourite pals.");
      return;
    }
    onToggleFavourite();
  };

  return (
    <div className={styles.container}>
      <FontAwesomeIcon
        icon={isFavourited ? fasStar : farStar}
        className={styles.favouriteIcon}
        aria-label="Toggle Favourite"
        data-favourite={isFavourited ? "filled" : "empty"}
        onClick={handleFavouriteClick}
        role="button"
        tabIndex="0"
      />
      <h1>{pal.name}</h1>
      <Image
        src={pal.image_url}
        alt={pal.name}
        className={styles.image}
        width={120}
        height={120}
        loading="lazy"
      />
      <p className={styles.description}>{pal.description}</p>
      <h2>Base Skills</h2>
      <div
        className={styles.baseSkills}
        role="list"
        aria-label="List of base skills"
      >
        {skills.map((skill) => (
          <div className={styles.workEntry} key={skill.skill_name}>
            <Image
              src={skill.skill_icon_url}
              alt={skill.skill_name}
              width={24}
              height={24}
              loading="lazy"
            />
            <span className={styles.workName}>
              {skill.skill_name.replace("_", " ")}:
            </span>
            <span className={styles.level}>{skill.skill_level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

PalDetailsCard.displayName = "PalDetailsCard";
