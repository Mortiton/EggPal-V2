"use client";
import styles from './styles/page.module.css';

export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Error</h1>
      <p className={styles.description}>Sorry, something went wrong.</p>
      <button className={styles.button} onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
}