import React from 'react';
import styles from "./page.module.css";

/**
 * @component Loading
 * @description Renders a loading indicator with a spinner and text
 * @returns {JSX.Element} The rendered loading indicator
 */
export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading...</p>
    </div>
  );
}