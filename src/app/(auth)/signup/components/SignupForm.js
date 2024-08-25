"use client";
import React, { useState, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import TermsOfServiceModal from "./TermsOfServiceModal";
import styles from "@/app/components/styles/FormStyles.module.css";
import { signup } from "@/app/services/authService";

/**
 * Yup schema for validating the signup form
 * @constant {Yup.ObjectSchema}
 */
const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
      "Password must contain an uppercase letter, a lowercase letter, a number, and a special character."
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

/**
 * @typedef {Object} FormValues
 * @property {string} email - User's email address
 * @property {string} password - User's chosen password
 * @property {string} confirmPassword - Password confirmation
 */

/**
 * @component SignupForm
 * @description A form component for user registration with terms of service acceptance
 * @returns {JSX.Element} The rendered signup form
 */
export default function SignupForm() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  /**
   * Handles the initial form submission
   * @function
   * @param {FormValues} values - The form values
   * @param {Object} actions - Formik actions object
   * @param {Function} actions.setSubmitting - Function to set the submitting state
   */
  const handleSubmit = useCallback((values, { setSubmitting }) => {
    setFormValues(values);
    setIsTermsModalOpen(true);
    setSubmitting(false);
  }, []);

  /**
   * Handles the acceptance of terms of service and completes the signup process
   * @function
   * @async
   */
  const handleTermsAccept = useCallback(async () => {
    setIsTermsModalOpen(false);

    if (!formValues) {
      setError("An error occurred. Please try again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", formValues.email);
      formData.append("password", formValues.password);

      const result = await signup(formData);

      if (result.success) {
        router.push(
          `/success?title=${encodeURIComponent(
            "Signup Email Sent"
          )}&description=${encodeURIComponent(
            "Please check your emails to complete signup."
          )}`
        );
      } else {
        setError(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  }, [formValues, router]);

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={SignupSchema}
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
              aria-required="true"
              aria-describedby="emailError"
              autoComplete="email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.validation}
              id="emailError"
              role="alert"
            />

            <label htmlFor="password" className={styles.label}>
              Password:
            </label>
            <Field
              id="password"
              name="password"
              type="password"
              className={styles.input}
              aria-required="true"
              aria-describedby="passwordError"
              autoComplete="new-password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.validation}
              id="passwordError"
              role="alert"
            />

            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password:
            </label>
            <Field
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={styles.input}
              aria-required="true"
              aria-describedby="confirmPasswordError"
              autoComplete="new-password"
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
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-live="polite"
            >
              Sign Up
            </button>
          </Form>
        )}
      </Formik>

      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onRequestClose={() => setIsTermsModalOpen(false)}
        onAccept={handleTermsAccept}
      />
    </>
  );
}
