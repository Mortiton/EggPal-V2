"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

/**
 * Renders a success page with dynamic content based on URL parameters
 * @returns {JSX.Element} The rendered success page
 */
export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * The title of the success message, retrieved from URL parameters or default
   * @type {string}
   */
  const title = searchParams.get("title") || "Success";

  /**
   * The description of the success message, retrieved from URL parameters or default
   * @type {string}
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
