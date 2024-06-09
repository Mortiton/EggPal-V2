"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '../actions';
import styles from '@/app/components/styles/FormStyles.module.css';

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

const UpdatePasswordForm = ({ accessToken }) => {
    const router = useRouter();
    const [error, setError] = useState('');
  
    useEffect(() => {
      if (!accessToken) {
        setError('Reset token missing!');
      }
    }, [accessToken]);
  
    const handleSubmit = async (values, { setSubmitting }) => {
      const { password, confirmPassword } = values;
  
      if (!accessToken) {
        setError('Reset token missing!');
        setSubmitting(false);
        return;
      }
  
      if (password !== confirmPassword) {
        setError('Passwords must match');
        setSubmitting(false);
        return;
      }
  
      try {
        const response = await resetPassword({ password, accessToken });
        alert(response.message);
        router.push('/');
      } catch (err) {
        setError(err.message);
      }
  
      setSubmitting(false);
    };
  
  
  
  return (
    <Formik
      initialValues={{ password: '', confirmPassword: '' }}
      validationSchema={UpdatePasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.inputContainer}>
          <label htmlFor="password" className={styles.label}>New Password:</label>
          <Field
            id="password"
            name="password"
            type="password"
            className={styles.input}
          />
          <ErrorMessage
            name="password"
            component="div"
            className={styles.validation}
          />

          <label htmlFor="confirmPassword" className={styles.label}>Confirm New Password:</label>
          <Field
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={styles.input}
          />
          <ErrorMessage
            name="confirmPassword"
            component="div"
            className={styles.validation}
          />

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            Update Password
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default UpdatePasswordForm;
