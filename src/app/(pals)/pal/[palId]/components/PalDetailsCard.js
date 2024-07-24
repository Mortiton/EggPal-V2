"use client";
import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/PalDetailsCard.module.css";
import WorkIcon from "@/app/components/WorkIcon";

/**
 * PalDetailsCard component that renders a card with details about a pal.
 * It displays a favourite icon, the pal's name, image, description, and base skills.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {Object} props.pal - The pal.
 * @param {boolean} props.isFavourited - Whether the pal is favourited.
 * @param {function} props.onToggleFavourite - Function to toggle the favourite status.
 * @returns {JSX.Element} A React component.
 */
export default function PalDetailsCard({ pal, isFavourited, onToggleFavourite }) {
  const { skills } = pal;

  return (
    <div className={styles.container}>
      <FontAwesomeIcon
        icon={isFavourited ? fasStar : farStar}
        className={styles.favoriteIcon}
        aria-label="Toggle Favourite"
        data-favourite={isFavourited ? "filled" : "empty"}
        onClick={onToggleFavourite}
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
        unoptimized
      />
      <p className={styles.description}>{pal.description}</p>
      <h2>Base Skills</h2>
      <div className={styles.baseSkills} role="list" aria-label="List of base skills">
        {skills.map((skill) => (
          <div className={styles.workEntry} key={skill.skill_name}>
            <Image src={skill.skill_icon_url} alt={skill.skill_name} width={24} height={24} />
            <span className={styles.workName}>{skill.skill_name.replace("_", " ")}:</span>
            <span className={styles.level}>{skill.skill_level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

PalDetailsCard.displayName = 'PalDetailsCard';
