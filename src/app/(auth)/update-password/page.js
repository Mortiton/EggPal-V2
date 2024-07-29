import React from 'react';
import UpdatePasswordForm from './components/UpdatePasswordForm';
import styles from '../../components/styles/FormPage.module.css';

export const metadata = {
  title: 'Update Password',
  description: 'Update your password'
};

export default function UpdatePasswordPage({ searchParams }) {
  const token = searchParams.token;
  const type = searchParams.type;

  if (!token || type !== 'recovery') {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Invalid Reset Link</h1>
        <p className={styles.description}>The password reset link is invalid or has expired.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Update Your Password</h1>
      <p className={styles.description}>Enter your new password below.</p>
      <UpdatePasswordForm token={token} />
    </div>
  );
}

UpdatePasswordPage.displayName = 'UpdatePasswordPage';