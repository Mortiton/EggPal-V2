"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './styles/ChildButton.module.css';

/**
 * ChildButton component that displays the child image and name and shows the saved breeding combinations on click.
 *
 * @param {{ child: string, combos: Array }} props
 * @returns {JSX.Element} A React component.
 */
export default function ChildButton({ child, combos, userId, onClick, isSelected }) {
  const handleClick = () => {
    onClick(child, combos);
  }


  const childImage = combos[0]?.child.image || '/images/default.png';
  const childName = combos[0]?.child.name || 'Unknown';

  return (
    <div className={styles.childContainer}>
       <div className={`${styles.childButton} ${isSelected ? styles.selected : ''}`} onClick={handleClick}>
        <Image
          src={childImage}
          alt={childName}
          className={styles.childImage}
          width={100}
          height={100}
          unoptimized
        />
        <span className={styles.childName}>{childName}</span>
      </div>
    </div>
  );
}
