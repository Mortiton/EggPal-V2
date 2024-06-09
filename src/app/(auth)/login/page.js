// Importing necessary components and styles
import LoginForm from './components/LoginForm';
import styles from '../../components/styles/FormPage.module.css';

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
      {/* Heading */}
      <h1 className={styles.heading}>Login</h1>
      {/* Description */}
      <p className={styles.description}>Enter your credentials below to log into your account</p>
      {/* LoginForm component */}
      <LoginForm />
    </div>
  );
}