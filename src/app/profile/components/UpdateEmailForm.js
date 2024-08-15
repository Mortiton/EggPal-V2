"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateEmail } from "@/app/services/profileService";
import FeedbackModal from "@/app/components/FeedbackModal";
import styles from "@/app/components/styles/FormStyles.module.css";

// Define the validation schema for updating the email
const UpdateEmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

/**
 * UpdateEmailForm component that renders a form for updating the user's email.
 * It displays an error message if there is an error updating the email.
 * It also displays a feedback modal after the email is successfully updated or if an error occurs.
 *
 * @component
 * @returns {JSX.Element} A React component.
 */
export default function UpdateEmailForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const handleEmailUpdate = async (values) => {
    setModalContent({ title: "", message: "", type: "info" }); // Reset modal content
    try {
      const result = await updateEmail(values.email);
      if (result.error) {
        setModalContent({
          title: "Error",
          message: result.error,
          type: "error",
        });
      } else if (result.success) {
        setModalContent({
          title: "Success",
          message: "Please confirm the change on your new email address.",
          type: "success",
        });
      }
      setIsModalOpen(true);
    } catch (err) {
      setModalContent({
        title: "Error",
        message: err.message || "An unexpected error occurred.",
        type: "error",
      });
      setIsModalOpen(true);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
  };

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
      <FeedbackModal
        isOpen={isModalOpen}
        onRequestClose={handleModalConfirm}
        onConfirm={handleModalConfirm}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </>
  );
}

UpdateEmailForm.displayName = "UpdateEmailForm";

