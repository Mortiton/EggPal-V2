import SignupForm from './components/SignupForm';
import styles from './styles/page.module.css';

/**
 * SignupPage component that renders a signup page.
 * It displays a heading, a description, an error message (if any), and a SignupForm component.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {Object} props.searchParams - The search parameters from the URL.
 * @returns {JSX.Element} A React component.
 */
export default function SignupPage({ searchParams }) {
  // Extract error from search parameters
  const error = searchParams?.error;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign Up</h1>
      <p className={styles.description}>Create an account by entering your details below</p>
      {/* Display error message if error exists */}
      {error && (
        <p className={styles.error}>
          {error === 'password_mismatch' && 'Passwords do not match.'}
          {error === 'signup_failed' && 'Signup failed. Please try again.'}
        </p>
      )}
      {/* Render SignupForm component */}
      <SignupForm />
    </div>
  );
}