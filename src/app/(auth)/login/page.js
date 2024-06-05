import { login } from './actions'
import styles from './page.module.css';


export default function LoginPage() {
  return (
    <div className={styles.container}>
    <h1 className={styles.heading}>Login</h1>
    <p className={styles.description}>Enter your credentials below to sign into your account</p>
    <form className={styles.inputContainer}>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" className={styles.input} type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" className={styles.input} type="password" required />
      <button className={styles.button} formAction={login}>Log in</button>
    </form>
    </div>
  )
}