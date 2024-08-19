"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updatePassword } from "@/app/services/profileService";
import { toast } from "react-toastify";
import styles from "@/app/components/styles/FormStyles.module.css";

// Define the validation schema for updating the password
const UpdatePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Required"),
  newPassword: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
      "Password must contain an uppercase letter, a lowercase letter, a number, and a special character."
    )
    .required("Required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Required"),
});

/**
 * UpdatePasswordForm component that renders a form for updating the user's password.
 * It displays a toast notification for success or error after attempting to update the password.
 *
 * @component
 * @returns {JSX.Element} A React component.
 */
export default function UpdatePasswordForm() {
  /**
   * Function to handle updating the password.
   * It displays a toast notification for success or error.
   *
   * @param {Object} values - The form values.
   */
  const handlePasswordUpdate = async (values) => {
    try {
      await updatePassword(values.currentPassword, values.newPassword);
      toast.success("Your password has been successfully updated.", {
        autoClose: false,
        closeOnClick: true,
      });
    } catch (err) {
      toast.error(err.message || "An error occurred while updating the password.", {
        autoClose: false,
        closeOnClick: true,
      });
    }
  };

  // Render the form
  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }}
      validationSchema={UpdatePasswordSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await handlePasswordUpdate(values);
        setSubmitting(false);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.inputContainer}>
          <label htmlFor="currentPassword" className={styles.label}>
            Current Password:
          </label>
          <Field
            id="currentPassword"
            name="currentPassword"
            type="password"
            className={styles.input}
            aria-label="Current password input field"
            autoComplete="current-password"
          />
          <ErrorMessage
            name="currentPassword"
            component="div"
            className={styles.validation}
          />

          <label htmlFor="newPassword" className={styles.label}>
            New Password:
          </label>
          <Field
            id="newPassword"
            name="newPassword"
            type="password"
            className={styles.input}
            aria-label="New password input field"
            autoComplete="new-password"
          />
          <ErrorMessage
            name="newPassword"
            component="div"
            className={styles.validation}
          />

          <label htmlFor="confirmNewPassword" className={styles.label}>
            Confirm New Password:
          </label>
          <Field
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            className={styles.input}
            aria-label="Confirm new password input field"
            autoComplete="new-password"
          />
          <ErrorMessage
            name="confirmNewPassword"
            component="div"
            className={styles.validation}
          />

          <button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
            aria-label="Update password button"
          >
            Update Password
          </button>
        </Form>
      )}
    </Formik>
  );
}

UpdatePasswordForm.displayName = "UpdatePasswordForm";