"use client";

import React from "react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateEmail } from "@/app/services/profileService";
import SuccessModal from "@/app/components/SuccessModal";
import styles from "@/app/components/styles/FormStyles.module.css";

// Define the validation schema for updating the email
const UpdateEmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

/**
 * UpdateEmailForm component that renders a form for updating the user's email.
 * It displays an error message if there is an error updating the email.
 * It also displays a success modal after the email is successfully updated.
 *
 * @component
 * @param {Object} user - The user whose email is being updated.
 * @returns {JSX.Element} A React component.
 */
export default function UpdateEmailForm() {
  const [error, setError] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  /**
   * Function to handle updating the email.
   * It sets the error state if there is an error updating the email.
   * It sets the success modal state to open if the email is updated successfully.
   *
   * @param {Object} values - The form values.
   */
  const handleEmailUpdate = async (values) => {
    setError(null);
    try {
      await updateEmail(values.email);
      setIsSuccessModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Function to handle confirming the success modal.
   * It sets the success modal state to close.
   */
  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={UpdateEmailSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await handleEmailUpdate(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className={styles.inputContainer}>
            <label htmlFor="email" className={styles.label}>
              Email:
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              className={styles.input}
              aria-label="Email input field"
              autoComplete="email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.validation}
            />

            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
              aria-label="Update email button"
            >
              Update Email
            </button>
          </Form>
        )}
      </Formik>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onRequestClose={handleSuccessConfirm}
        onConfirm={handleSuccessConfirm}
        message="Please confirm the email change on your new email address."
      />
    </>
  );
}

UpdateEmailForm.displayName = "UpdateEmailForm";
