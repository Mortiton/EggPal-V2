import React from "react";
import Image from "next/image";
import styles from "./styles/PalCard.module.css";
import WorkIcon from "./WorkIcon";

/**
 * PalCard component that renders a card for a pal.
 * It displays the pal's types, image, name, and work attributes.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {Object} props.pal - The pal object. It contains the pal's id, name, types, image URL, and work attributes.
 * @returns {JSX.Element} A React component.
 */
export default function PalCard({ pal }) {
  // Sort the skills based on the work_order
  const sortedSkills = pal.skills.sort((a, b) => a.work_order - b.work_order);

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
              priority
            />
          )}
          {pal.type2_icon_url && (
            <Image
              src={pal.type2_icon_url}
              alt={`Type: ${pal.type2}`}
              width={24}
              height={24}
              className={styles.typeIcon}
              priority
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
              style={{ objectFit: 'cover' }}
              priority
              placeholder="blur"
              blurDataURL={pal.image_url}
            />
          )}
        </div>
        <h3 className={styles.cardTitle} aria-label={pal.name}>{pal.name}</h3>
        <div className={styles.workIcons} aria-label={`Work attributes of ${pal.name}`}>
          {sortedSkills.map((skill) => (
            <WorkIcon key={skill.skill_name} iconUrl={skill.skill_icon_url} value={skill.skill_level} />
          ))}
        </div>
      </div>
    </div>
  );
}

PalCard.displayName = 'PalCard';
