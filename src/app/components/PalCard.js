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
 * @param {Object} props.pal - The pal object. It contains the pal's id, name, types, and work attributes.
 * @returns {JSX.Element} A React component.
 */
export default function PalCard({ pal }) {
  // Prepare the paths for the pal's image and types' images
  const imagePath = `/images/pals/${pal.id}.png`;
  const type1Path = `/images/types/${pal.type1}.png`;
  const type2Path = pal.type2 ? `/images/types/${pal.type2}.png` : null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Display the pal's types */}
        <div className={styles.typeIcons}>
          {type1Path && (
            <Image 
              src={type1Path} 
              alt={pal.type1} 
              width={24}
              height={24}
              className={styles.typeIcon} />
          )}
          {type2Path && (
            <Image 
              src={type2Path} 
              alt={pal.type2} 
              width={24}
              height={24}
              className={styles.typeIcon} />
          )}
        </div>

        {/* Display the pal's image */}
        <div className={styles.cardImageWrapper}>
        <Image 
          className={styles.cardImage} 
          src={imagePath} 
          alt={pal.name}
          width={100}
          height={100}
          style={{ objectFit: "cover" }}
          priority
          unoptimized
        />
        </div>

        {/* Display the pal's name */}
        <h3 className={styles.cardTitle}>{pal.name}</h3>

        {/* Display the pal's work attributes */}
        <div className={styles.workIcons}>
          {Object.entries(pal).map(([key, value]) => 
            key !== 'id' && key !== 'name' && key !== 'type1' && key !== 'type2' && value > 0 ? (
              <WorkIcon key={key} iconName={key} value={value} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}