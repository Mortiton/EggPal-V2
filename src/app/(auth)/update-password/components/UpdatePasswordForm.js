"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateUserPassword } from "@/app/services/authService";
import styles from "@/app/components/styles/FormStyles.module.css";

/**
 * Yup schema for validating the update password form
 * @constant {Yup.ObjectSchema}
 */
const UpdatePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Required")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
      "Password must contain an uppercase letter, a lowercase letter, a number, and a special character."
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

/**
 * @typedef {Object} UpdatePasswordFormProps
 * @property {string} token - The password reset token
 */

/**
 * A form component for updating user password
 * @param {UpdatePasswordFormProps} props - The component props
 * @returns {JSX.Element} The rendered update password form
 */
const UpdatePasswordForm = ({ token }) => {
  const router = useRouter();
  const [error, setError] = useState("");

  /**
   * Handles the form submission for password update
   * @function
   * @async
   * @param {Object} values - The form values
   * @param {string} values.password - The new password
   * @param {string} values.confirmPassword - The confirmed new password
   * @param {Object} formikHelpers - Formik helper functions
   * @param {Function} formikHelpers.setSubmitting - Function to set the submitting state
   * @param {Function} formikHelpers.setFieldError - Function to set field-specific errors
   */
  const handleSubmit = useCallback(
    async (values, { setSubmitting, setFieldError }) => {
      const { password, confirmPassword } = values;

      if (!token) {
        setError("Reset token missing!");
        setSubmitting(false);
        return;
      }

      if (password !== confirmPassword) {
        setFieldError("confirmPassword", "Passwords must match!");
        setSubmitting(false);
        return;
      }

      try {
        const result = await updateUserPassword({ password, token });

        if (result.success) {
          router.push(
            `/success?title=${encodeURIComponent(
              "Password Updated"
            )}&description=${encodeURIComponent(result.message)}`
          );
        } else {
          if (
            result.message.includes(
              "New password should be different from the old password"
            )
          ) {
            setFieldError(
              "password",
              "New password must be different from your current password."
            );
          } else {
            setError(
              result.message || "Failed to update password. Please try again."
            );
          }
        }
      } catch (error) {
        setError(error.message || "An unexpected error occurred.");
      } finally {
        setSubmitting(false);
      }
    },
    [token, router]
  );

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={UpdatePasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.inputContainer}>
          <label htmlFor="password" className={styles.label}>
            New Password:
          </label>
          <Field
            id="password"
            name="password"
            type="password"
            className={styles.input}
            aria-required="true"
            aria-describedby="passwordError"
          />
          <ErrorMessage
            name="password"
            component="div"
            className={styles.validation}
            id="passwordError"
            role="alert"
          />

          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm New Password:
          </label>
          <Field
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={styles.input}
            aria-required="true"
            aria-describedby="confirmPasswordError"
          />
          <ErrorMessage
            name="confirmPassword"
            component="div"
            className={styles.validation}
            id="confirmPasswordError"
            role="alert"
          />

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            aria-live="polite"
          >
            Update Password
          </button>
        </Form>
      )}
    </Formik>
  );
};

UpdatePasswordForm.displayName = "UpdatePasswordForm";

export default UpdatePasswordForm;
