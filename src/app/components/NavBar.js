import React from "react";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import styles from "./styles/NavBar.module.css";
import { createClient } from "../utils/supabase/server";
import { getSession } from "../services/authService";
import { redirect } from "next/navigation";

/**
 * NavBar component that renders a navigation bar.
 * It displays a title and different links based on whether a user is logged in or not.
 * If a user is logged in, it displays links to the user's favourite pals, saved combinations, profile, and a logout button.
 * If a user is not logged in, it displays links to the login and signup pages.
 *
 * @component
 * @returns {JSX.Element} A React component.
 */
export default async function NavBar() {
  const session = await getSession();
  const isAuthenticated = !!session;

  const handleLogout = async () => {
    try {
      const response = await fetch("/auth/signout", { method: "POST" });
      if (response.ok) {
        redirect("/");
      } else {
        console.error("Failed to logout:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.title} aria-label="Home Page">
        EggPal
      </Link>
      <div className={styles.navLinks}>
        {isAuthenticated ? (
          <>
            <Link
              href="/favourite-pals"
              className={styles.link}
              aria-label="Favourite Pals"
            >
              Favourite Pals
            </Link>
            <Link
              href="/saved-combinations"
              className={styles.link}
              aria-label="Saved Combinations"
            >
              Saved Combinations
            </Link>
            <Link href="/profile" className={styles.link} aria-label="Profile">
              Profile
            </Link>
            <form action="auth/signout" method="post">
              <button
                className={styles.logoutBtn}
                type="submit"
                role="menuitem"
                aria-label="logout"
              >
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
