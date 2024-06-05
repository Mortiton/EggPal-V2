"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import SuccessModal from "@/app/components/SuccessModal";
import { signup, checkUserExists } from "./actions";
import styles from "@/app/components/styles/FormStyles.module.css";

//Form scheme using Yup
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
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);


  const handleSignup = async () => {
    if (formData) {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      try {
        await signup(data);
        setIsSuccessModalOpen(true);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
    router.push("/");
  };

  return (
    <>
     <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);  
          setFormData(values);
          try {
            const userExists = await checkUserExists(values.email);
            if (userExists) {
              setError("User already registered");
              setSubmitting(false);
              return;
            }
            setIsPrivacyModalOpen(true);
          } catch (err) {
            setError(err.message);
          }
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
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.validation}
            />

            <label htmlFor="password" className={styles.label}>
              Password:
            </label>
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

            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password:
            </label>
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
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              Sign Up
            </button>
          </Form>
        )}
      </Formik>
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onRequestClose={() => setIsPrivacyModalOpen(false)}
        onAccept={() => {
          setIsPrivacyModalOpen(false);
          handleSignup();
        }}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onRequestClose={() => setIsSuccessModalOpen(false)}
        onConfirm={handleSuccessConfirm}
        message="Please check your emails to complete the signup process."
      />
    </>
  );
}
