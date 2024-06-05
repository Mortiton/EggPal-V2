import LoginForm from './components/LoginForm';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Login</h1>
      <p className={styles.description}>Enter your credentials below to log into your account</p>
      <LoginForm />
    </div>
  );
}