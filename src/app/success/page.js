"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

/**
 * @component SuccessPage
 * @description Renders a success page with dynamic content based on URL parameters
 * @returns {JSX.Element} The rendered success page
 */
export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * @type {string}
   * @description The title of the success message, retrieved from URL parameters or default
   */
  const title = searchParams.get("title") || "Success";

  /**
   * @type {string}
   * @description The description of the success message, retrieved from URL parameters or default
   */
  const description =
    searchParams.get("description") || "Operation completed successfully.";

  /**
   * Handles the redirection to the home page
   * @function
   */
  const handleRedirect = () => {
    window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <button className={styles.button} onClick={handleRedirect}>
        Return to Home
      </button>
    </div>
  );
}
