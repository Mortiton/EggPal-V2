import React from "react";
import Image from "next/image";
import styles from "./styles/PalCard.module.css";
import WorkIcon from "./WorkIcon";

export default function PalCard({
  palName,
  palId,
  type1,
  type2,
  workAttributes,
}) {
  const imagePath = `/images/pals/${palId}.png`;
  const type1Path = `/images/types/${type1}.png`;
  const type2Path = type2 ? `/images/types/${type2}.png` : null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.typeIcons}>
          {type1Path && (
            <Image 
              src={type1Path} 
              alt={type1} 
              width={24}
              height={24}
              className={styles.typeIcon} />
          )}
          {type2Path && (
            <Image 
              src={type2Path} 
              alt={type2} 
              width={24}
              height={24}
              className={styles.typeIcon} />
          )}
        </div>

        <div className={styles.cardImageWrapper}>
        <Image 
          className={styles.cardImage} 
          src={imagePath} 
          alt={palName}
          width={100}
          height={100}
          style={{ objectFit: "cover" }}
          priority
        />
        </div>
        <h3 className={styles.cardTitle}>{palName}</h3>

        <div className={styles.workIcons}>
          {Object.entries(workAttributes).map(([iconName, value]) => (
            <WorkIcon key={iconName} iconName={iconName} value={value} />
          ))}
        </div>
      </div>
    </div>
  );
}
