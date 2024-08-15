"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@/app/components/styles/FormStyles.module.css";
import { toast } from 'react-toastify';
import { login } from "@/app/services/authService";

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
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const result = await login(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success('Logged in successfully');
      router.push("/");
      router.refresh(); 
    } catch (err) {
      setError(err.message);
      toast.error('Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
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
            aria-label="Password"
            aria-required="true"
            aria-describedby="passwordError"
            autoComplete="current-password"
          />
          <ErrorMessage
            name="password"
            component="div"
            className={styles.validation}
            id="passwordError"
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
            aria-label="Log in"
          >
            Log In
          </button>
          <button
            type="button"
            aria-label="Forgot Password"
            className={styles.button}
            onClick={() => router.push("/forgot-password")}
          >
            Forgot Password
          </button>
        </Form>
      )}
    </Formik>
  );
}

LoginForm.displayName = "LoginForm";