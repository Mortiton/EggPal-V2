import React from 'react';
import Link from 'next/link';
import ForgotPasswordForm from './components/ForgotPasswordForm'; // Adjust path as necessary
import styles from '../../components/styles/FormPage.module.css';

const ForgotPasswordPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Reset Your Password</h1>
      <p className={styles.description}>Enter your email below to send a recover password email.</p>
      <ForgotPasswordForm />
      <p className={styles.description}>Already have an account? <Link className={styles.link} href='./login'>sign in</Link></p> 
    </div>
  );
};

export default ForgotPasswordPage;