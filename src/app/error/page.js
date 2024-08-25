"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./styles/page.module.css"; // Import specific styles for the page

/**
 * @component ErrorPage
 * @description Renders an error page with a message and a button to return to the home page
 * @returns {JSX.Element} The rendered error page
 */
export default function ErrorPage() {
  const router = useRouter();

  /**
   * Handles the click event on the "Go Back" button
   * @function
   */
  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Error</h1>
      <p className={styles.description}>Sorry, something went wrong.</p>
      <button className={styles.button} onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
}

ErrorPage.displayName = "ErrorPage";
