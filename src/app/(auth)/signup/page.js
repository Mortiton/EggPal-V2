import React from "react";
import SignupForm from "./components/SignupForm";
import styles from "../../components/styles/FormPage.module.css";
import Link from "next/link";

/**
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: "Sign Up",
  description: "Create an account to access EggPal features",
};

/**
 * @typedef {Object} SearchParams
 * @property {string} [error] - Error message passed as a query parameter
 */

/**
 * @component SignupPage
 * @description Renders the signup page with a form for user registration
 * @param {Object} props - The component props
 * @param {SearchParams} props.searchParams - The search parameters from the URL
 * @returns {JSX.Element} The rendered signup page
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
      <p className={styles.description}>
        Already have an account?{" "}
        <Link className={styles.link} href="./login">
          Sign in
        </Link>
      </p>
    </div>
  );
}

SignupPage.displayName = "SignupPage";
