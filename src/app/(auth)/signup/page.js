
import SignupForm from './SignupForm';
import styles from './styles/page.module.css';


export default function SignupPage({ searchParams }) {
  const error = searchParams?.error;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign Up</h1>
      <p className={styles.description}>Create an account by entering your details below</p>
      {error && (
        <p className={styles.error}>
          {error === 'password_mismatch' && 'Passwords do not match.'}
          {error === 'signup_failed' && 'Signup failed. Please try again.'}
        </p>
      )}
      <SignupForm />
    </div>
  );
}