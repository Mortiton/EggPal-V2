"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '../actions';
import SuccessModal from '@/app/components/SuccessModal';
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

/**
 * UpdatePasswordForm component that renders a form for updating the password.
 * It displays input fields for the new password and password confirmation, and a submit button.
 * It also displays a success modal upon successful password update.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {string} props.accessToken - The access token for the user.
 * @returns {JSX.Element} A React component.
 */

const UpdatePasswordForm = ({ accessToken }) => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
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
        setIsSuccessModalOpen(true);
      } catch (err) {
        setError(err.message);
      }
  
      setSubmitting(false);
    };
  
    const handleSuccessConfirm = () => {
      setIsSuccessModalOpen(false);
      router.push('/');
    };
  
  
  return (
    <>
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

          <label htmlFor="confirmPassword" className={styles.label}>Confirm New Password:</label>
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

          {error && <div className={styles.error}>{error}</div>}

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
    <SuccessModal
        isOpen={isSuccessModalOpen}
        onRequestClose={() => setIsSuccessModalOpen(false)}
        onConfirm={handleSuccessConfirm}
        message="Your password has been updated successfully."
      />
    </>
  );
};

UpdatePasswordForm.displayName = 'UpdatePasswordForm'

export default UpdatePasswordForm;
