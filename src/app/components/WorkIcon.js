import React from 'react';
import Image from 'next/image';
import styles from './styles/WorkIcon.module.css'; // Import styles specific to the WorkIcon

/**
 * WorkIcon component that renders an icon for a work.
 * It only renders the icon if the value is greater than 0.
 *
 * @component
 * @param {string} iconName - The name of the icon to render.
 * @param {number} value - The value associated with the icon.
 * @returns {JSX.Element|null} A React component, or null if the value is 0 or negative.
 */
export default function WorkIcon({ iconName, value }) {
    // Only render the component if the value is greater than 0
    if (value <= 0) {
        return null; // Return null to avoid rendering anything for this component if the value is 0 or negative
    }

    const iconPath = `/images/work/${iconName}.png`; // Construct the path for the icon image

    // Render the icon and its associated value
    return (
        <div className={styles.iconContainer} role="img" aria-label={`${iconName}: ${value}`}>
            <Image 
                src={iconPath} 
                alt={`${iconName} icon`} 
                width={25} 
                height={25} 
                className={styles.iconImage} 
                priority 
            />
            <span className={styles.iconValue}>{value}</span>
        </div>
    );
}