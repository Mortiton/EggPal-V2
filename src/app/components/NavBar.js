import React from "react";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import styles from "./styles/NavBar.module.css";

export default function NavBar({ user }) {
  const isAuthenticated = !!user;
  // console.log(user)

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.title} aria-label="Home Page">
        EggPal
      </Link>
      <div className={styles.navLinks}>
        {isAuthenticated ? (
          <>
            <Link href="/favourite-pals" className={styles.link} aria-label="Favourite Pals">
              Favourite Pals
            </Link>
            <Link href="/saved-combinations" className={styles.link} aria-label="Saved Combinations">
              Saved Combinations
            </Link>
            <Link href="/profile" className={styles.link} aria-label="Profile">
              Profile
            </Link>
            <form action="/auth/signout" method="post">
              <button className={styles.logoutBtn} type="submit" role="menuitem" aria-label="logout">
                Logout
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.link} aria-label="Login">
              Login
            </Link>
            <Link href="/signup" className={styles.link} aria-label="Signup">
              Signup
            </Link>
          </>
        )}
      </div>
      <BurgerMenu isAuthenticated={isAuthenticated} />
    </nav>
  );
}

NavBar.displayName = "NavBar";