import Link from 'next/link';
import styles from './styles/NavBar.module.css';

/**
 * NavBar component that renders a navigation bar.
 * It displays a title and different links based on whether a user is logged in or not.
 * If a user is logged in, it displays links to the user's favourite pals, saved combinations, profile, and a logout button.
 * If a user is not logged in, it displays links to the login and signup pages.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {Object} props.user - The user object. If it exists, the user is logged in.
 * @returns {JSX.Element} A React component.
 */
export default function NavBar({ user }) {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.title}>EggPal</Link>
      <div className={styles.navLinks}>
        {/* If user is logged in, display user links */}
        {user ? (
          <>
            <Link href="/profile" className={styles.link}>Favourite Pals</Link>|
            <Link href="/profile" className={styles.link}>Saved Combinations</Link>|
            <Link href="/profile" className={styles.link}>Profile</Link>
            <form action='auth/signout' method='post'>
              <button className={styles.logoutBtn} type="submit">Logout</button>
            </form>
          </>
        ) : (
          /* If user is not logged in, display login and signup links */
          <>
            <Link href="/login" className={styles.link}>Login</Link>
            <Link href="/signup" className={styles.link}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}