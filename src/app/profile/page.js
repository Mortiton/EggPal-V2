import { createClient } from '@/app/utils/supabase/server';
import UpdateEmailForm from './components/UpdateEmailForm';
import UpdatePasswordForm from './components/UpdatePasswordForm';
import DeleteUserForm from './components/DeleteUserForm';
import styles from '../components/styles/FormPage.module.css'
import { redirect } from 'next/navigation';

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
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    redirect('/login');
  }

  // Render the profile page
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Profile</h1>
      <p className={styles.description}>Update your account details below</p>
      <UpdateEmailForm user={user} />
      <UpdatePasswordForm />
      <DeleteUserForm />
    </div>
  );
}