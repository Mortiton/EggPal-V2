import React from 'react';
import UpdateEmailForm from './components/UpdateEmailForm';
import UpdatePasswordForm from './components/UpdatePasswordForm';
import DeleteUserForm from './components/DeleteUserForm';
import styles from '../components/styles/FormPage.module.css'

/**
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: 'Profile',
  description: 'Change your email, password or delete your account here',
};

/**
 * @component ProfilePage
 * @description Renders the user profile page with options to update email, password, and delete account
 * @returns {Promise<JSX.Element>} The rendered profile page
 */
export default async function ProfilePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Profile</h1>
      <p className={styles.description}>Update your account details below</p>
      <UpdateEmailForm />
      <UpdatePasswordForm />
      <DeleteUserForm />
    </div>
  );
}

ProfilePage.displayName = 'ProfilePage'