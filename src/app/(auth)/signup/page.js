import SignupForm from "./components/SignupForm";
import styles from "../../components/styles/FormPage.module.css";

export const metadata = {
  title: "Sign Up",
  description: "Create an account to access EggPal features",
};

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
  const error = searchParams?.error;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Sign Up</h2>
      <p className={styles.description}>
        Create an account by entering your details below
      </p>
      {error && (
        <p className={styles.error}>
          {error === "password_mismatch" && "Passwords do not match."}
          {error === "signup_failed" && "Signup failed. Please try again."}
        </p>
      )}
      <SignupForm />
    </div>
  );
}

SignupPage.displayName = "SignupPage";
