import { createClient } from '@/app/utils/supabase/server';
import UpdateEmailForm from './UpdateEmailForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import styles from './styles/ProfilePage.module.css';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Profile</h1>
      <p className={styles.description}>Update your account details below</p>
      <UpdateEmailForm user={user} />
      <UpdatePasswordForm />
    </div>
  );
}