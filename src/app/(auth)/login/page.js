// Importing necessary components and styles
import LoginForm from "./components/LoginForm";
import styles from "../../components/styles/FormPage.module.css";

export const metadata = {
  title: 'Login',
  description: 'Enter your credentials to log into your account',
};


/**
 * LoginPage component that renders a login page.
 * It displays a heading, a description, and a LoginForm component.
 *
 * @component
 * @example
 * return (
 *   <LoginPage />
 * )
 */
export default function LoginPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Login</h1>
      <p className={styles.description}>
        Enter your credentials below to log into your account
      </p>

      <LoginForm />
    </div>
  );
}

LoginPage.displayName = 'LoginPage'