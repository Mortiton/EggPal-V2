"use client";

import React, { useState, useCallback, useEffect } from "react";
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
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    console.log("isFeedbackModalOpen:", isFeedbackModalOpen);
    console.log("modalContent:", modalContent);
  }, [isFeedbackModalOpen, modalContent]);

  const handleCheckUserAndOpenModal = useCallback(async (values) => {
    try {
      const userExists = await checkUserExists(values.email);
      if (userExists) {
        setModalContent((prevContent) => ({
          title: "Error",
          message: "User already registered.",
          type: "error",
        }));
        setIsFeedbackModalOpen(true);
      } else {
        setFormValues(values);
        setIsTermsModalOpen(true);
      }
    } catch (err) {
      setModalContent((prevContent) => ({
        title: "Error",
        message: "An error occurred while checking user existence.",
        type: "error",
      }));
      setIsFeedbackModalOpen(true);
      toast.error("Signup process failed");
    }
  }, []);
  
  const handleSignup = useCallback(async () => {
    if (!formValues) return;
  
    try {
      const formData = new FormData();
      formData.append("email", formValues.email);
      formData.append("password", formValues.password);
  
      await signup(formData);
      
      console.log("Signup successful, updating modal content");
      setModalContent(prevContent => {
        console.log("Previous modal content:", prevContent);
        const newContent = {
          title: "Success",
          message: "Please check your email to complete the signup process.",
          type: "success",
        };
        console.log("New modal content:", newContent);
        return newContent;
      });
      
      console.log("Setting feedback modal to open");
      setIsFeedbackModalOpen(prevState => {
        console.log("Previous isFeedbackModalOpen:", prevState);
        return true;
      });
      
    } catch (err) {
      console.error("Signup error:", err);
      setModalContent(prevContent => ({
        title: "Error",
        message: err instanceof Error ? err.message : "An unexpected error occurred.",
        type: "error",
      }));
      setIsFeedbackModalOpen(true);
      toast.error("Signup failed");
    }
  }, [formValues]);

  const handleTermsAccept = useCallback(() => {
    setIsTermsModalOpen(false);
    setTimeout(() => {
      handleSignup();
    }, 100);
  }, [handleSignup]);

  const handleFeedbackModalClose = useCallback(() => {
    setIsFeedbackModalOpen(false);
    if (modalContent.type === "success") {
      router.push("/");
      router.refresh();
    }
  }, [modalContent.type, router]);

  const handleFeedbackModalConfirm = useCallback(() => {
    handleFeedbackModalClose();
  }, [handleFeedbackModalClose]);

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
        onRequestClose={useCallback(() => setIsTermsModalOpen(false), [])}
        onAccept={handleTermsAccept}
      />
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onRequestClose={handleFeedbackModalClose}
        onConfirm={handleFeedbackModalConfirm}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </>
  );
}

SignupForm.displayName = "SignupForm";
