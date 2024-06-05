import Link from 'next/link';
import styles from './styles/NavBar.module.css';

export default function NavBar({ user }) {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.title}>EggPal</Link>
      <div className={styles.navLinks}>
      {user ? (
        <>
          <Link href="/profile" className={styles.link}>Profile</Link>
          <form action='auth/signout' method='post'>
            <button className={styles.logoutBtn} type="submit">Logout</button>
          </form>
        </>
      ) : (
        <>
          <Link href="/login" className={styles.link}>Login</Link>
          <Link href="/signup" className={styles.link}>Signup</Link>
        </>
      )}
</div>
    </nav>
  );
}