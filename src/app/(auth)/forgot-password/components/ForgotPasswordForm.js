"use client";

import React, { useState, useCallback } from "react";
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
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [formKey, setFormKey] = useState(0);

  const handleConfirm = useCallback(() => {
    setIsModalOpen(false);
    if (modalContent.type === "success") {
      router.push("/");
    }
  }, [modalContent.type, router]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      try {
        const result = await resetPassword(values.email);

        setModalContent({
          title: result.success ? "Success" : "Error",
          message: result.message,
          type: result.success ? "success" : "error",
        });

        setIsModalOpen(true);

        if (result.success) {
          resetForm();
          setFormKey(prev => prev + 1);
        }
      } catch (error) {
        setModalContent({
          title: "Error",
          message: "An unexpected error occurred. Please try again.",
          type: "error",
        });
        setIsModalOpen(true);
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  return (
    <>
      <Formik
        key={formKey}
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
        onRequestClose={handleCloseModal}
        onConfirm={handleConfirm}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </>
  );
};

ForgotPasswordForm.displayName = "ForgotPasswordForm";

export default ForgotPasswordForm;