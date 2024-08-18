"use client";
import React, { useState, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TermsOfServiceModal from "./TermsOfServiceModal";
import FeedbackModal from "@/app/components/FeedbackModal";
import styles from "@/app/components/styles/FormStyles.module.css";
import { signup } from "@/app/services/authService";
import { useFeedbackModal } from "@/app/context/FeedbackModalContext";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
      "Password must contain an uppercase letter, a lowercase letter, a number, and a special character."
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

export default function SignupForm() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const { modalState, openFeedbackModal, handleModalClose } = useFeedbackModal();

  const handleSubmit = useCallback((values, { setSubmitting }) => {
    console.log("Form submitted:", values);
    setFormValues(values);
    setIsTermsModalOpen(true);
    setSubmitting(false);
  }, []);

  const handleTermsAccept = useCallback(async () => {
    console.log("Terms accepted, proceeding with signup");
    setIsTermsModalOpen(false);

    if (!formValues) {
      console.error("Form values not found");
      openFeedbackModal("Error", "An error occurred. Please try again.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", formValues.email);
      formData.append("password", formValues.password);

      const result = await signup(formData);
      console.log("Signup result:", result);

      if (result.success) {
        openFeedbackModal("Success", "Please check your email to complete the signup process.", "success");
      } else {
        openFeedbackModal("Error", result.message || "Signup failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      openFeedbackModal("Error", "An unexpected error occurred. Please try again.", "error");
    }
  }, [formValues, openFeedbackModal]);

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={SignupSchema}
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
              aria-required="true"
              aria-describedby="passwordError"
              autoComplete="new-password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.validation}
              id="passwordError"
              role="alert"
            />

            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password:
            </label>
            <Field
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={styles.input}
              aria-required="true"
              aria-describedby="confirmPasswordError"
              autoComplete="new-password"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className={styles.validation}
              id="confirmPasswordError"
              role="alert"
            />

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-live="polite"
            >
              Sign Up
            </button>
          </Form>
        )}
      </Formik>

      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onRequestClose={() => setIsTermsModalOpen(false)}
        onAccept={handleTermsAccept}
      />

      <FeedbackModal
        isOpen={modalState.isOpen}
        onRequestClose={handleModalClose}
        onConfirm={handleModalClose}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </>
  );
}