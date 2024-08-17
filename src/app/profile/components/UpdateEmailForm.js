"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateEmail } from "@/app/services/profileService";
import FeedbackModal from "@/app/components/FeedbackModal";
import styles from "@/app/components/styles/FormStyles.module.css";

const UpdateEmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export default function UpdateEmailForm() {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const isMounted = useRef(true);

  useEffect(() => {
    // Ensure modal is closed on mount
    setIsFeedbackModalOpen(false);
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleEmailUpdate = useCallback(async (values) => {
    setModalContent(prevContent => ({ title: "", message: "", type: "info" })); // Reset modal content
    try {
      const result = await updateEmail(values.email);
      if (result.error) {
        setModalContent(prevContent => ({
          title: "Error",
          message: result.error,
          type: "error",
        }));
      } else if (result.success) {
        setModalContent(prevContent => ({
          title: "Success",
          message: "Please confirm the change on your new email address.",
          type: "success",
        }));
      }
      setIsFeedbackModalOpen(true);
    } catch (err) {
      setModalContent(prevContent => ({
        title: "Error",
        message: err.message || "An unexpected error occurred.",
        type: "error",
      }));
      setIsFeedbackModalOpen(true);
    }
  }, []);

  const handleFeedbackModalClose = useCallback(() => {
    setIsFeedbackModalOpen(false);
  }, []);

  const handleFeedbackModalConfirm = useCallback(() => {
    handleFeedbackModalClose();
  }, [handleFeedbackModalClose]);

  useEffect(() => {
    console.log("Current state:", { isFeedbackModalOpen, modalContent });
  }, [isFeedbackModalOpen, modalContent]);

  return (
    <>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={UpdateEmailSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await handleEmailUpdate(values);
          setSubmitting(false);
        }}
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
              aria-label="Email input field"
              autoComplete="email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.validation}
            />

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
              aria-label="Update email button"
            >
              Update Email
            </button>
          </Form>
        )}
      </Formik>
      {isFeedbackModalOpen && (
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onRequestClose={handleFeedbackModalClose}
          onConfirm={handleFeedbackModalConfirm}
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
        />
      )}
    </>
  );
}

UpdateEmailForm.displayName = "UpdateEmailForm";