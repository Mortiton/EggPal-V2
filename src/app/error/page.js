"use client";
import styles from './styles/page.module.css'; // Import specific styles for the page

/**
 * ErrorPage component that renders an error page.
 * It displays an error message and a "Go Back" button.
 * When the "Go Back" button is clicked, it navigates the user back to the previous page.
 *
 * @component
 * @returns {JSX.Element} A React component.
 */
export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Error</h1>
      <p className={styles.description}>Sorry, something went wrong.</p>
      {/* When the "Go Back" button is clicked, navigate the user back to the previous page */}
      <button className={styles.button} onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
}