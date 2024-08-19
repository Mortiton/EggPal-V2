"use client";

import React, { useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateEmail } from "@/app/services/profileService";
import { toast } from "react-toastify";
import styles from "@/app/components/styles/FormStyles.module.css";

const UpdateEmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export default function UpdateEmailForm() {
  const handleEmailUpdate = useCallback(async (values) => {
    try {
      const result = await updateEmail(values.email);
      if (result.error) {
        toast.error(result.error, {
          autoClose: false,
          closeOnClick: true,
        });
      } else if (result.success) {
        toast.success("Please confirm the change on your new email address.", {
          autoClose: false,
          closeOnClick: true,
        });
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.", {
        autoClose: false,
        closeOnClick: true,
      });
    }
  }, []);

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={UpdateEmailSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await handleEmailUpdate(values);
        setSubmitting(false);
        resetForm();
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
  );
}

UpdateEmailForm.displayName = "UpdateEmailForm";