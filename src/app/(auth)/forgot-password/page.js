import React from "react";
import Link from "next/link";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import styles from "../../components/styles/FormPage.module.css";

/**
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

/**
 * @component ForgotPasswordPage
 * @description Renders the forgot password page with a form to reset user password
 * @returns {React.ReactElement} The rendered forgot password page
 */
const ForgotPasswordPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Reset Your Password</h1>
      <p className={styles.description}>
        Enter your email below to send a recover password email.
      </p>
      <ForgotPasswordForm />
      <p className={styles.description}>
        Already have an account?{" "}
        <Link className={styles.link} href="./login">
          Sign in
        </Link>
      </p>
    </div>
  );
};

ForgotPasswordPage.displayName = "ForgotPasswordPage";

export default ForgotPasswordPage;
