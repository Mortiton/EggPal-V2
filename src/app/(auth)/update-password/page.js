import React from "react";
import UpdatePasswordForm from "./components/UpdatePasswordForm";
import styles from "../../components/styles/FormPage.module.css";

/**
 * Metadata for the update password page
 * @type {Object} Represents the Metadata object from Next.js
 */
export const metadata = {
  title: "Update Password",
  description: "Update your password",
};

/**
 * @typedef {Object} SearchParams
 * @property {string} [token] - The password reset token
 * @property {string} [type] - The type of password update (e.g., 'recovery')
 */

/**
 * Renders the update password page, showing either the password update form or an invalid link message
 * @param {Object} props - The component props
 * @param {SearchParams} props.searchParams - The search parameters from the URL
 * @returns {JSX.Element} The rendered update password page
 */
export default function UpdatePasswordPage({ searchParams }) {
  const token = searchParams.token;
  const type = searchParams.type;

  /**
   * Renders the invalid link message
   * @returns {JSX.Element} The invalid link message JSX
   */
  if (!token || type !== "recovery") {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Invalid Reset Link</h1>
        <p className={styles.description}>
          The password reset link is invalid or has expired.
        </p>
      </div>
    );
  }

  /**
   * Renders the update password form
   * @returns {JSX.Element} The update password form JSX
   */
  const renderUpdateForm = () => (
    <div className={styles.container}>
      <h1 className={styles.heading}>Update Your Password</h1>
      <p className={styles.description}>Enter your new password below.</p>
      <UpdatePasswordForm token={token} />
    </div>
  );

  // Conditional rendering based on token and type
  if (!token || type !== "recovery") {
    return renderInvalidLink();
  }

  return renderUpdateForm();
}

UpdatePasswordPage.displayName = "UpdatePasswordPage";
