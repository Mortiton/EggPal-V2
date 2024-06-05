"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "./actions";
import styles from "@/app/components/styles/FormStyles.module.css";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState(null);

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          try {
            await login(values);
            router.push("/");
          } catch (err) {
            setError(err.message);
            setSubmitting(false);
          }
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

            {error && <div className={styles.error}>{error}</div>}

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              Log In
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}