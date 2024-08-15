"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TermsOfServiceModal from "./TermsOfServiceModal";
import FeedbackModal from "@/app/components/FeedbackModal";
import { toast } from "react-toastify";
import styles from "@/app/components/styles/FormStyles.module.css";
import { signup, checkUserExists } from "@/app/services/authService";

// Define form validation schema using Yup
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
  const router = useRouter();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "info" });
  const [formValues, setFormValues] = useState(null);

  const handleCheckUserAndOpenModal = async (values) => {
    try {
      const userExists = await checkUserExists(values.email);
      if (userExists) {
        setModalContent({
          title: "Error",
          message: "User already registered.",
          type: "error"
        });
        setIsModalOpen(true);
      } else {
        setFormValues(values);
        setIsTermsModalOpen(true);
      }
    } catch (err) {
      setModalContent({
        title: "Error",
        message: "An error occurred while checking user existence.",
        type: "error"
      });
      setIsModalOpen(true);
      toast.error("Signup process failed");
    }
  };

  const handleSignup = async () => {
    if (!formValues) return;

    try {
      const formData = new FormData();
      formData.append("email", formValues.email);
      formData.append("password", formValues.password);

      await signup(formData);
      setModalContent({
        title: "Success",
        message: "Please check your email to complete the signup process.",
        type: "success"
      });
      setIsModalOpen(true);
    } catch (err) {
      setModalContent({
        title: "Error",
        message: err instanceof Error ? err.message : "An unexpected error occurred.",
        type: "error"
      });
      setIsModalOpen(true);
      toast.error("Signup failed");
    }
  };

  const handleSuccessConfirm = () => {
    setIsModalOpen(false);
    if (modalContent.type === "success") {
      router.push("/");
      router.refresh(); // Refresh the page to update the session
    }
  };

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await handleCheckUserAndOpenModal(values);
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
        onAccept={() => {
          setIsTermsModalOpen(false);
          handleSignup();
        }}
      />
      <FeedbackModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleSuccessConfirm}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </>
  );
}

SignupForm.displayName = "SignupForm";
