import React from "react";
import Image from "next/image";
import styles from "./styles/WorkIcon.module.css";

/**
 * WorkIcon component for displaying a work skill icon with its value.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.iconUrl - The URL of the icon image
 * @param {number} props.value - The numeric value associated with the icon
 * @returns {JSX.Element|null} The rendered WorkIcon component or null if value is 0 or less
 */
export default function WorkIcon({ iconUrl, value }) {
  if (value <= 0) {
    return null;
  }

  return (
    <div
      className={styles.iconContainer}
      role="img"
      aria-label={`Icon: ${value}`}
    >
      <Image
        src={iconUrl}
        alt={`Icon`}
        width={25}
        height={25}
        className={styles.iconImage}
        priority
      />
      <span className={styles.iconValue}>{value}</span>
    </div>
  );
}

WorkIcon.displayName = "WorkIcon";
