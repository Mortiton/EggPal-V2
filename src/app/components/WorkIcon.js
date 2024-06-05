import React from 'react';
import Image from 'next/image';
import styles from './styles/WorkIcon.module.css'; // Import styles specific to the WorkIcon

export default function WorkIcon({ iconName, value }) {
    // Only render the component if the value is greater than 0
    if (value <= 0) {
        return null; // Return null to avoid rendering anything for this component if the value is 0 or negative
    }

    const iconPath = `/images/work/${iconName}.png`; // Construct the path for the icon image

    return (
        <div className={styles.iconContainer}>
            <Image 
                src={iconPath} 
                alt={iconName} 
                width={25} 
                height={25} 
                className={styles.iconImage} 
            />
            <span className={styles.iconValue}>{value}</span>
        </div>
    );
}