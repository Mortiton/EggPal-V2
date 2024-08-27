import React from "react";
import LoginForm from "./components/LoginForm";
import styles from "../../components/styles/FormPage.module.css";
import Link from "next/link";

/**
 * Metadata for the login page
 * @type {Object} Represents the Metadata object from Next.js
 */
export const metadata = {
  title: "Login",
  description: "Enter your credentials to log into your account",
};

/**
 * Renders the login page with a form for user authentication
 * @returns {React.ReactElement} The rendered forgot password page
 */
export default function LoginPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Login</h1>
      <p className={styles.description}>
        Enter your credentials below to log into your account
      </p>

      <LoginForm />
      <p className={styles.description}>
        Don&apos;t have an account?{" "}
        <Link className={styles.link} href="./signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}

LoginPage.displayName = "LoginPage";
