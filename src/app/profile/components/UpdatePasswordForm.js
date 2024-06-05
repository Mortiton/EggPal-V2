"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updatePassword } from "../actions";
import SuccessModal from "@/app/components/SuccessModal";
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
 * It displays an error message if there is an error updating the password.
 * It also displays a success modal after the password is successfully updated.
 *
 * @component
 * @returns {JSX.Element} A React component.
 */
export default function UpdatePasswordForm() {
  const [error, setError] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Function to handle updating the password
  const handlePasswordUpdate = async (values) => {
    setError(null);
    try {
      await updatePassword(values.currentPassword, values.newPassword);
      setIsSuccessModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to handle confirming the success modal
  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
  };

  // Render the form
  return (
    <>
      <Formik
        initialValues={{ currentPassword: "", newPassword: "", confirmNewPassword: "" }}
        validationSchema={UpdatePasswordSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await handlePasswordUpdate(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className={styles.inputContainer}>
            <label htmlFor="currentPassword" className={styles.label}>
              Current Password:
            </label>
            <Field id="currentPassword" name="currentPassword" type="password" className={styles.input} />
            <ErrorMessage name="currentPassword" component="div" className={styles.validation} />

            <label htmlFor="newPassword" className={styles.label}>
              New Password:
            </label>
            <Field id="newPassword" name="newPassword" type="password" className={styles.input} />
            <ErrorMessage name="newPassword" component="div" className={styles.validation} />

            <label htmlFor="confirmNewPassword" className={styles.label}>
              Confirm New Password:
            </label>
            <Field id="confirmNewPassword" name="confirmNewPassword" type="password" className={styles.input} />
            <ErrorMessage name="confirmNewPassword" component="div" className={styles.validation} />

            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.button} type="submit" disabled={isSubmitting}>
              Update Password
            </button>
          </Form>
        )}
      </Formik>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onRequestClose={handleSuccessConfirm}
        onConfirm={handleSuccessConfirm}
        message="Your password has been successfully updated."
      />
    </>
  );
}