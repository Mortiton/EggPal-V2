"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { resetPassword } from "@/app/services/authService";
import styles from "@/app/components/styles/FormStyles.module.css";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      try {
        const result = await resetPassword(values.email);

        if (result.success) {
          router.push(`/success?title=${encodeURIComponent("Password Reset Email Sent")}&description=${encodeURIComponent(result.message)}`);
        } else {
          setError(result.message || "Failed to send reset email. Please try again.");
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [router]
  );

  return (
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
            autoComplete="email"
          />
          <ErrorMessage
            name="email"
            component="div"
            className={styles.validation}
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
            aria-label="Send reset link"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

ForgotPasswordForm.displayName = "ForgotPasswordForm";

export default ForgotPasswordForm;