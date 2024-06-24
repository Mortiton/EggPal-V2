"use client";

// Importing necessary libraries and components
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../actions";
import styles from "@/app/components/styles/FormStyles.module.css";

/**
 * Validation schema for the login form using Yup.
 * Ensures that email is a valid email format and that both email and password are required fields.
 * @type {Yup.ObjectSchema}
 */
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

/**
 * LoginForm component that renders a login form using Formik.
 * Handles user login, form validation, and error display.
 *
 * @component
 * @example
 * return (
 *   <LoginForm />
 * )
 */
export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      // Attempt to login
      await login(values);
      // Navigate to home page on successful login
      router.push("/");
    } catch (err) {
      // Set error message on login failure
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Formik component for form handling */}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.inputContainer}>
            {/* Email field */}
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
              aria-describedby="emailError"
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.validation}
              id="emailError"
              role="alert"
            />

            {/* Password field */}
            <label htmlFor="password" className={styles.label}>
              Password:
            </label>
            <Field
              id="password"
              name="password"
              type="password"
              className={styles.input}
              aria-label="Password"
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

            {/* Display error message if login fails */}
            {error && <div className={styles.error} role="alert">{error}</div>}

            {/* Submit button */}
            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-live="polite"
              aria-label="Log in"
            >
              Log In
            </button>
            <button
              type="button"
              aria-label="Forgot Password"
              className={styles.button}
              onClick={() => router.push('/forgot-password')}
            >
              Forgot Password
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}