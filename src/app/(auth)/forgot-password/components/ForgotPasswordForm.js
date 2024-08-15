"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { resetPassword } from "@/app/services/authService";
import FeedbackModal from "@/app/components/FeedbackModal";
import styles from "@/app/components/styles/FormStyles.module.css";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "info" });

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (modalContent.type === "success") {
      router.push("/login");
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await resetPassword(values.email);
      setModalContent({
        title: "Success",
        message: "If an account with this email exists, a password reset email has been sent. Please check your inbox.",
        type: "success"
      });
      resetForm();
    } catch (error) {
      setModalContent({
        title: "Error",
        message: error.message || "Failed to send reset email. Please try again.",
        type: "error"
      });
    } finally {
      setIsModalOpen(true);
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
              autoComplete="email"
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
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </Form>
        )}
      </Formik>
      <FeedbackModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </>
  );
};

ForgotPasswordForm.displayName = 'ForgotPasswordForm';

export default ForgotPasswordForm;