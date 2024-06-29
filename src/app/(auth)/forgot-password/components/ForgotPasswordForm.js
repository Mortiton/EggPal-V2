"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { resetPassword } from "../actions";
import SuccessModal from "@/app/components/SuccessModal";
import { toast } from "react-toastify";
import styles from "@/app/components/styles/FormStyles.module.css";


const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

/**
 * ForgotPasswordForm component
 * @returns {JSX.Element} The rendered JSX element
 */
const ForgotPasswordForm = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Handle the confirmation action
   */
  const handleConfirm = () => {
    setIsModalOpen(false);
    router.push("/login");
  };

  /**
   * Handle the form submission
   * @param {Object} values - The form values
   * @param {Object} actions - The formik actions
   */
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await resetPassword(values.email);
      setIsModalOpen(true);
      setSubmitting(false);
    } catch (error) {
      toast.error('Failed to send reset email: ' + error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleSubmit}
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
              aria-label="Email address"
              aria-required="true"
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.validation}
              role="alert"
            />
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-live="polite"
              aria-label="Send reset link"
            >
              Send Reset Link
            </button>
          </Form>
        )}
      </Formik>
      <SuccessModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        message="Password reset email sent! Check your inbox."
      />
    </>
  );
};

ForgotPasswordForm.displayName = 'ForgotPasswordForm';

export default ForgotPasswordForm;
