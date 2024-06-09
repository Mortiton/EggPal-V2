import React from 'react';
import UpdatePasswordForm from './components/UpdatePasswordForm'; // Adjust path as necessary
import styles from '../../components/styles/FormPage.module.css';

export const metadata = {
    title: 'Update Password',
  };
  
  export default function UpdatePasswordPage({ searchParams }) {
    const accessToken = searchParams.code;
  
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Update Your Password</h1>
        <p className={styles.description}>Input your new password.</p>
        <UpdatePasswordForm accessToken={accessToken} />
      </div>
    );
  }