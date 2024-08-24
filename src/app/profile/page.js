import React from 'react';
import UpdateEmailForm from './components/UpdateEmailForm';
import UpdatePasswordForm from './components/UpdatePasswordForm';
import DeleteUserForm from './components/DeleteUserForm';
import styles from '../components/styles/FormPage.module.css'

export const metadata = {
  title: 'Profile',
  description: 'Change your email, password or delete your account here',
};


/**
 * ProfilePage component that renders the profile page for the authenticated user.
 * It displays forms for updating the user's email and password, and for deleting the user.
 * If the user is not authenticated, it redirects to the login page.
 *
 * @component
 * @returns {JSX.Element} A React component.
 */
export default async function ProfilePage() {

  // Render the profile page
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