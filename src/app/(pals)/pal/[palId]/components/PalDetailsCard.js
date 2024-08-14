"use client";
import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import styles from "./styles/PalDetailsCard.module.css";

export default function PalDetailsCard({
  pal,
  isFavourited,
  onToggleFavourite,
  user,
}) {
  const { skills } = pal;

  const handleFavouriteClick = () => {
    if (!user) { // Check if the user is authenticated and display a toast if not
      toast.info("Please sign in to favourite pals.");
      return;
    }
    onToggleFavourite();
  };

  return (
    <div className={styles.container}>
      <FontAwesomeIcon
        icon={isFavourited ? fasStar : farStar}
        className={styles.favoriteIcon}
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
