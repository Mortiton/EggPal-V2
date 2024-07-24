import React from 'react';
import Image from 'next/image';
import styles from './styles/WorkIcon.module.css'; // Import styles specific to the WorkIcon

/**
 * WorkIcon component that renders an icon for a work skill.
 * It only renders the icon if the value is greater than 0.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {string} props.iconUrl - The URL of the icon to render.
 * @param {number} props.value - The value associated with the icon.
 * @returns {JSX.Element|null} A React component, or null if the value is 0 or negative.
 */
export default function WorkIcon({ iconUrl, value }) {
    if (value <= 0) {
      return null;
    }
  
    return (
      <div className={styles.iconContainer} role="img" aria-label={`Icon: ${value}`}>
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
  
  
  WorkIcon.displayName = 'WorkIcon';