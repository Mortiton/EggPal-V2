"use client"
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./page.module.css";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const title = searchParams.get('title') || 'Success';
  const description = searchParams.get('description') || 'Operation completed successfully.';

  const handleRedirect = () => {
    window.location.href = '/';
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