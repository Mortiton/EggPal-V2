"use client"

import React from 'react';
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '../actions'; // Ensure to create this action
import styles from '@/app/components/styles/FormStyles.module.css';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const ForgotPasswordForm = () => {
  const router = useRouter();

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={ForgotPasswordSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await resetPassword(values.email);
          alert('Password reset email sent! Check your inbox.');
          router.push('/login'); // Navigate to login page on success
        } catch (error) {
          alert('Failed to send reset email: ' + error.message);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.inputContainer}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <Field
            id="email"
            name="email"
            type="email"
            className={styles.input}
          />
          <ErrorMessage
            name="email"
            component="div"
            className={styles.validation}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            Send Reset Link
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordForm;