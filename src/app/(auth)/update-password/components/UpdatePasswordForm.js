"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateUserPassword } from '@/app/services/authService'
import FeedbackModal from "@/app/components/FeedbackModal";
import styles from "@/app/components/styles/FormStyles.module.css";

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

const UpdatePasswordForm = ({ token }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = useCallback(async (values, { setSubmitting, setFieldError, setStatus, resetForm }) => {
    const { password, confirmPassword } = values;
    
    if (!token) {
      setStatus("Reset token missing!");
      setSubmitting(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setFieldError("confirmPassword", "Passwords must match!");
      setSubmitting(false);
      return;
    }
  
    try {
      const result = await updateUserPassword({ password, token });
      
      setModalContent({
        title: result.success ? "Success" : "Error",
        message: result.message,
        type: result.success ? "success" : "error",
      });
  
      if (result.success) {
        resetForm();
        setFormKey(prev => prev + 1);
      }
    } catch (error) {
      if (error.message.includes("New password should be different from the old password")) {
        setFieldError("password", "New password must be different from your current password.");
      } else {
        setStatus(error.message || "An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
      setIsModalOpen(true);
    }
  }, [token]);

  const handleConfirm = useCallback(() => {
    setIsModalOpen(false);
    if (modalContent.type === "success") {
      router.push("/");
    }
  }, [modalContent.type, router]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <Formik
        key={formKey}
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={UpdatePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className={styles.inputContainer}>
            <label htmlFor="password" className={styles.label}>
              New Password:
            </label>
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

            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password:
            </label>
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

            {status && <div className={styles.error}>{status}</div>}

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
      <FeedbackModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onConfirm={handleConfirm}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </>
  );
};

UpdatePasswordForm.displayName = "UpdatePasswordForm";

export default UpdatePasswordForm;